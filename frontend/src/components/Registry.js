import { Box, List, Skeleton, Stack, Typography } from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../utils/api'
import RegistryItem from './RegistryItem'
import Button from './Button'
import Icon from './Icon'
import { COLORS } from '../constants'
import RegistryItemSkeleton from './RegistryItemSkeleton'
import Empty from './Empty'

const Registry = ({ registryId }) => {
  const dispatch = useDispatch()

  const registryData = useSelector(state =>
    state.registries.data.find(registry => registry.id === registryId)
  )
  const items = useSelector(state => state.registryItems[registryId])

  const hasItems = useMemo(() => items?.length > 0, [items?.length])

  const user = useSelector(state => state.auth.user)
  const owner = useSelector(
    state => state.registries.ownerByRegistryId[registryId]
  )

  const getOwner = useMemo(
    () => registryData?.users.find(user => user.role === 'owner'),
    [registryData?.users]
  )

  const isOwner = useMemo(
    () => user?.email === getOwner?.email,
    [getOwner?.email, user?.email]
  )

  const [isLoadingItems, setIsLoadingItems] = useState(true)
  const [isLoadingOwner, setIsLoadingOwner] = useState(true)

  const itemsSortedByDate = useMemo(() => {
    if (!items) {
      return []
    }
    return [...items].sort(
      (itemOne, itemTwo) => new Date(itemTwo.date) - new Date(itemOne.date)
    )
  }, [items])

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
        data: {
          registryId: registryData.id,
          color: registryData.color,
          variant: 'create'
        }
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

  const handleEditClick = useCallback(() => {
    if (!registryData) {
      return
    }

    dispatch({
      type: 'modals/show',
      payload: {
        name: 'createRegistry',
        data: registryData
      }
    })
  }, [dispatch, registryData])

  const handleItemEditClick = useCallback(
    id => {
      if (!registryData?.color) {
        return
      }

      dispatch({
        type: 'modals/show',
        payload: {
          name: 'createRegistryItem',

          data: {
            item: items.find(item => item.id === id),
            color: registryData.color,
            registryId: registryData.id,
            variant: 'update'
          }
        }
      })
    },
    [dispatch, registryData, items]
  )

  return (
    <>
      {registryData ? (
        /* TODO: Create RegistryDetailsSummary component */
        <>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">{registryData.name}</Typography>
            {isOwner ? (
              <Button
                icon-mode="icon-only"
                icon="edit"
                color={COLORS.LIGHTGRAY}
                component="div"
                onClick={handleEditClick}
              >
                edit
              </Button>
            ) : null}
          </Box>

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
      ) : hasItems ? (
        <List>
          {itemsSortedByDate.map(item => (
            <RegistryItem
              key={item.id}
              data={item}
              color={registryData.color}
              onToggle={handleItemToggle}
              onEditClick={handleItemEditClick}
              isOwner={isOwner}
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
