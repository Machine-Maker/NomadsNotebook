require('dotenv').config()
const express = require('express')
const consola = require('consola')
const { Pool } = require('pg')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const config = require('../nuxt.config.js')

// Import and Set Nuxt.js options
config.dev = process.env.NODE_ENV === 'development'

global.pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

global.perms = {
  OWNER: 0b001,
  USE_API: 0b0010,
  VIEW_MAP: 0b0100,
  CHANGE_PERMS: 0b1000
}

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
