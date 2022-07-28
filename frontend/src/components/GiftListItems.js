import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { api } from '../utils/api'

const GiftListItems = ({ listId }) => {
  const dispatch = useDispatch()

  const fetchItems = useCallback(async () => {
    try {
      if (!listId) {
        return
      }

      const response = await api('lists/' + listId + '/items')

      if (!response.success) {
        dispatch({
          type: 'toast/show',
          payload: {
            type: 'error',
            message: response.errors
          }
        })
        return
      }

      dispatch({
        type: 'listItems/add',
        payload: { listId, items: response.items }
      })
    } catch {
      dispatch({
        type: 'toast/show',
        payload: {
          type: 'error',
          message: 'Could not fetch your list items'
        }
      })
    }
  }, [listId, dispatch])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return <div></div>
}

export default GiftListItems
