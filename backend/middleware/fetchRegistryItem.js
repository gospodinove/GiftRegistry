const { ObjectId } = require('mongodb')
const { COLLECTION_NAMES, ERROR_TYPES } = require('../constants')
const { sendErrorResponse, replaceId } = require('../utils')

module.exports = async function fetchRegistryItem(req, res, next) {
  const db = req.app.locals.db

  try {
    const item = await db
      .collection(COLLECTION_NAMES.registryItems)
      .findOne({ _id: ObjectId(req.params.registryItemId) })

    if (!item) {
      sendErrorResponse(
        res,
        404,
        ERROR_TYPES.general,
        'Could not find registry item'
      )
      return
    }

    res.locals.item = replaceId(item)
    res.locals.fetchRegistryOverrideId = item.registryId

    next()
  } catch {
    sendErrorResponse(res, 500, ERROR_TYPES.general, 'Something went wrong')
  }
}
