const { ERROR_TYPES } = require('../constants')
const { sendErrorResponse } = require('../utils')

module.exports = async function isPublic(req, res, next) {
  const registry = res.locals.registry

  if (!registry.public) {
    sendErrorResponse(
      res,
      404,
      ERROR_TYPES.general,
      'You dont have access to this registry'
    )
    return
  }
  next()
}
