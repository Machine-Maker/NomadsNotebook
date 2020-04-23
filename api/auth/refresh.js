import { stringify } from 'querystring'
import { header } from 'express-validator'

import { oauth2, baseRequest } from './token'

export default (req, res) => {
  oauth2
    .post(
      '/token',
      stringify({
        ...baseRequest,
        grant_type: 'refresh_token',
        refresh_token: req.get('Refresh-Token')
      })
    )
    .then(({ data }) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json(err.response.data)
    })
}

export const refreshValidate = [header('Refresh-Token', 'No Token header found!').exists()]
