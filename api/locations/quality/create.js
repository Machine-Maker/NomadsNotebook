const insert = 'INSERT INTO quality_locations (map_id, material, location, quality) VALUES ($1, $2, $3, $4) RETURNING *'

export default async (req, res) => {
  const client = await global.pool.connect()
  const results = await client.query(insert, [req.body.map_id, req.body.material, req.body.location, req.body.quality])
  client.release()
  if (!results.rowCount) res.sendStatus(204)
  else res.status(200).send({ ...results.rows[0] })
}
