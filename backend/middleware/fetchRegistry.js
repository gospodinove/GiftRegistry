const { ObjectId } = require('mongodb')
const { sendErrorResponse, replaceId } = require('../utils')

module.exports = async function fetchRegistry(req, res, next) {
  const db = req.app.locals.db

  try {
    const registry = await db
      .collection('registries')
      .findOne({ _id: ObjectId(req.params.registryId) })

    if (!registry) {
      sendErrorResponse(res, 404, 'general', 'Could not find registry')
      return
    }

    res.locals.registry = replaceId(registry)
    next()
  } catch {
    sendErrorResponse(res, 500, 'general', 'Something went wrong')
  }
}