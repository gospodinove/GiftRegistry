module.exports.getMongoDBUrl = function (username, password) {
  return `mongodb+srv://${username}:${password}@cluster0.n6kmy75.mongodb.net/?retryWrites=true&w=majority`
}

module.exports.replaceId = function (entity) {
  entity.id = entity._id
  delete entity._id
  return entity
}

module.exports.sendErrorResponse = function (
  res,
  status,
  messageType,
  messages
) {
  res.status(status).json({
    success: false,
    code: status,
    messageType: messageType,
    messages:
      messageType === 'field-error'
        ? parseValidationErrorMessages(messages)
        : messages
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
