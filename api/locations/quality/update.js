const update = 'UPDATE quality_locations SET material=$1, location=$2, quality=$3 WHERE id=$4 RETURNING *'

export default async (req, res) => {
  const client = await global.pool.connect()
  const results = await client.query(update, [req.body.material, req.body.location, req.body.quality, req.params.id])
  if (!results.rowCount) res.sendStatus(204)
  else res.status(200).send(results.rows[0])
  client.release()
}
