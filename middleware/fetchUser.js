const { ObjectId } = require('mongodb')
const { COLLECTION_NAMES, ERROR_TYPES } = require('../constants')
const { sendErrorResponse, replaceId } = require('../utils')

module.exports = async function fetchRegistry(req, res, next) {
  const db = req.app.locals.db

  try {
    const user = await db
      .collection(COLLECTION_NAMES.users)
      .findOne({ _id: ObjectId(req.params.userId) })

    if (!user) {
      sendErrorResponse(res, 404, ERROR_TYPES.general, 'Could not find user')
      return
    }

    res.locals.user = replaceId(user)
    next()
  } catch {
    sendErrorResponse(res, 500, ERROR_TYPES.general, 'Something went wrong')
  }
}
