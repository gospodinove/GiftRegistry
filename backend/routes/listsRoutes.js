const express = require('express')
const bcrypt = require('bcrypt')
const { validate } = require('indicative/validator')
const { extend } = require('indicative/validator')
const { replaceId, sendErrorResponse } = require('../utils')
const { passwordValidator, validationMessages } = require('../validation')
const isAuthenticated = require('../middleware/isAuthenticated')

const router = express.Router()

extend('password', passwordValidator)

router.post('/', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db
  const list = req.body

  try {
    const schema = {
      type: 'required',
      name: 'required|string'
    }

    await validate(list, schema, validationMessages)

    try {
      list.users = [req.session.user.id]

      await db.collection('lists').insertOne(list)

      replaceId(list)

      res.json({ success: true, list })
    } catch {
      sendErrorResponse(res, 500, 'general', 'Could not register user')
    }
  } catch (errors) {
    sendErrorResponse(res, 500, 'field-error', errors)
  }
})

module.exports = router
