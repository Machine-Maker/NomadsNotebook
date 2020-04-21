import fs from 'fs'
import path from 'path'
import { ApiError } from '../errors/_index.js'

export default async (req, res, next) => {
  const paths = req.path.split('/').filter((p) => !!p)

  if (!paths.length) {
    return res.sendStatus(404)
  } else {
    let filePath = '.'
    while (paths.length) {
      filePath += '/' + paths.shift()
    }
    let absFilePath = path.join(__dirname, filePath)

    if (fs.existsSync(absFilePath) && fs.lstatSync(absFilePath).isDirectory()) absFilePath += '/index.js'
    else if (fs.existsSync(absFilePath + '.js')) absFilePath += '.js'
    else return res.sendStatus(404)

    try {
      const response = await require(absFilePath)(req)
      res.status(200).send(response)
    } catch (err) {
      if (err instanceof ApiError) {
        res.status(err.status).send(err.message)
      } else {
        console.error(err)
        res.status(500).send(err)
      }
    }
  }
}
