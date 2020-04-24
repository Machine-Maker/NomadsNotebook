import { auth } from '../middleware'
import { errors } from '../validators'
import { formatQuery, asyncWrap } from '../utils'
import get, { userParam } from './get'
import add from './add'
import remove from './remove'
import update, { permissionBody } from './update'

export default (router) => {
  router.get(
    '/users',
    [auth(), errors],
    asyncWrap(async (req, res) => {
      const client = await global.pool.connect()
      const results = await client.query('SELECT * FROM users')
      client.release()
      res.status(200).send(formatQuery(results))
    })
  )

  router.get('/users/:user', [auth(), ...userParam, errors], asyncWrap(get))

  router.post('/users/:user', [auth('ADD_USER'), ...userParam, ...permissionBody, errors], asyncWrap(add))

  router.delete('/users/:user', [auth('DELETE_USER'), ...userParam, errors], asyncWrap(remove))

  router.put('/users/:user', [auth('EDIT_USER'), ...userParam, ...permissionBody, errors], asyncWrap(update))
}
