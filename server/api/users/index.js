import { formatQuery } from '../../utils/format'

module.exports = async (req) => {
  const client = await global.pool.connect()
  const result = await client.query('SELECT * FROM users')
  client.release()
  return formatQuery(result)
}
