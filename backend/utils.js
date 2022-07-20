module.exports.getMongoDBUrl = function (username, password) {
  return `mongodb+srv://${username}:${password}@cluster0.n6kmy75.mongodb.net/?retryWrites=true&w=majority`
}

module.exports.replaceId = function (entity) {
  entity.id = entity._id
  delete entity._id
  return entity
}

module.exports.sendErrorResponse = function (res, status, errorType, errors) {
  res.status(status).json({
    success: false,
    code: status,
    errorType: errorType,
    errors:
      errorType === 'field-error'
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
