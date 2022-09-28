const { ERROR_TYPES, USER_ROLES } = require('../constants')
const { sendErrorResponse } = require('../utils')

module.exports = async function isRegistryOwner(req, res, next) {
  const registry = res.locals.registry
  const user = req.session.user

  const registryOwnerEmail = registry.users.find(
    u => u.role === USER_ROLES.owner
  ).email

  if (user.email !== registryOwnerEmail) {
    sendErrorResponse(
      res,
      500,
      ERROR_TYPES.general,
      'Only owners can perform this action'
    )
    return
  }

  next()
}
