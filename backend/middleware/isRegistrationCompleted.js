const { ERROR_TYPES } = require('../constants')
const { sendErrorResponse } = require('../utils')

module.exports = function (req, res, next) {
  if (!req.session.user.isRegistrationComplete) {
    sendErrorResponse(
      res,
      401,
      ERROR_TYPES.incompleteRegistration,
      'Complete your registration'
    )
  } else {
    next()
  }
}
