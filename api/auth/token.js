import { stringify } from 'querystring'
import { query } from 'express-validator'
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

export default async (req, res) => {
  const { data } = await oauth2.post(
    '/token',
    stringify({ ...baseRequest, grant_type: 'authorization_code', code: req.query.code })
  )
  res.status(200).json(data)
  const { data: discordData } = await axios.get('https://discordapp.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${data.access_token}`
    }
  })
  const client = await global.pool.connect()
  await client.query('UPDATE users SET avatar=$1, username=$2, discriminator=$3 WHERE snowflake=$4', [
    discordData.avatar,
    discordData.username,
    discordData.discriminator,
    discordData.id
  ])
  client.release()
  // oauth2
  //   .post(
  //     '/token',
  //     stringify({
  //       ...baseRequest,
  //       grant_type: 'authorization_code',
  //       code: req.query.code
  //     })
  //   )
  //   .then(({ data }) => {
  //     res.status(200).json(data)
  //     axios
  //       .get('https://discordapp.com/api/users/@me', {
  //         headers: {
  //           Authorization: `Bearer ${data.access_token}`
  //         }
  //       })
  //       .then(({ data }) => {
  //         const client = await global
  //         console.log(data)
  //       })
  //   })
  //   .catch((err) => {
  //     res.status(err.response.status).json(err.response.data)
  //   })
}

export const codeValidate = [query('code', 'No code query param provided!').exists()]
