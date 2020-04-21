const { existsSync } = require('fs')
const { Pool } = require('pg')

// Setup db connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

const routes = {
  users: {
    list: async (req, res, client) => {
      const result = await client.query('SELECT * FROM users')
      res.status(200).send(formatQuery(result))
      client.release()
    }
  }
}

export default async (req, res, next) => {
  const paths = req.path.split('/').filter((p) => !!p)
  const client = await pool.connect()

  if (!paths.length) {
    // base path '/'
    console.log('base')
    res.sendStatus(200)
  } else {
    let route = routes
    while (paths.length) {
      const curr = paths.shift()
      if (!route[curr]) return res.sendStatus(404)
      route = route[curr]
    }
    if (typeof route !== 'function') return res.sendStatus(404)
    // console.log(route)
    try {
      const result = await route(req, res, client)
      res.status(200).send(result)
    } catch (err) {
      console.error(err)
      res.status(500).send(err)
    }
  }
}

function formatQuery(result, def = null) {
  return { results: result ? result.rows : def }
}
