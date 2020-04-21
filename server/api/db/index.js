const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

// Setup db connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

class QueryError extends Error {
  constructor(message, status = 500) {
    super(message)
    this.name = this.constructor.name
    this.status = 500
  }
}

const utils = {
  formatQuery: (result, def = null) => {
    return { results: result ? result.rows : def }
  },
  formatSingle: (result, def = null) => {
    return { result: result ? result.rows[0] : def }
  },
  QueryError
}

export default async (req, res, next) => {
  const paths = req.path.split('/').filter((p) => !!p)
  const client = await pool.connect()

  if (!paths.length) {
    // base path '/'
    console.log('base')
    res.sendStatus(200)
  } else {
    let filePath = '.'
    while (paths.length) {
      filePath += '/' + paths.shift()
    }
    let absFilePath = path.join(__dirname, filePath)
    if (fs.existsSync(absFilePath)) {
      if (fs.lstatSync(absFilePath).isDirectory()) {
        absFilePath += '/index.js'
      } else {
        absFilePath += '.js'
      }
    } else res.sendStatus(404)
    try {
      const result = await require(absFilePath)(req, res, client, utils)
      res.status(200).send(result)
      client.release()
    } catch (err) {
      if (err instanceof QueryError) {
        res.status(err.status).send(err.message)
      } else {
        console.error(err)
        res.status(500).send(err)
      }
    }
  }
}
