import { query } from 'express-validator'
import axios from 'axios'

import { perms } from '../utils'
import { delimitedArray } from '../validators'

const auth = axios.create({
  baseURL: 'https://discordapp.com/api'
})

export default async (req, res) => {
  if (process.env.NODE_ENV === 'development' && req.query.test !== 'true') return res.sendStatus(200)
  else if (!req.get('Authorization') || !req.get('Authorization').split(' ')[1]) {
    return res.sendStatus(401)
  }

  try {
    const {
      data: { id }
    } = await auth.get('/users/@me', {
      headers: {
        Authorization: `Bearer ${req.get('Authorization').split(' ')[1]}`
      }
    })
    const client = await global.pool.connect()
    const { rows, rowCount } = await client.query('SELECT permissions FROM users WHERE snowflake=$1', [id])
    client.release()
    if (!rowCount) return res.sendStatus(401)
    for (const perm of req.query.perms.split(',')) {
      if (!(parseInt(rows[0].permissions, 2) & global.perms[perm].b)) {
        return res.sendStatus(401)
      }
    }
    return res.sendStatus(200)
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).send(err.response.data.message)
    } else {
      console.error(err)
      res.status(500).send(err)
    }
  }
}

export const validateVerify = [
  query(perms)
    .exists()
    .custom(delimitedArray(Object.keys(perms), '$1 is not a valid permission!'))
]
