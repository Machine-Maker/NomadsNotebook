import axios from 'axios'
import express from 'express'
import { Pool } from 'pg'
import { serve, setup } from 'swagger-ui-express'

import * as swaggerConfig from '../docs/reference/API.v1.json'
import perms from './utils/perms'
import auth from './auth/'
import users from './users'

const router = express.Router()

const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

router.use('/docs', serve, setup(swaggerConfig))

global.pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

global.api = axios.create({
  baseURL: `${process.env.BASE_URL}/api`
})

global.perms = perms

auth(router)
users(router)

router.use((err, req, res, next) => {
  console.log(Object.keys(err))
  console.error(err.message)
  if (process.env.NODE_ENV === 'development') console.error(err.stack)
  res.status(500).json({ type: err.constructor.name, msg: err.message, stack: err.stack })
})

export default {
  path: '/api',
  handler: router
}
