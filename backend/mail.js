const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const { FRONT_END_BASE_URL } = require('./constants')

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
})

module.exports.sendRegistryInvites = users =>
  users.forEach(user =>
    transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'Gift Registry invite',
      text:
        'Check out this link -> ' +
        FRONT_END_BASE_URL +
        '/invite?token=' +
        user.token
    })
  )
