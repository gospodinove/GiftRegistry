import { Box, Button, List, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../utils/api'
import RegistryItem from './RegistryItem'
import AddIcon from '@mui/icons-material/Add'
import ShareIcon from '@mui/icons-material/Share'

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

      dispatch({
        type: 'registryItems/set',
        payload: { registryId, items: response.items }
      })
    } catch (error) {
      dispatch({
        type: 'toast/show',
        payload: {
          type: 'error',
          message: error.data
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

  const handleAddButtonClick = useCallback(() => {
    if (!registryData?.id) {
      return
    }

    dispatch({
      type: 'modals/show',
      payload: {
        name: 'createRegistryItem',
        data: { registryId: registryData.id }
      }
    })
  }, [dispatch, registryData?.id])

  const handleShareButtonClick = useCallback(() => {
    if (!registryData) {
      return
    }

    dispatch({
      type: 'modals/show',
      payload: {
        name: 'shareRegistry',
        data: {
          registryId: registryData.id,
          users: registryData.users.filter(user => user.role !== 'owner')
        }
      }
    })
  }, [dispatch, registryData])

  return (
    <>
      {registryData ? (
        /* TODO: Create RegistryDetailsSummary component */
        <>
          <Typography variant="h5">{registryData.name}</Typography>

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

export default React.memo(Registry)
