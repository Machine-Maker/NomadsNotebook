import { stringify } from 'querystring'

export default ({ app, error, env }) => {
  const query = {
    perms: 'VIEW_MAP'
  }
  if (env.nodeEnv === 'development') query.test = 'true'
  return app.$api.get(`/auth/verify?${stringify(query)}`).catch((err) => {
    error({
      message: err.response.data,
      statusCode: 401
    })
  })
}
