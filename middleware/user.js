import { stringify } from 'querystring'

export default ({ app, error, env }) => {
  const query = {
    perms: 'VIEW_USERS'
  }
  return app.$api.get(`/auth/verify?${stringify(query)}`).catch((err) => {
    error({
      message: err.response.data,
      statusCode: 401
    })
  })
}
