import { auth } from '../middleware'
import { errors } from '../validators'
import get from './get'
import add, { validate } from './add'

export default (router) => {
  router.get('/users/get/:user?', [auth()], get)
  router.get('/users/add', [auth('ADD_USER'), ...validate, errors], add)
}
