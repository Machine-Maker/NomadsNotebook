import { mapTypes } from '../utils'

const select = 'SELECT * FROM maps WHERE id=$1'

export default async (req, res) => {
  const client = await global.pool.connect()
  const results = await client.query(select, [req.params.map])
  client.release()
  if (!results.rowCount) res.sendStatus(204)
  else res.status(200).send({ ...results.rows[0], difficulty: mapTypes[results.rows[0].type].difficulty })
}
