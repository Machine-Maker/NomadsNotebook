import { param } from 'express-validator'

import { auth, errors } from '../middleware'

import quality from './quality'

export default (router) => {
  quality(router)

  router.get(
    '/maplocations/:map',
    [
      auth('VIEW_MAPS'),
      param('map')
        .exists()
        .isNumeric(),
      errors
    ],
    async (req, res) => {
      const client = await global.pool.connect()
      const results = await client.query('SELECT * FROM quality_locations WHERE map_id=$1', [req.params.map])
      client.release()
      res.status(200).json({ locations: results.rows })
    }
  )
}
