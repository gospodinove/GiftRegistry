const express = require('express')
const { validateAll } = require('indicative/validator')
const { replaceId, sendErrorResponse, makeToken } = require('../utils')
const { validationMessages } = require('../validation')
const isAuthenticated = require('../middleware/isAuthenticated')
const { ObjectId } = require('mongodb')
const { sendRegistryInvites } = require('../mail')
const isRegistrationCompleted = require('../middleware/isRegistrationCompleted')
const fetchRegistry = require('../middleware/fetchRegistry')
const { COLLECTION_NAMES } = require('../constants')
const isRegistryOwner = require('../middleware/isRegistryOwner')

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
        name: 'required|string',
        color: 'required|string'
      }

      await validateAll(registry, schema, validationMessages)

      try {
        registry.users = [{ email: req.session.user.email, role: 'owner' }]
        registry.date = new Date()

        await db.collection(COLLECTION_NAMES.registries).insertOne(registry)

        replaceId(registry)

        res.json({ registry })
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
      .collection(COLLECTION_NAMES.registries)
      .find({ users: { $elemMatch: { email: req.session.user.email } } })
      .toArray()

    res.json({ registries: registries.map(registry => replaceId(registry)) })
  } catch {
    sendErrorResponse(res, 500, 'general', 'No registries from this user')
  }
})

router.get(
  '/:registryId/items',
  [isAuthenticated, fetchRegistry],
  async (req, res) => {
    const db = req.app.locals.db

    try {
      const items = await db
        .collection('registryItems')
        .find({ registryId: req.params.registryId })
        .toArray()

      res.json({ items: items.map(item => replaceId(item)) })
    } catch {
      sendErrorResponse(
        res,
        500,
        'general',
        'Could not fetch your registry items'
      )
    }
  }
)

router.delete(
  '/:registryId/items',
  [isAuthenticated, isRegistrationCompleted, fetchRegistry, isRegistryOwner],
  async (req, res) => {
    const db = req.app.locals.db

    try {
      await db
        .collection('registryItems')
        .deleteMany({ registryId: req.params.registryId })

      res.send()
    } catch {
      sendErrorResponse(res, 500, 'general', 'Could not delete registry items')
    }
  }
)

router.post(
  '/:registryId/items',
  [isAuthenticated, isRegistrationCompleted, fetchRegistry, isRegistryOwner],
  async (req, res) => {
    const db = req.app.locals.db
    const registry = res.locals.registry

    const item = {
      ...req.body,
      registryId: req.params.registryId,
      takenBy: null,
      color: registry.color,
      date: new Date()
    }

    try {
      const schema = {
        name: 'required|string',
        price: 'number|above:0',
        description: 'string|max:100',
        link: 'url'
      }

      await validateAll(item, schema, validationMessages)

      try {
        await db.collection('registryItems').insertOne(item)

        replaceId(item)

        res.json({ item })
      } catch {
        sendErrorResponse(res, 500, 'general', 'Could not add registry item')
      }
    } catch (errors) {
      sendErrorResponse(res, 500, 'field-error', errors)
    }
  }
)

router.patch(
  '/:registryId/share',
  [isAuthenticated, isRegistrationCompleted, fetchRegistry, isRegistryOwner],
  async (req, res) => {
    const db = req.app.locals.db
    const registry = res.locals.registry

    const data = req.body

    try {
      const schema = { 'emails.*': 'email' }

      await validateAll(data, schema, validationMessages)

      try {
        const registryUserEmails = registry.users.map(u => u.email)
        const newEmails = data.emails.filter(
          email => !registryUserEmails.includes(email)
        )

        if (newEmails.length === 0) {
          res.json({ registry })
          return
        }

        const registeredUsers = await db
          .collection('users')
          .find({ email: { $in: newEmails } })
          .toArray()

        const registeredEmails = registeredUsers.map(user => user.email)
        const unregisteredEmails = newEmails.filter(
          email => !registeredEmails.includes(email)
        )

        const users = await Promise.all(
          unregisteredEmails.map(async email => ({
            email,
            token: await makeToken(email),
            isRegistrationComplete: false
          }))
        )

        if (users.length > 0) {
          await db.collection('users').insertMany(users)
        }

        const userEmailsAndRoles = [
          ...users.map(user => ({
            email: user.email,
            role: 'invitee'
          })),
          ...registeredEmails.map(email => ({ email, role: 'invitee' }))
        ]

        const result = await db
          .collection(COLLECTION_NAMES.registries)
          .findOneAndUpdate(
            { _id: ObjectId(req.params.registryId) },
            { $addToSet: { users: { $each: userEmailsAndRoles } } },
            { returnDocument: 'after' }
          )

        sendRegistryInvites([...users, ...registeredUsers])

        res.json({ registry: replaceId(result.value) })
      } catch {
        sendErrorResponse(res, 500, 'general', 'Could not send emails')
      }
    } catch (errors) {
      sendErrorResponse(res, 500, 'field-error', errors)
    }
  }
)

router.get(
  '/:registryId/owner',
  [isAuthenticated, fetchRegistry],
  async (req, res) => {
    const db = req.app.locals.db
    const registry = res.locals.registry

    try {
      const registryOwnerEmail = registry.users.find(
        u => u.role === 'owner'
      ).email

      const user = await db
        .collection('users')
        .findOne({ email: registryOwnerEmail })

      if (!user) {
        sendErrorResponse(res, 404, 'general', 'Could not find owner')
        return
      }

      res.json({ owner: replaceId(user) })
    } catch {
      sendErrorResponse(res, 500, 'general', 'Could not find owner')
    }
  }
)

router.put(
  '/:registryId',
  [isAuthenticated, isRegistrationCompleted, fetchRegistry, isRegistryOwner],
  async (req, res) => {
    const db = req.app.locals.db
    const data = req.body

    const schema = {
      type: 'required|string|max:30',
      name: 'required|string',
      color: 'required|string'
    }

    try {
      await validateAll(data, schema, validationMessages)

      try {
        const result = await db
          .collection(COLLECTION_NAMES.registries)
          .findOneAndUpdate(
            { _id: ObjectId(req.params.registryId) },
            {
              $set: { type: data.type, name: data.name, color: data.color }
            },
            { returnDocument: 'after' }
          )

        res.json({ registry: replaceId(result.value) })
      } catch {
        sendErrorResponse(res, 500, 'general', 'Could not update registry')
      }
    } catch (errors) {
      sendErrorResponse(res, 500, 'field-error', errors)
    }
  }
)

router.delete(
  '/:registryId',
  [isAuthenticated, isRegistrationCompleted, fetchRegistry, isRegistryOwner],
  async (req, res) => {
    const db = req.app.locals.db

    try {
      await db
        .collection(COLLECTION_NAMES.registries)
        .findOneAndDelete({ _id: ObjectId(req.params.registryId) })

      res.send()
    } catch {
      sendErrorResponse(res, 500, 'general', 'Could not delete registry')
    }
  }
)

module.exports = router
