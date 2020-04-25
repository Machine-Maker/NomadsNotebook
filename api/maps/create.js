import { mapTypes } from '../utils'

const insert = 'INSERT INTO maps (name, region, type) VALUES ($1, $2, $3) RETURNING *'

export default async (req, res) => {
  const client = await global.pool.connect()
  const results = await client.query(insert, [req.body.name, req.body.region, req.body.type])
  client.release()
  if (!results.rowCount) res.sendStatus(204)
  else res.status(200).send({ ...results.rows[0], difficulty: mapTypes[results.rows[0].type] })
}
