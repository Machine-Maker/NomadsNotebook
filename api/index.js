import axios from 'axios'
import express from 'express'
import Router from 'express-promise-router'
import { Pool } from 'pg'
import { serve, setup } from 'swagger-ui-express'

import * as swaggerConfig from '../docs/reference/API.v1.json'
import { perms, mapTypes, regions, materials } from './utils'
import authRoute from './auth/'
import users from './users'
import maps from './maps'

const router = Router()

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

authRoute(router)
users(router)
maps(router)

router.get('/maptypes', (req, res) => {
  const result = []
  for (const type in mapTypes) {
    result.push({
      type,
      difficulty: mapTypes[type].difficulty,
      desc: `${mapTypes[type].name} - ${mapTypes[type].difficulty}`
    })
  }
  res.status(200).send(result)
})

router.get('/permissions', (req, res) => {
  const result = []
  for (const perm in perms) {
    result.push({ perm, value: perms[perm].b, desc: perms[perm].desc })
  }
  res.status(200).send(result)
})

router.get('/regions', (req, res) => {
  const result = []
  for (const region in regions) {
    result.push({ region, fullRegion: regions[region] })
  }
  res.status(200).send(result)
})

router.get('/materials', (req, res) => {
  const result = []
  for (const mat in materials) {
    result.push({ name: mat, desc: materials[mat] })
  }
  res.status(200).send(result)
})

router.get('/@me', (req, res, next) => {
  if (!req.get('Authorization')) return req.status(400).send('No Authorization header found')
  axios
    .get('https://discordapp.com/api/users/@me', {
      headers: {
        Authorization: req.get('Authorization')
      }
    })
    .then(async ({ data }) => {
      try {
        const client = await global.pool.connect()
        const results = await client.query('SELECT * FROM users WHERE snowflake=$1', [data.id])
        res.status(200).send(results.rows[0])
        client.release()
      } catch (err) {
        next(err)
      }
    })
    .catch(({ response: { status, data } }) => {
      res.status(status).send(data)
    })
})

router.use((err, req, res, next) => {
  console.error(err.message)
  if (process.env.NODE_ENV === 'development') console.error(err.stack)
  res.status(500).json({ type: err.constructor.name, msg: err.message, stack: err.stack, err })
})

export default {
  path: '/api',
  handler: router
}
