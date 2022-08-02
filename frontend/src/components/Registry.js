import { Box, Button, List, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../utils/api'
import RegistryItem from './RegistryItem'
import AddIcon from '@mui/icons-material/Add'
import ShareIcon from '@mui/icons-material/Share'

const Registry = ({ listId }) => {
  const dispatch = useDispatch()

  const listData = useSelector(state => state.lists.find(l => l.id === listId))
  const items = useSelector(state => state.listItems[listId])

  const fetchItems = useCallback(async () => {
    if (!listId || items !== undefined) {
      return
    }

    try {
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
        type: 'listItems/set',
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
  }, [listId, items, dispatch])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleItemToggle = useCallback(id => {
    // TODO: update object
    console.log(id)
  }, [])

  const handleAddButtonClick = useCallback(() => {
    if (!listData?.id) {
      return
    }

    dispatch({
      type: 'modals/show',
      payload: { name: 'createRegistryItem', data: { registryId: listData.id } }
    })
  }, [dispatch, listData?.id])

  const handleShareButtonClick = useCallback(() => {}, [])

  return (
    <>
      {listData ? (
        // TODO: Create ListDetailsSummary component
        <>
          <Typography variant="h5">{listData.name}</Typography>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddButtonClick}
            >
              Add
            </Button>
            <Button
              variant="contained"
              startIcon={<ShareIcon />}
              onClick={handleShareButtonClick}
            >
              Share
            </Button>
          </Stack>
        </>
      ) : null}

      {items ? (
        <Box>
          <List>
            {items.map(item => (
              <RegistryItem
                key={item.id}
                data={item}
                onToggle={handleItemToggle}
              />
            ))}
          </List>
        </Box>
      ) : null}
    </>
  )
}

export default Registry
