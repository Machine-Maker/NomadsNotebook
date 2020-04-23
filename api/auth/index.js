import { errors } from '../validators'
import token, { validate } from './token'
import verify from './verify'

export default (router) => {
  router.get('/auth/token', [...validate, errors], token)
  router.get('/auth/verify', verify)
}
