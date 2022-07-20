const express = require('express')
const bcrypt = require('bcrypt')
const { validate } = require('indicative/validator')
const { extend } = require('indicative/validator')
const { replaceId, sendErrorResponse } = require('../utils')
const { passwordValidator, validationMessages } = require('../validation')

const router = express.Router()

extend('password', passwordValidator)

router.post('/register', async (req, res) => {
  const db = req.app.locals.db

  try {
    const schema = {
      firstName: 'required|string',
      lastName: 'required|string',
      email: 'required|email',
      password: 'required|password'
    }

    await validate(req.body, schema, validationMessages)

    try {
      const registeredUser = await db
        .collection('users')
        .findOne({ email: req.body.email })

      if (registeredUser) {
        sendErrorResponse(res, 500, 'field-error', [
          { field: 'email', message: 'Email is taken' }
        ])
        return
      }

      const salt = await bcrypt.genSalt(10)
      const password = await bcrypt.hash(req.body.password, salt)

      const user = { ...req.body, password }

      await db.collection('users').insertOne(user)

      replaceId(user)

      delete user.password

      req.session.user = user

      res.json({ success: true, user })
    } catch {
      sendErrorResponse(res, 500, 'general', 'Could not register user')
    }
  } catch (errors) {
    sendErrorResponse(res, 500, 'field-error', errors)
  }
})

module.exports = router
