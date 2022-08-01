const express = require('express')
const { validateAll } = require('indicative/validator')
const { replaceId, sendErrorResponse } = require('../utils')
const { validationMessages } = require('../validation')
const isAuthenticated = require('../middleware/isAuthenticated')
const { ObjectId } = require('mongodb')

const router = express.Router()

router.post('/', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db
  const list = req.body

  try {
    const schema = {
      type: 'required|string|max:30',
      name: 'required|string'
    }

    await validateAll(list, schema, validationMessages)

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
  } catch {
    sendErrorResponse(res, 500, 'general', 'Could not fetch your list items')
  }
})

router.post('/:id/items', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db

  const item = req.body

  try {
    const schema = {
      name: 'required|string',
      price: 'required|number|above:0',
      link: 'url'
    }

    await validateAll(item, schema, validationMessages)

    try {
      await db.collection('listItems').insertOne(item)

      replaceId(item)

      res.json({ success: true, item })
    } catch {
      sendErrorResponse(res, 500, 'general', 'Could not add product')
    }
  } catch (errors) {
    sendErrorResponse(res, 500, 'field-error', errors)
  }
})

module.exports = router
