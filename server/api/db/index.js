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

const utils = {
  formatQuery: (result, def = null) => {
    return { results: result ? result.rows : def }
  }
}

// const routes = {
//   users: {
//     list: async (req, res, client) => {
//       const result = await client.query('SELECT * FROM users')
//       res.status(200).send(formatQuery(result))
//       client.release()
//     }
//   }
// }

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
    filePath += '.js'
    const absFilePath = path.join(__dirname, filePath)
    if (!fs.existsSync(absFilePath)) res.sendStatus(404)
    try {
      const result = await require(absFilePath)(req, res, client, utils)
      res.status(200).send(result)
      client.release()
    } catch (err) {
      console.error(err)
      res.status(500).send(err)
    }
    //   let route = routes
    //   while (paths.length) {
    //     const curr = paths.shift()
    //     if (!route[curr]) return res.sendStatus(404)
    //     route = route[curr]
    //   }
    //   if (typeof route !== 'function') return res.sendStatus(404)
    //   // console.log(route)
    //   try {
    //     const result = await route(req, res, client)
    //     res.status(200).send(result)
    //   } catch (err) {
    //     console.error(err)
    //     res.status(500).send(err)
    //   }
    // }
  }
}
