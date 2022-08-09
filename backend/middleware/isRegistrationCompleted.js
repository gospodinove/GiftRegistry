module.exports = function (req, res, next) {
  if (!req.session.user.isRegistrationComplete) {
    res.status(401).json({
      type: 'incomplete-registration',
      message: 'Complete your registration'
    })
  } else {
    next()
  }
}
