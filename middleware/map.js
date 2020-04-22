import { stringify } from 'querystring'

export default ({ app, error }) => {
  return app.$api
    .get(`/auth/verify?${stringify({ perms: 'VIEW_MAP' })}`, {
      headers: {
        Authorization: `Bearer ${app.$cookies.get('auth-access-token')}`
      }
    })
    .catch((err) => {
      error({
        message: err.response.data,
        statusCode: 401
      })
    })
}
