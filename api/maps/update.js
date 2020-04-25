import { mapTypes } from '../utils'

const update = 'UPDATE maps SET name=$1, region=$2, type=$3 WHERE id=$4 RETURNING *'

export default async (req, res) => {
  const client = await global.pool.connect()
  const results = await client.query(update, [req.body.name, req.body.region, req.body.type, req.params.map])
  client.release()
  if (!results.rowCount) res.sendStatus(204)
  else res.status(200).send({ ...results.rows[0], difficulty: mapTypes[results.rows[0].type] })
}
