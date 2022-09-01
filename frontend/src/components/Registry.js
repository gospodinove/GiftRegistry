import { List } from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../utils/api'
import RegistryItem from './RegistryItem'
import RegistryItemSkeleton from './RegistryItemSkeleton'
import Empty from './Empty'
import RegistryDetails from './RegistryDetails'
import { MODAL_NAMES, showModal } from '../redux/modalsSlice'

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

  const isOwner = useMemo(
    () =>
      user?.email ===
      registryData?.users.find(user => user.role === 'owner')?.email,
    [registryData?.users, user?.email]
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

      if (isOwner || owner !== undefined) {
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
  }, [owner, registryId, dispatch, isOwner])

  useEffect(() => {
    fetchItems()
  }, [fetchItems, registryId])

  useEffect(() => {
    maybeFetchRegistryOwner()
  }, [maybeFetchRegistryOwner, registryId])

  const handleItemToggle = useCallback(
    async id => {
      try {
        const response = await api(
          'registryItems/' + id + '/toggleTaken',
          'patch'
        )

        dispatch({
          type: 'registryItems/update',
          payload: { registryId: registryData.id, item: response.item }
        })
      } catch (error) {
        dispatch({
          type: 'toast/show',
          payload: { type: 'error', message: error.data }
        })
      }
    },
    [dispatch, registryData?.id]
  )

  const handleAddClick = useCallback(() => {
    if (!registryData?.id) {
      return
    }

    dispatch(
      showModal({
        name: MODAL_NAMES.populateRegistryItem,
        data: {
          registryId: registryData.id,
          color: registryData.color,
          registryName: registryData.name,
          variant: 'create'
        }
      })
    )
  }, [registryData.id, registryData.color, registryData.name, dispatch])

  const handleShareClick = useCallback(() => {
    if (!registryData) {
      return
    }

    dispatch(
      showModal({
        name: MODAL_NAMES.shareRegistry,
        data: {
          registryId: registryData.id,
          users: registryData.users.filter(user => user.role !== 'owner'),
          color: registryData.color
        }
      })
    )
  }, [dispatch, registryData])

  const handleEditClick = useCallback(() => {
    if (!registryData) {
      return
    }

    dispatch(
      showModal({
        name: MODAL_NAMES.populateRegistry,
        data: registryData
      })
    )
  }, [dispatch, registryData])

  const handleItemEditClick = useCallback(
    id => {
      if (!registryData) {
        return
      }

      dispatch(
        showModal({
          name: MODAL_NAMES.populateRegistryItem,
          data: {
            item: items.find(item => item.id === id),
            color: registryData.color,
            registryId: registryData.id,
            registryName: registryData.name,
            variant: 'update'
          }
        })
      )
    },
    [dispatch, registryData, items]
  )

  return (
    <>
      {registryData ?? (
        <RegistryDetails
          shouldShowActionButtons={isOwner}
          name={registryData.name}
          color={registryData.color}
          owner={owner}
          shouldShowOwner={
            registryData.users.find(u => u.role === 'owner').email !==
            user.email
          }
          isLoadingOwner={isLoadingOwner}
          onEditClick={handleEditClick}
          onAddClick={handleAddClick}
          onShareClick={handleShareClick}
        />
      )}

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
              disabled={item.takenBy && item.takenBy !== user.id}
              color={registryData.color}
              onToggle={handleItemToggle}
              onEditClick={handleItemEditClick}
              isEditEnabled={isOwner}
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
