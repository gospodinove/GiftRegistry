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
  const registry = req.body

  try {
    const schema = {
      type: 'required|string|max:30',
      name: 'required|string'
    }

    await validate(registry, schema, validationMessages)

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
  } catch (errors) {
    sendErrorResponse(
      res,
      500,
      'general',
      'Could not fetch your registry items'
    )
  }
})

module.exports = router
