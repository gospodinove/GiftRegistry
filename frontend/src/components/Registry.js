import { Box, Button, List, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../utils/api'
import RegistryItem from './RegistryItem'
import AddIcon from '@mui/icons-material/Add'
import ShareIcon from '@mui/icons-material/Share'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

const Registry = ({ registryId }) => {
  const dispatch = useDispatch()

  const registryData = useSelector(state =>
    state.registries.data.find(registry => registry.id === registryId)
  )
  const items = useSelector(state => state.registryItems[registryId])

  const user = useSelector(state => state.auth.user)
  const owner = useSelector(
    state => state.registries.ownerByRegistryId[registryId]
  )

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

  const maybeFetchRegistryOwner = useCallback(async () => {
    const registryOwner = registryData.users.find(u => u.role === 'owner')

    if (user.email === registryOwner.email || owner !== undefined) {
      return
    }

    try {
      const response = await api('registries/' + registryId + '/owner')

      dispatch({
        type: 'registries/addOwner',
        payload: { registryId: registryId, owner: response.owner }
      })
    } catch (error) {
      dispatch({
        type: 'toast/show',
        payload: { type: 'error', message: error.data }
      })
    }
  }, [registryData.users, owner, user.email, registryId, dispatch])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    maybeFetchRegistryOwner()
  }, [maybeFetchRegistryOwner])

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
          <Typography variant="h4">{registryData.name}</Typography>

          {owner && (
            <Stack direction="row" spacing={1}>
              <AccountCircleIcon />
              <Typography variant="h6">
                {owner.firstName + ' ' + owner.lastName}
              </Typography>
            </Stack>
          )}

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
