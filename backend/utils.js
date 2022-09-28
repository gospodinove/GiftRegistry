const bcrypt = require('bcrypt')
const { ERROR_TYPES } = require('./constants')

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
    data:
      type === ERROR_TYPES.fieldErrors
        ? parseValidationErrorMessages(errors)
        : errors
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

const slashPlaceholder = 'slash'

module.exports.hashPassword = async function (string) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(string, salt)
  return hash.replace(/\//g, slashPlaceholder)
}

module.exports.comparePasswords = async function (string, hash) {
  const regex = new RegExp(slashPlaceholder)
  return await bcrypt.compare(string, hash.replace(regex, '/'))
}

module.exports.makeToken = async function (email) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(email + new Date().toDateString(), salt)
}
