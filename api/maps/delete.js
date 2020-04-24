const remove = 'DELETE FROM maps WHERE id=$1'

export default async (req, res) => {
  const client = await global.pool.connect()
  const results = await client.query(remove, [req.params.map])
  client.release()
  if (!results.rowCount) res.sendStatus(204)
  else res.sendStatus(200)
}
