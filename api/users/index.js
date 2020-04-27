import { auth, errors } from '../middleware'
import { formatQuery } from '../utils'
import read, { userParam } from './read'
import create from './create'
import del from './delete'
import update, { permissionBody } from './update'

export default (router) => {
  router.get('/users', [auth('VIEW_USERS'), errors], async (req, res) => {
    const client = await global.pool.connect()
    const results = await client.query('SELECT * FROM users')
    client.release()
    res.status(200).send(formatQuery(results, []))
  })

  router.get('/users/:user', [auth('VIEW_USERS'), ...userParam, errors], read)

  router.post('/users/:user', [auth('ADD_USER'), ...userParam, ...permissionBody, errors], create)

  router.delete('/users/:user', [auth('DELETE_USER'), ...userParam, errors], del)

  router.put('/users/:user', [auth('EDIT_USER'), ...userParam, ...permissionBody, errors], update)
}
