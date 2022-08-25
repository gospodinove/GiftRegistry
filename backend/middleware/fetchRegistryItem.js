const { ObjectId } = require('mongodb')
const { sendErrorResponse, replaceId } = require('../utils')

module.exports = async function fetchRegistryItem(req, res, next) {
  const db = req.app.locals.db

  try {
    const registryItem = await db
      .collection('registryItems')
      .findOne({ _id: ObjectId(req.params.registryItemId) })

    if (!registryItem) {
      sendErrorResponse(res, 404, 'general', 'Could not find registry item')
      return
    }

    res.locals.registryItem = replaceId(registryItem)
    res.locals.fetchRegistryOverrideId = registryItem.registryId

    next()
  } catch {
    sendErrorResponse(res, 500, 'general', 'Something went wrong')
  }
}
