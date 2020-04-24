import { body } from 'express-validator'

import { perms } from '../utils'

const insert = 'INSERT INTO users(snowflake, permissions) VALUES ($1, $2)'

export default async (req, res) => {
  const client = await global.pool.connect()
  await client.query(insert, [req.params.user, req.body.permissions])
  client.release()
  res.status(200).send({ snowflake: req.params.user, permissions: req.body.permissions })
}
