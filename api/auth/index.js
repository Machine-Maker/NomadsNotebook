import { errors } from '../middleware'
import token, { codeValidate } from './token'
import verify, { verifyValidate } from './verify'
import refresh, { refreshValidate } from './refresh'

export default (router) => {
  router.get('/auth/token', [...codeValidate, errors], token)
  router.get('/auth/refresh', [...refreshValidate, errors], refresh)
  router.get('/auth/verify', [...verifyValidate, errors], verify)
}
