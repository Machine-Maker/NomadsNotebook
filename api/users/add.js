import { body } from 'express-validator'

import { perms } from '../utils'

const insert = 'INSERT INTO users(snowflake, permissions) VALUES ($1, $2)'

export default async (req, res) => {
  const client = await global.pool.connect()
  client.query(insert, [req.body.snowflake, req.body.permissions], (err, result) => {
    console.log(err)
    console.log(result)
    client.release()
    res.sendStatus(200)
  })
}

export const validate = [
  body('snowflake', 'No snowflake provided!').exists(),
  body('permissions', 'No permissions bitfield provided!').exists(),
  body('permissions', `Permisisons bitfield should be of length:${Object.keys(perms).length}!`).isLength({
    min: Object.keys(perms).length,
    max: Object.keys(perms).length
  })
]
