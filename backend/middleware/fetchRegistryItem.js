const { ObjectId } = require('mongodb')
const { COLLECTION_NAMES } = require('../constants')
const { sendErrorResponse, replaceId } = require('../utils')

module.exports = async function fetchRegistryItem(req, res, next) {
  const db = req.app.locals.db

  try {
    const item = await db
      .collection(COLLECTION_NAMES.registryItems)
      .findOne({ _id: ObjectId(req.params.registryItemId) })

    if (!item) {
      sendErrorResponse(res, 404, 'general', 'Could not find registry item')
      return
    }

    res.locals.item = replaceId(item)
    next()
  } catch {
    sendErrorResponse(res, 500, 'general', 'Something went wrong')
  }
}
