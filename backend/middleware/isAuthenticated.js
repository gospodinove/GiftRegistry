module.exports = function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    res
      .status(401)
      .json({ type: 'unauthorized', message: 'Unauthorized access' })
  } else {
    next()
  }
}
