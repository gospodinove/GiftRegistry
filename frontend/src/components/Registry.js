import { List } from '@mui/material'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistryItem from './RegistryItem'
import RegistryItemSkeleton from './RegistryItemSkeleton'
import Empty from './Empty'
import RegistryDetails from './RegistryDetails'
import { MODAL_NAMES, showModal } from '../redux/modalsSlice'
import {
  fetchRegistryItems,
  toggleRegistryItem
} from '../redux/registryItemsSlice'
import { fetchOwner } from '../redux/registryOwnersSlice'
import { DATA_STATUS } from '../constants'
import { POPULATE_REGISTRY_ITEM_MODAL_VARIANT } from './modals/PopulateRegistryItemModal'

const Registry = ({ registryId }) => {
  const dispatch = useDispatch()

  const registryData = useSelector(state =>
    state.registries.data.find(registry => registry.id === registryId)
  )
  const items = useSelector(state => state.registryItems.data[registryId])

  const hasItems = useMemo(() => items?.length > 0, [items?.length])

  const user = useSelector(state => state.auth.user)

  const owner = useSelector(state => state.registryOwners.data[registryId])

  const isOwner = useMemo(
    () =>
      user?.email ===
      registryData?.users.find(user => user.role === 'owner')?.email,
    [registryData?.users, user?.email]
  )

  const isLoadingItems = useSelector(
    state => state.registryItems.fetchStatus === DATA_STATUS.loading
  )
  const isLoadingOwner = useSelector(
    state => state.registryOwners.status === DATA_STATUS.loading
  )

  const itemsSortedByDate = useMemo(() => {
    if (!items) {
      return []
    }
    return [...items].sort(
      (itemOne, itemTwo) => new Date(itemTwo.date) - new Date(itemOne.date)
    )
  }, [items])

  const maybeFetchItems = useCallback(async () => {
    if (!registryId || items !== undefined) {
      return
    }

    dispatch(fetchRegistryItems(registryId))
  }, [registryId, items, dispatch])

  const maybeFetchRegistryOwner = useCallback(async () => {
    if (isOwner || owner !== undefined) {
      return
    }

    dispatch(fetchOwner(registryId))
  }, [owner, registryId, dispatch, isOwner])

  useEffect(() => {
    maybeFetchItems()
  }, [maybeFetchItems, registryId])

  useEffect(() => {
    maybeFetchRegistryOwner()
  }, [maybeFetchRegistryOwner, registryId])

  const handleItemToggle = useCallback(
    async id =>
      dispatch(
        toggleRegistryItem({ regisrtyId: registryData?.id, itemId: id })
      ),
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
          variant: POPULATE_REGISTRY_ITEM_MODAL_VARIANT.create
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
            variant: POPULATE_REGISTRY_ITEM_MODAL_VARIANT.update
          }
        })
      )
    },
    [dispatch, registryData, items]
  )

  return (
    <>
      {registryData && (
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
