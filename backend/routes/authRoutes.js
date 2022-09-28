const express = require('express')
const bcrypt = require('bcrypt')
const { validateAll } = require('indicative/validator')
const { extend } = require('indicative/validator')
const {
  replaceId,
  sendErrorResponse,
  hashPassword,
  makeToken,
  comparePasswords
} = require('../utils')
const { passwordValidator, validationMessages } = require('../validation')
const { COLLECTION_NAMES, ERROR_TYPES } = require('../constants')

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
        .collection(COLLECTION_NAMES.users)
        .findOne({ email: req.body.email })

      if (registeredUser) {
        sendErrorResponse(res, 500, ERROR_TYPES.fieldErrors, [
          { field: 'email', message: 'Email is taken' }
        ])
        return
      }

      const password = await hashPassword(req.body.password)
      const token = await makeToken(req.body.email)

      const user = {
        ...req.body,
        password,
        token,
        isRegistrationComplete: true
      }

      await db.collection(COLLECTION_NAMES.users).insertOne(user)

      replaceId(user)

      delete user.password

      req.session.user = user

      res.json({ user })
    } catch {
      sendErrorResponse(
        res,
        500,
        ERROR_TYPES.general,
        'Could not register user'
      )
    }
  } catch (errors) {
    sendErrorResponse(res, 500, ERROR_TYPES.fieldErrors, errors)
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
        .collection(COLLECTION_NAMES.users)
        .findOne({ email: req.body.email })

      if (!user) {
        sendErrorResponse(res, 500, ERROR_TYPES.fieldErrors, [
          { message: 'Email is not registered', field: 'email' }
        ])
        return
      }

      const isPasswordValid = await comparePasswords(
        req.body.password,
        user.password
      )

      if (!isPasswordValid) {
        sendErrorResponse(res, 500, ERROR_TYPES.fieldErrors, [
          { field: 'password', message: 'Wrong password' }
        ])
        return
      }

      replaceId(user)

      delete user.password

      req.session.user = user

      res.json({ user })
    } catch (err) {
      sendErrorResponse(res, 500, ERROR_TYPES.general, 'Could not login')
    }
  } catch (errors) {
    sendErrorResponse(res, 500, ERROR_TYPES.fieldErrors, errors)
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
      sendErrorResponse(res, 500, ERROR_TYPES.general, 'Could not logout')
    }
  } catch {
    sendErrorResponse(res, 500, ERROR_TYPES.general, 'Could not logout')
  }
})

router.post('/token', async (req, res) => {
  const db = req.app.locals.db

  try {
    const user = await db
      .collection(COLLECTION_NAMES.users)
      .findOne({ token: req.body.token })

    if (!user) {
      sendErrorResponse(
        res,
        404,
        ERROR_TYPES.general,
        'Could not find user with this token'
      )
      return
    }

    replaceId(user)

    req.session.user = user

    res.json({ user })
  } catch {
    sendErrorResponse(res, 500, ERROR_TYPES.general, 'Something went wrong')
  }
})

module.exports = router
