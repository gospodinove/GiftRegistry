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

module.exports.sendRegistryInvites = (users, sender) =>
  users.forEach(user =>
    transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'Gift Registry Invite',
      text:
        'Check out this link -> ' +
        FRONT_END_BASE_URL +
        '/invite?token=' +
        user.token,
      html: `<h1>Hi there,</h1>
      <h2>${sender.firstName} invited you to his gift registry.<h2>
      <p><a href='${
        FRONT_END_BASE_URL + '/invite?token=' + user.token
      }'>Click here<a> to check it out<p>
      <p>Best regards,<br><b>The GiftRegistry Team</b><p>`
    })
  )
