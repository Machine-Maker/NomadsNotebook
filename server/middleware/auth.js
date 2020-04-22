import { stringify } from 'querystring'
import axios from 'axios'

const api = axios.create({
  baseURL: `${process.env.BASE_URL}/api`
})

const whitelist = ['/auth/token', '/auth/verify']

export default (req, res, next) => {
  if (whitelist.includes(req.path)) return next()

  console.log(req.get('Authorization'))

  api
    .get(`/auth/verify?${stringify({ perms: 'USE_API', test: req.query.test || 'false' })}`, {
      headers: {
        Authorization: req.get('Authorization') || 'None'
      }
    })
    .then(() => {
      next()
    })
    .catch(() => {
      res.sendStatus(401)
    })
}
