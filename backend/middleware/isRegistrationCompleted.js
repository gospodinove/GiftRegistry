const { sendErrorResponse } = require('../utils')

module.exports = function (req, res, next) {
  if (!req.session.user.isRegistrationComplete) {
    sendErrorResponse(
      res,
      401,
      'incomplete-registration',
      'Complete your registration'
    )
  } else {
    next()
  }
}
