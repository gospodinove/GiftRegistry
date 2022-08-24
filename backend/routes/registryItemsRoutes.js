const express = require('express')
const { replaceId, sendErrorResponse, hashPassword } = require('../utils')
const isAuthenticated = require('../middleware/isAuthenticated')
const { ObjectId } = require('mongodb')
const fetchRegistryItem = require('../middleware/fetchRegistryItem')
const { COLLECTION_NAMES } = require('../constants')

const router = express.Router()

router.patch(
  '/:registryItemId/toggleTaken',
  [isAuthenticated, fetchRegistryItem],
  async (req, res) => {
    const db = req.app.locals.db
    const item = res.locals.item

    if (item.takenBy && item.takenBy !== req.session.user.id) {
      sendErrorResponse(res, 401, 'This item is not taken by you')
      return
    }

    try {
      const result = await db
        .collection(COLLECTION_NAMES.registryItems)
        .findOneAndUpdate(
          { _id: ObjectId(req.params.userId) },
          { $set: { takenBy: item.takenBy ? undefined : req.session.user.id } },
          { returnDocument: 'after' }
        )

      res.json({ item: replaceId(result.value) })
    } catch {
      sendErrorResponse(res, 500, 'general', 'Could not update user')
    }
  }
)

module.exports = router
