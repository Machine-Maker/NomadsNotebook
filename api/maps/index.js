import { param, body } from 'express-validator'

import { auth, errors } from '../middleware'
import { regions, mapTypes, formatQuery } from '../utils'

import create from './create'
import read from './read'
import update from './update'
import del from './delete'

const mapParam = param('map', 'Map ID must be numeric!').isNumeric()
const nameBody = body('name', 'Map name is missing!').exists()
const regionBody = body('region', 'Map region is missing!')
  .exists()
  .isIn(Object.keys(regions))
  .withMessage(`Region must be on of ${Object.keys(regions).join(', ')}`)
const typeBody = body('type', 'Map type is missing!')
  .exists()
  .isIn(Object.keys(mapTypes))
  .withMessage(`Map type muxt be one of ${Object.keys(mapTypes).join(', ')}`)
const mapBody = [nameBody, regionBody, typeBody]

export default (router) => {
  router.get('/maps', [auth('VIEW_MAP')], async (req, res) => {
    const client = await global.pool.connect()
    const results = await client.query('SELECT * FROM maps')
    client.release()
    res.status(200).send(formatQuery(results))
  })

  router.post('/maps', [auth('ADD_MAP'), ...mapBody, errors], create)

  router.get('/maps/:map', [auth(), mapParam, errors], read)

  router.put('/maps/:map', [auth('EDIT_MAP'), mapParam, ...mapBody, errors], update)

  router.delete('/maps/:map', [auth('DELETE_MAP'), mapParam, errors], del)
}
