import { param } from 'express-validator'

export default async (req, res) => {
  const client = await global.pool.connect()
  const results = await client.query('SELECT * FROM users WHERE snowflake=$1', [req.params.user])
  client.release()
  if (!results.rowCount) res.sendStatus(204)
  else res.status(200).send({ snowflake: results.rows[0].snowflake, permissions: results.rows[0].permissions })
}

export const userParam = [param('user', 'User param is not a number!').isNumeric()]
