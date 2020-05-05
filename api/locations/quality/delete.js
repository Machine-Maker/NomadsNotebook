const del = 'DELETE FROM quality_locations WHERE id=$1'

export default async (req, res) => {
  const client = await global.pool.connect()
  const results = await client.query(del, [req.params.id])
  client.release()
  if (!results.rowCount) res.sendStatus(204)
  else res.sendStatus(200)
}
