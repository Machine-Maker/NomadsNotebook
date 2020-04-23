import { formatQuery, formatSingle } from '../../server/utils/format'

export default async (req, res) => {
  try {
    const client = await global.pool.connect()
    if (!req.params.user) {
      const results = await client.query('SELECT * FROM users')
      client.release()
      res.status(200).send(formatQuery(results))
    } else {
      const results = await client.query('SELECT * FROM users WHERE snowflake=$1', [req.params.user])
      client.release()
      res.status(200).send(formatSingle(results))
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}
