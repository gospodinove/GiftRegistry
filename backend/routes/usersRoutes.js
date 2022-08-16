const express = require('express')
const { validateAll } = require('indicative/validator')
const { extend } = require('indicative/validator')
const { replaceId, sendErrorResponse, hashPassword } = require('../utils')
const { passwordValidator, validationMessages } = require('../validation')
const isAuthenticated = require('../middleware/isAuthenticated')
const fetchUser = require('../middleware/fetchUser')
const { ObjectId } = require('mongodb')

const router = express.Router()

extend('password', passwordValidator)

router.put('/:userId', [isAuthenticated, fetchUser], async (req, res) => {
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
      const password = await hashPassword(req.body.password)

      const newValue = { ...req.body, password, isRegistrationComplete: true }

      const result = await db
        .collection('users')
        .findOneAndUpdate(
          { _id: ObjectId(req.params.userId) },
          { $set: newValue },
          { returnDocument: 'after' }
        )

      const user = result.value

      replaceId(user)

      delete user.password

      res.json({ user })
    } catch {
      sendErrorResponse(res, 500, 'general', 'Could not update user')
    }
  } catch (errors) {
    sendErrorResponse(res, 500, 'field-error', errors)
  }
})

module.exports = router
