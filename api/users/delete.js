const remove = 'DELETE FROM users WHERE snowflake=$1'

export default async (req, res) => {
  const client = await global.pool.connect()
  const results = await client.query(remove, [req.params.user])
  client.release()
  if (!results.rowCount) res.sendStatus(204)
  else res.sendStatus(200)
}
