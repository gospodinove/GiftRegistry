const express = require('express')
const bcrypt = require('bcrypt')
const { validate } = require('indicative/validator')
const { extend } = require('indicative/validator')
const { replaceId, sendErrorResponse } = require('../utils')
const { passwordValidator, validationMessages } = require('../validation')
const isAuthenticated = require('../middleware/isAuthenticated')
const { FindCursor } = require('mongodb')

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
      sendErrorResponse(res, 500, 'general', 'Could not create list')
    }
  } catch (errors) {
    sendErrorResponse(res, 500, 'field-error', errors)
  }
})

router.get('/', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db
  const userId = req.session.user.id

  try {
    const lists = await db.collection('lists').find({ users: userId })

    res.json({ success: true, lists })
  } catch {
    sendErrorResponse(res, 500, 'field-error', 'No lists from this user')
  }
})

module.exports = router
