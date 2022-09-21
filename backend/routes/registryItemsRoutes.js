const express = require('express')
const { replaceId, sendErrorResponse, hashPassword } = require('../utils')
const isAuthenticated = require('../middleware/isAuthenticated')
const { ObjectId } = require('mongodb')
const fetchRegistryItem = require('../middleware/fetchRegistryItem')
const { COLLECTION_NAMES } = require('../constants')
const fetchRegistry = require('../middleware/fetchRegistry')
const isRegistrationCompleted = require('../middleware/isRegistrationCompleted')
const isRegistryOwner = require('../middleware/isRegistryOwner')
const { validateAll } = require('indicative/validator')
const { validationMessages } = require('../validation')

const router = express.Router()

router.patch(
  '/:registryItemId/toggleTaken',
  [isAuthenticated, fetchRegistryItem, fetchRegistry],
  async (req, res) => {
    const db = req.app.locals.db
    const item = res.locals.item

    const registryUserEmails = res.locals.registry.users.map(u => u.email)

    if (!registryUserEmails.includes(req.session.user.email)) {
      sendErrorResponse(res, 401, 'general', 'Unauthorized action')
      return
    }

    if (item.takenBy && item.takenBy !== req.session.user.id) {
      sendErrorResponse(res, 401, 'general', 'This item is not taken by you')
      return
    }

    try {
      const result = await db
        .collection(COLLECTION_NAMES.registryItems)
        .findOneAndUpdate(
          { _id: ObjectId(req.params.registryItemId) },
          { $set: { takenBy: item.takenBy ? undefined : req.session.user.id } },
          { returnDocument: 'after' }
        )

      res.json({ item: replaceId(result.value) })
    } catch {
      sendErrorResponse(res, 500, 'general', 'Could not update registry item')
    }
  }
)

router.put(
  '/:registryItemId',
  [
    isAuthenticated,
    isRegistrationCompleted,
    fetchRegistryItem,
    fetchRegistry,
    isRegistryOwner
  ],
  async (req, res) => {
    const db = req.app.locals.db
    const item = req.body

    try {
      const schema = {
        name: 'required|string',
        price: 'number|above:0',
        description: 'string|max:100',
        link: 'url'
      }

      await validateAll(item, schema, validationMessages)

      try {
        const result = await db
          .collection(COLLECTION_NAMES.registryItems)
          .findOneAndUpdate(
            { _id: ObjectId(req.params.registryItemId) },
            {
              $set: {
                name: item.name,
                price: item.price,
                description: item.description,
                link: item.link
              }
            },
            { returnDocument: 'after' }
          )

        res.json({ item: replaceId(result.value) })
      } catch {
        sendErrorResponse(res, 500, 'general', 'Could not update registry item')
      }
    } catch (errors) {
      sendErrorResponse(res, 500, 'field-error', errors)
    }
  }
)

router.delete(
  '/:registryItemId',
  [
    isAuthenticated,
    isRegistrationCompleted,
    fetchRegistryItem,
    fetchRegistry,
    isRegistryOwner
  ],
  async (req, res) => {
    const db = req.app.locals.db

    try {
      try {
        await db
          .collection(COLLECTION_NAMES.registryItems)
          .findOneAndDelete({ _id: ObjectId(req.params.registryItemId) })

        res.send()
      } catch {
        sendErrorResponse(res, 500, 'general', 'Could not remove registry item')
      }
    } catch (errors) {
      sendErrorResponse(res, 500, 'field-error', errors)
    }
  }
)

router.get(
  '/pickedBy/:userId',
  [isAuthenticated, isRegistrationCompleted],
  async (req, res) => {
    const db = req.app.locals.db

    if (req.params.userId !== req.session.user.id) {
      sendErrorResponse(res, 401, 'general', 'Unauthorized access')
      return
    }

    try {
      const items = await db
        .collection(COLLECTION_NAMES.registryItems)
        .find({ takenBy: req.params.userId })
        .toArray()

      res.json({ items: items.map(item => replaceId(item)) })
    } catch {
      sendErrorResponse(res, 500, 'general', 'Could not fetch items')
    }
  }
)

module.exports = router
