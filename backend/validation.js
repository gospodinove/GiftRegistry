const { getValue, skippable } = require('indicative-utils')

module.exports.passwordValidator = {
  async: true,

  compile(args) {
    return args
  },

  async validate(data, field, args, config) {
    const fieldValue = getValue(data, field)

    if (skippable(fieldValue, field, config)) {
      return true
    }

    return (
      /[A-Z]/.test(fieldValue) && // capital letter
      /[a-z]/.test(fieldValue) && // lowercase letter
      /[0-9]/.test(fieldValue) && // number
      /[^A-Za-z0-9]/.test(fieldValue) && // special character
      fieldValue.length >= 8 // min 8 characters
    )
  }
}

module.exports.validationMessages = {
  required: 'This field is required',
  email: 'Enter valid email address',
  password: 'Min 8 characters (capital & lowercase letter, special character)',
  before: 'This date is too late',
  after: 'This date is too early',
  max: 'Max number of characters: {{args}}',
  min: 'Min number of characters: {{args}}'
}
