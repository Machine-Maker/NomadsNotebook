import { query, header } from 'express-validator'
import axios from 'axios'

import { perms } from '../utils'
import { delimitedArray } from '../validators'

const discordApi = axios.create({
  baseURL: 'https://discordapp.com/api'
})

export default (req, res, next) => {
  discordApi
    .get('/users/@me', {
      headers: {
        Authorization: `Bearer ${req.get('Authorization').split(' ')[1]}`
      }
    })
    .then(({ data: { id } }) => {
      console.log('debug1')
      return new Promise((resolve, reject) => {
        global.pool.connect((err, client, release) => {
          if (err) reject(err)
          else resolve({ id, client, release })
        })
      })
    })
    .then(({ id, client, release }) => {
      console.log('debug2')
      return new Promise((resolve, reject) => {
        client.query('SELECT permissions FROM users WHERE snowflake=$1', [id], (err, { rows, rowCount }) => {
          release()
          if (err) return reject(err)
          console.log('debug3')
          if (!rowCount) return res.sendStatus(400)
          if (!req.query.perms.split(',').every((p) => parseInt(rows[0].permissions, 2) & perms[p].b))
            res.sendStatus(401)
          else res.sendStatus(200)
        })
      })
    })
    .catch((err) => {
      console.log('debug4')
      if (err.response) res.status(err.response.status).send(err.response.data)
      else next(err)
    })
}

export const verifyValidate = [
  query('perms')
    .exists()
    .custom(delimitedArray(Object.keys(perms), '$1 is not a valid permission!')),
  header('Authorization')
    .if((value, { req }) => process.env.NODE_ENV !== 'development' || req.query.test === 'true')
    .exists()
    .custom((value, { req }) => {
      if (!req.get('Authorization').split(' ')[1]) throw new Error('Authorization header is not formatted correctly')
    })
]
