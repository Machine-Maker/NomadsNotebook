import { param, body } from 'express-validator'

import { auth, errors } from '../../middleware'
import { materials } from '../../utils'

import create from './create'
import read from './read'
import update from './update'
import del from './delete'

const mapIdBody = body('map_id', 'Map ID is missing')
  .exists()
  .isNumeric()
  .withMessage('Map ID is not numeric')
const materialBody = body('material', 'Material is missing')
  .exists()
  .isIn(Object.keys(materials))
  .withMessage('Invalid material type')
const locationBody = body('location', 'Location is missing')
  .exists()
  .custom((value) => {
    if (value.split(', ').length === 2) return true
    throw new Error('Invalid location format')
  })
  .withMessage('Invalid location format')
const qualityBody = body('quality', 'Missing quality')
  .exists()
  .custom((value) => {
    if (/^\d+\+?$/.test(value)) return true
    throw new Error('Invalid quality format')
  })
  .withMessage('Invalid quality format')

const mainBody = [mapIdBody, materialBody, locationBody, qualityBody]

export default (router) => {
  router.post('/locations/quality', [auth('EDIT_MAP'), ...mainBody, errors], create)
}
