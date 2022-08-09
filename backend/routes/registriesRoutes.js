const express = require('express')
const { validateAll } = require('indicative/validator')
const { replaceId, sendErrorResponse } = require('../utils')
const { validationMessages } = require('../validation')
const isAuthenticated = require('../middleware/isAuthenticated')
const { ObjectId } = require('mongodb')
const { sendRegistryInvites } = require('../mail')
const bcrypt = require('bcrypt')
const isRegistrationCompleted = require('../middleware/isRegistrationCompleted')

const router = express.Router()

router.post(
  '/',
  [isAuthenticated, isRegistrationCompleted],
  async (req, res) => {
    const db = req.app.locals.db
    const registry = req.body

    try {
      const schema = {
        type: 'required|string|max:30',
        name: 'required|string'
      }

      await validateAll(registry, schema, validationMessages)

      try {
        registry.users = [{ email: req.session.user.email, role: 'owner' }]
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
  }
)

router.get('/', isAuthenticated, async (req, res) => {
  const db = req.app.locals.db

  try {
    const registries = await db
      .collection('registries')
      .find({ users: { $elemMatch: { email: req.session.user.email } } })
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
      users: { $elemMatch: { email: req.session.user.email } }
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

router.post(
  '/:id/items',
  [isAuthenticated, isRegistrationCompleted],
  async (req, res) => {
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
  }
)

router.patch(
  '/:id/share',
  [isAuthenticated, isRegistrationCompleted],
  async (req, res) => {
    const db = req.app.locals.db

    const data = req.body

    try {
      const schema = { 'emails.*': 'email' }

      await validateAll(data, schema, validationMessages)

      try {
        const registeredUsers = await db
          .collection('users')
          .find({ email: { $in: data.emails } })
          .toArray()

        const registeredEmails = registeredUsers.map(user => user.email)
        const unregisteredEmails = data.emails.filter(
          email => !registeredEmails.includes(email)
        )

        const salt = await bcrypt.genSalt(10)
        const users = await Promise.all(
          unregisteredEmails.map(async email => ({
            email,
            token: await bcrypt.hash(email + new Date().toDateString(), salt),
            isRegistrationComplete: false
          }))
        )

        await db.collection('users').insertMany(users)

        const userIdsAndRoles = users.map(user => ({
          email: user.email,
          role: 'invitee'
        }))

        const result = await db
          .collection('registries')
          .findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
            { $addToSet: { users: { $each: userIdsAndRoles } } },
            { returnDocument: 'after' }
          )

        sendRegistryInvites([...users, ...registeredUsers])

        res.json({ success: true, registry: replaceId(result.value) })
      } catch {
        sendErrorResponse(res, 500, 'general', 'Could not send emails')
      }
    } catch (errors) {
      sendErrorResponse(res, 500, 'field-error', errors)
    }
  }
)

module.exports = router
