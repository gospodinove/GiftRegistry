const bcrypt = require('bcrypt')

module.exports.getMongoDBUrl = function (username, password) {
  return `mongodb+srv://${username}:${password}@cluster0.n6kmy75.mongodb.net/?retryWrites=true&w=majority`
}

module.exports.replaceId = function (entity) {
  entity.id = entity._id
  delete entity._id
  return entity
}

module.exports.sendErrorResponse = function (res, status, type, errors) {
  res.status(status).json({
    code: status,
    type: type,
    data: type === 'field-error' ? parseValidationErrorMessages(errors) : errors
  })
}

const parseValidationErrorMessages = errors => {
  const result = {}

  for (const err of errors) {
    result[err.field] = err.message
  }

  result.isValidationError = true

  return result
}

module.exports.hashPassword = async function (string) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(string, salt)
}

module.exports.makeToken = async function (email) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(email + new Date().toDateString(), salt)
}
