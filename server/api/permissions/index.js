import { ApiError } from '../../errors/_index'

module.exports = async (req) => {
  if (!req.query.user) throw new ApiError('No user query param specified!', 400)
  const client = await global.pool.connect()
  const result = await client.query('SELECT permissions FROM users WHERE snowflake=$1', [req.query.user])
  client.release()
  const userPerms = []
  if (!result.rowCount) return { userPerms }
  const permInt = parseInt(result.rows[0].permissions, 2)
  for (const perm in global.perms) {
    if (global.perms[perm] & permInt) userPerms.push(perm)
  }
  return { userPerms }
}
