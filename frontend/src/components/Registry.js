import { Box, List, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../utils/api'
import RegistryItem from './RegistryItem'

const Registry = ({ registryId }) => {
  const dispatch = useDispatch()

  const registryData = useSelector(state =>
    state.registries.find(registry => registry.id === registryId)
  )
  const items = useSelector(state => state.registryItems[registryId])

  const fetchItems = useCallback(async () => {
    if (!registryId || items !== undefined) {
      return
    }

    try {
      const response = await api('registries/' + registryId + '/items')

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
        type: 'registryItems/add',
        payload: { registryId, items: response.items }
      })
    } catch {
      dispatch({
        type: 'toast/show',
        payload: {
          type: 'error',
          message: 'Could not fetch your registry items'
        }
      })
    }
  }, [registryId, items, dispatch])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleItemToggle = useCallback(id => {
    // TODO: update object
    console.log(id)
  }, [])

  return items ? (
    <Box>
      {/* TODO: Create RegistryDetailsSummary component */}
      <Typography variant="h5">{registryData.name}</Typography>

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

export default React.memo(Registry)
