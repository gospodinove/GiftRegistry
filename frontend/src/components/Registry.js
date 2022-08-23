import { List, Skeleton, Stack, Typography } from '@mui/material'
import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../utils/api'
import RegistryItem from './RegistryItem'
import Button from './Button'
import Icon from './Icon'
import RegistryItemSkeleton from './RegistryItemSkeleton'
import Empty from './Empty'

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

  const [isLoadingItems, setIsLoadingItems] = useState(true)
  const [isLoadingOwner, setIsLoadingOwner] = useState(true)

  const fetchItems = useCallback(async () => {
    try {
      setIsLoadingItems(true)

      if (!registryId || items !== undefined) {
        return
      }

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
    } finally {
      setIsLoadingItems(false)
    }
  }, [registryId, items, dispatch])

  const maybeFetchRegistryOwner = useCallback(async () => {
    try {
      setIsLoadingOwner(true)

      const registryOwner = registryData.users.find(u => u.role === 'owner')

      if (user.email === registryOwner.email || owner !== undefined) {
        return
      }

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
    } finally {
      setIsLoadingOwner(false)
    }
  }, [registryData?.users, owner, user?.email, registryId, dispatch])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    maybeFetchRegistryOwner()
  }, [maybeFetchRegistryOwner])

  const maybeRenderOwner = useCallback(() => {
    const registryOwner = registryData.users.find(u => u.role === 'owner')

    if (user.email === registryOwner.email) {
      return null
    }

    if (isLoadingOwner) {
      return (
        <Typography variant="h6">
          <Skeleton width="250px" />
        </Typography>
      )
    }

    return (
      <Stack direction="row" spacing={1}>
        <Icon type="account-circle" />
        <Typography variant="h6">
          {owner.firstName + ' ' + owner.lastName}
        </Typography>
      </Stack>
    )
  }, [
    isLoadingOwner,
    owner?.firstName,
    owner?.lastName,
    registryData?.users,
    user?.email
  ])

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
        data: { registryId: registryData.id, color: registryData.color }
      }
    })
  }, [dispatch, registryData?.id, registryData?.color])

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
          users: registryData.users.filter(user => user.role !== 'owner'),
          color: registryData.color
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

          {maybeRenderOwner()}

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              icon-mode="start"
              icon="add"
              onClick={handleAddButtonClick}
              color={registryData.color}
            >
              Add
            </Button>
            <Button
              variant="contained"
              icon-mode="start"
              icon="share"
              onClick={handleShareButtonClick}
              color={registryData.color}
            >
              Share
            </Button>
          </Stack>
        </>
      ) : null}

      {isLoadingItems ? (
        <>
          <RegistryItemSkeleton />
          <RegistryItemSkeleton />
        </>
      ) : items?.length > 0 ? (
        <List>
          {items.map(item => (
            <RegistryItem
              key={item.id}
              data={item}
              color={registryData.color}
              onToggle={handleItemToggle}
            />
          ))}
        </List>
      ) : (
        <Empty text="No products in the registry" />
      )}
    </>
  )
}

export default memo(Registry)
