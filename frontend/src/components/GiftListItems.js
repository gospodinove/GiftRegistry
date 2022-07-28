import { Box, List, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../utils/api'
import RegistryItem from './RegistryItem'

const GiftListItems = ({ listId }) => {
  const dispatch = useDispatch()

  const listData = useSelector(state => state.lists.find(l => l.id === listId))
  const items = useSelector(state => state.listItems[listId])

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

  const handleItemToggle = useCallback(id => {
    // TODO: update object
    console.log(id)
  }, [])

  return items ? (
    <Box>
      {/* TODO: Create ListDetailsSummary component */}
      <Typography variant="h5">{listData.name}</Typography>

      <List>
        {items.map(item => (
          <RegistryItem key={item.id} data={item} onToggle={handleItemToggle} />
        ))}
      </List>
    </Box>
  ) : (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Typography variant="h5">No selected list</Typography>
    </Box>
  )
}

export default GiftListItems
