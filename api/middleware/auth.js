import { stringify } from 'querystring'

export default (...perms) => {
  if (!perms.includes('USE_API')) perms.push('USE_API')
  return (req, res, next) => {
    global.api
      .get(`/auth/verify?${stringify({ perms: perms.join(','), test: req.query.test || 'false' })}`, {
        headers: {
          Authorization: req.get('Authorization') || 'None'
        }
      })
      .then(() => next())
      .catch(() => res.sendStatus(401))
  }
}
