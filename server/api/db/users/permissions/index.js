const perms = {
  VIEW_MAP: 0b01,
  CHANGE_PERMS: 0b10
}

module.exports = async (req, res, client, { formatSingle, QueryError }) => {
  if (!req.query.user) return res.status(400).send('No user query param specified!')
  const result = await client.query('SELECT permissions FROM users WHERE snowflake=$1', [req.query.user])
  if (!result.rowCount) throw new QueryError('Not a valid user!')
  const permInt = parseInt(result.rows[0].permissions, 2)
  const userPerms = []
  for (const perm in perms) {
    if (perms[perm] & permInt) userPerms.push(perm)
  }
  return { userPerms }
}
