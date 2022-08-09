const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const { frontEndURL } = require('./constants')

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
})

const emailAddress = 'gospodinove@gmail.com'

module.exports.sendRegistryInvites = users =>
  users.forEach(user =>
    transporter.sendMail({
      from: emailAddress,
      to: user.email,
      subject: 'Gift Registry invite',
      text: 'Check out this link -> ' + frontEndURL + '/invite/' + user.token
    })
  )
