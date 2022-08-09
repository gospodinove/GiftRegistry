const { sendErrorResponse } = require('../utils')

module.exports = function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    sendErrorResponse(res, 401, 'unauthorized', 'Unauthorized access')
  } else {
    next()
  }
}
