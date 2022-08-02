const express = require('express')
const { validateAll } = require('indicative/validator')
const { replaceId, sendErrorResponse } = require('../utils')
const { validationMessages } = require('../validation')
const isAuthenticated = require('../middleware/isAuthenticated')
const { ObjectId } = require('mongodb')

const router = express.Router()

router.post('/', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db
  const registry = req.body

  try {
    const schema = {
      type: 'required|string|max:30',
      name: 'required|string'
    }

    await validateAll(registry, schema, validationMessages)

    try {
      registry.users = [req.session.user.id]
      registry.date = new Date()

      await db.collection('registries').insertOne(registry)

      replaceId(registry)

      res.json({ success: true, registry })
    } catch {
      sendErrorResponse(res, 500, 'general', 'Could not create registry')
    }
  } catch (errors) {
    sendErrorResponse(res, 500, 'field-error', errors)
  }
})

router.get('/', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db
  const userId = req.session.user.id

  try {
    const registries = await db
      .collection('registries')
      .find({ users: userId })
      .toArray()

    res.json({
      success: true,
      registries: registries.map(registry => replaceId(registry))
    })
  } catch {
    sendErrorResponse(res, 500, 'general', 'No registries from this user')
  }
})

router.get('/:id/items', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db

  try {
    const registry = await db.collection('registries').findOne({
      _id: ObjectId(req.params.id),
      users: req.session.user.id
    })

    if (!registry) {
      sendErrorResponse(res, 404, 'general', 'Could not find your registry')
      return
    }

    replaceId(registry)

    const items = await db
      .collection('registryItems')
      .find({ registryId: registry.id.toString() })
      .toArray()

    res.json({ success: true, items: items.map(item => replaceId(item)) })
  } catch {
    sendErrorResponse(
      res,
      500,
      'general',
      'Could not fetch your registry items'
    )
  }
})

router.post('/:id/items', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db

  const item = { ...req.body, registryId: req.params.id, takenBy: null }

  try {
    const schema = {
      name: 'required|string',
      price: 'required|number|above:0',
      description: 'string|max:100',
      link: 'url'
    }

    await validateAll(item, schema, validationMessages)

    try {
      await db.collection('registryItems').insertOne(item)

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