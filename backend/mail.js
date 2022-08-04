const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
})

const emailAddress = 'gospodinove@gmail.com'

module.exports.sendRegistryInvites = addresses => {
  // TODO: invite token
  addresses.forEach(address =>
    transporter.sendMail({
      from: emailAddress,
      to: address,
      subject: 'Gift Registry invite',
      text: 'hello world'
    })
  )
}
