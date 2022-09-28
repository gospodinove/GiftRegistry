const { ObjectId } = require('mongodb')
const { COLLECTION_NAMES, ERROR_TYPES } = require('../constants')
const { sendErrorResponse, replaceId } = require('../utils')

module.exports = async function fetchRegistry(req, res, next) {
  const db = req.app.locals.db
  const registryId = res.locals.fetchRegistryOverrideId ?? req.params.registryId

  try {
    const registry = await db
      .collection(COLLECTION_NAMES.registries)
      .findOne({ _id: ObjectId(registryId) })

    if (!registry) {
      sendErrorResponse(
        res,
        404,
        ERROR_TYPES.general,
        'Could not find registry'
      )
      return
    }

    res.locals.registry = replaceId(registry)
    next()
  } catch {
    sendErrorResponse(res, 500, ERROR_TYPES.general, 'Something went wrong')
  }
}
