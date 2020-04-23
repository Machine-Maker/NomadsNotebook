import { stringify } from 'querystring'
import { header } from 'express-validator'
import axios from 'axios'

export const oauth2 = axios.create({
  baseURL: process.env.OAUTH2_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export const baseRequest = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: `${process.env.BASE_URL}/login`,
  scope: 'identify'
}

export default (req, res) => {
  oauth2
    .post(
      '/token',
      stringify({
        ...baseRequest,
        grant_type: 'authorization_code',
        code: req.get('Code')
      })
    )
    .then(({ data }) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(err.response.status).json(err.response.data)
    })
}

export const codeValidate = [header('Code', 'No code query param provided!').exists()]
