import { body } from 'express-validator'

import { perms } from '../utils'

const update = 'UPDATE users SET permissions=$1 WHERE snowflake=$2'

export default async (req, res) => {
  const client = await global.pool.connect()
  const results = await client.query(update, [req.body.permissions, req.params.user])
  client.release()
  const user = { snowflake: req.params.user, permissions: req.body.permissions }
  if (!results.rowCount) res.status(204).send(user)
  else res.status(200).send(user)
}

export const permissionBody = [
  body('permissions', 'No permissions bitfield provided!').exists(),
  body('permissions', `Permisisons bitfield should be of length:${Object.keys(perms).length}!`).isLength({
    min: Object.keys(perms).length,
    max: Object.keys(perms).length
  })
]
