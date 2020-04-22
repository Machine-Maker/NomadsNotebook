import axios from 'axios'
import { ApiError } from '../../errors/_index.js'

const auth = axios.create({
  baseURL: 'https://discordapp.com/api'
})

module.exports = async (req) => {
  let perms = []
  if (!req.query.perms) {
    perms.push('USE_API')
  } else {
    perms = req.query.perms.split(',')
    for (const perm of perms) {
      if (!global.perms[perm]) {
        throw new ApiError(`${perm} is not a valid permission!`, 400)
      }
    }
  }

  if (process.env.NODE_ENV === 'development' && req.query.test === 'true') return 'OK'
  else if (!req.get('Authorization') || !req.get('Authorization').split(' ')[1]) {
    throw new ApiError('Unauthorized: No Authorization header found!', 401)
  }

  try {
    const {
      data: { id, username }
    } = await auth.get('/users/@me', {
      headers: {
        Authorization: `Bearer ${req.get('Authorization').split(' ')[1]}`
      }
    })
    const client = await global.pool.connect()
    const { rows, rowCount } = await client.query('SELECT permissions FROM users WHERE snowflake=$1', [id])
    client.release()
    if (!rowCount) throw new ApiError('Unauthorized', 401)
    for (const perm of perms) {
      if (!(parseInt(rows[0].permissions, 2) & global.perms[perm])) {
        throw new ApiError('Unauthorized', 401)
      }
    }
    return 'OK'
  } catch (err) {
    let response = null
    if (err instanceof ApiError) {
      response = err
    } else if (err.response) {
      response = new ApiError(err.response.data.message, err.response.status, err.response.data.code)
    } else {
      console.log(err)
      response = new ApiError(err.response, 500)
    }
    throw response
  }
}
