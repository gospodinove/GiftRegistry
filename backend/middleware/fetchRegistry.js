const { ObjectId } = require('mongodb')
const { COLLECTION_NAMES } = require('../constants')
const { sendErrorResponse, replaceId } = require('../utils')

module.exports = async function fetchRegistry(req, res, next) {
  const db = req.app.locals.db
  const registryId = res.locals.fetchRegistryOverrideId ?? req.params.registryId

  try {
    const registry = await db
      .collection(COLLECTION_NAMES.registries)
      .findOne({ _id: ObjectId(registryId) })

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
