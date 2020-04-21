import { stringify } from 'querystring'
import axios from 'axios'

const oauth2 = axios.create({
  baseURL: process.env.OAUTH2_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

const baseRequest = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: `${process.env.BASE_URL}/login`,
  scope: 'identify'
}

export default (req, res, next) => {
  let tokenPromise = null
  if (req.query.code) {
    tokenPromise = oauth2.post(
      '/token',
      stringify({
        ...baseRequest,
        grant_type: 'authorization_code',
        code: req.query.code
      })
    )
  } else if (req.query.refresh_token) {
    tokenPromise = oauth2.post(
      '/token',
      stringify({
        ...baseRequest,
        grant_type: 'refresh_token',
        refresh_token: req.query.refresh_token
      })
    )
  } else {
    return res.status(500).send(new Error('No valid query params!'))
  }

  tokenPromise
    .then(({ data }) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json(err.response.data)
    })
}
