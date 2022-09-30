const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const { inviteTemplate } = require('./mailTemplates/invite')

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
})

module.exports.sendRegistryInvites = async (users, sender, registry) => {
  for (const user of users) {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'Gift Registry Invite',
      html: inviteTemplate(
        process.env.FRONT_END_BASE_URL +
          '/invite?token=' +
          user.token +
          '&redirect=' +
          registry.id,
        sender.firstName,
        registry.color,
        registry.name
      )
    })
  }
}
