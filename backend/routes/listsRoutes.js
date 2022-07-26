const express = require('express')
const bcrypt = require('bcrypt')
const { validate } = require('indicative/validator')
const { extend } = require('indicative/validator')
const { replaceId, sendErrorResponse } = require('../utils')
const { passwordValidator, validationMessages } = require('../validation')
const isAuthenticated = require('../middleware/isAuthenticated')
const { ObjectId } = require('mongodb')

const router = express.Router()

extend('password', passwordValidator)

router.post('/', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db
  const list = req.body

  try {
    const schema = {
      type: 'required|string|max:30',
      name: 'required|string'
    }

    await validate(list, schema, validationMessages)

    try {
      list.users = [req.session.user.id]
      list.date = new Date()

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
    const lists = await db.collection('lists').find({ users: userId }).toArray()

    res.json({ success: true, lists: lists.map(list => replaceId(list)) })
  } catch {
    sendErrorResponse(res, 500, 'general', 'No lists from this user')
  }
})

router.get('/:id/items', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db

  try {
    const list = await db.collection('lists').findOne({
      _id: ObjectId(req.params.id),
      users: req.session.user.id
    })

    if (!list) {
      sendErrorResponse(res, 404, 'general', 'Could not find your list')
      return
    }

    replaceId(list)

    const items = await db
      .collection('listItems')
      .find({ listId: list.id.toString() })
      .toArray()

    res.json({ success: true, items: items.map(item => replaceId(item)) })
  } catch (errors) {
    sendErrorResponse(res, 500, 'general', 'Could not fetch your list items')
  }
})

module.exports = router
