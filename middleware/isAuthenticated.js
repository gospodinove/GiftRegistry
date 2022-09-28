const { ERROR_TYPES } = require('../constants')
const { sendErrorResponse } = require('../utils')

module.exports = function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    sendErrorResponse(res, 401, ERROR_TYPES.unauthorized, 'Unauthorized access')
  } else {
    next()
  }
}
