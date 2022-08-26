const express = require('express')
const { validateAll } = require('indicative/validator')
const { extend } = require('indicative/validator')
const { replaceId, sendErrorResponse, hashPassword } = require('../utils')
const { passwordValidator, validationMessages } = require('../validation')
const isAuthenticated = require('../middleware/isAuthenticated')
const fetchUser = require('../middleware/fetchUser')
const { ObjectId } = require('mongodb')
const isRegistrationCompleted = require('../middleware/isRegistrationCompleted')
const isRegistryOwner = require('../middleware/isRegistryOwner')
const fetchRegistry = require('../middleware/fetchRegistry')
const fetchRegistryItem = require('../middleware/fetchRegistryItem')

const router = express.Router()

extend('password', passwordValidator)

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
        const result = await db.collection('registryItems').findOneAndUpdate(
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

module.exports = router
