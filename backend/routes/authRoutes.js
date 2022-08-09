const express = require('express')
const bcrypt = require('bcrypt')
const { validateAll } = require('indicative/validator')
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

    await validateAll(req.body, schema, validationMessages)

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
      const token = await bcrypt.hash(
        req.body.email + new Date().toDateString(),
        salt
      )

      const user = {
        ...req.body,
        password,
        token,
        isRegistrationComplete: true
      }

      await db.collection('users').insertOne(user)

      replaceId(user)

      delete user.password

      req.session.user = user

      res.json({ user })
    } catch {
      sendErrorResponse(res, 500, 'general', 'Could not register user')
    }
  } catch (errors) {
    sendErrorResponse(res, 500, 'field-error', errors)
  }
})

router.post('/login', async (req, res) => {
  const db = req.app.locals.db

  try {
    const schema = {
      email: 'required|email',
      password: 'required'
    }

    await validateAll(req.body, schema, validationMessages)

    try {
      const user = await db
        .collection('users')
        .findOne({ email: req.body.email })

      if (!user) {
        sendErrorResponse(res, 500, 'field-error', [
          { message: 'Email is not registered', field: 'email' }
        ])
        return
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      )

      if (!isPasswordValid) {
        sendErrorResponse(res, 500, 'field-error', [
          { field: 'password', message: 'Wrong password' }
        ])
        return
      }

      replaceId(user)

      delete user.password

      req.session.user = user

      res.json({ user })
    } catch (err) {
      sendErrorResponse(res, 500, 'general', 'Could not login')
    }
  } catch (errors) {
    sendErrorResponse(res, 500, 'field-error', errors)
  }
})

router.get('/session-user', (req, res) => {
  res.json(req.session.user)
})

router.get('/logout', (req, res) => {
  try {
    const user = req.session.user

    if (user) {
      req.session.destroy(err => {
        if (err) {
          throw err
        }

        res.clearCookie(process.env.SESSION_NAME)
        res.send()
      })
    } else {
      sendErrorResponse(res, 500, 'general', 'Could not logout')
    }
  } catch {
    sendErrorResponse(res, 500, 'general', 'Could not logout')
  }
})

router.post('/token', async (req, res) => {
  const db = req.app.locals.db

  try {
    const user = await db.collection('users').findOne({ token: req.body.token })

    if (!user) {
      sendErrorResponse(
        res,
        404,
        'general',
        'Could not find user with this token'
      )
      return
    }

    req.session.user = user

    res.json({ user })
  } catch {
    sendErrorResponse(res, 500, 'general', 'Something went wrong')
  }
})

module.exports = router
