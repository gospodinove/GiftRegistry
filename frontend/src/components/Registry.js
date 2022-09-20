import { memo, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistryItem from './RegistryItem'
import RegistryItemSkeleton from './RegistryItemSkeleton'
import Empty from './Empty'
import RegistryDetails from './RegistryDetails'
import { Masonry } from '@mui/lab'
import { MODAL_NAMES, showModal } from '../redux/modalsSlice'
import {
  areItemsFetched,
  fetchRegistryItems,
  isFetchingItems,
  itemsSortedByDate,
  resetFetchStatus,
  toggleRegistryItem
} from '../redux/registryItemsSlice'
import {
  fetchOwner,
  isFetchingOwner,
  ownerByRegistryId
} from '../redux/registryOwnersSlice'
import { POPULATE_REGISTRY_ITEM_MODAL_VARIANT } from './modals/PopulateRegistryItemModal'
import { dataByRegistryId } from '../redux/registriesSlice'

const Registry = ({ registryId }) => {
  const dispatch = useDispatch()

  const registryData = useSelector(state => dataByRegistryId(state, registryId))
  const items = useSelector(state => itemsSortedByDate(state, registryId))
  const user = useSelector(state => state.auth.user)
  const owner = useSelector(state => ownerByRegistryId(state, registryId))

  const shouldPreventFetch = useSelector(state =>
    areItemsFetched(state, registryId)
  )
  const isLoadingItems = useSelector(isFetchingItems)
  const isLoadingOwner = useSelector(isFetchingOwner)

  const hasItems = useMemo(() => items?.length > 0, [items?.length])

  const isOwner = useMemo(
    () =>
      user?.email ===
      registryData?.users.find(user => user.role === 'owner')?.email,
    [registryData?.users, user?.email]
  )

  const maybeFetchItems = useCallback(async () => {
    if (registryId && !shouldPreventFetch) {
      dispatch(fetchRegistryItems(registryId))
    }
  }, [registryId, shouldPreventFetch, dispatch])

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

  useEffect(() => {
    dispatch(resetFetchStatus())
  }, [registryId, dispatch])

  const handleItemToggle = useCallback(
    async id =>
      dispatch(
        toggleRegistryItem({ registryId: registryData?.id, itemId: id })
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
  }, [registryData?.id, registryData?.color, registryData?.name, dispatch])

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

  const handleItemRemoveClick = useCallback(
    id => {
      if (!registryData) {
        return
      }

      dispatch(
        showModal({
          name: MODAL_NAMES.removeRegistryItemConfirmation,
          data: {
            item: items.find(item => item.id === id),
            color: registryData.color,
            registryId: registryData.id,
            registryName: registryData.name
          }
        })
      )
    },
    [dispatch, registryData, items]
  )

  const masonryConfig = useMemo(
    () => ({
      columns: { xs: 1, sm: 2, md: 3 },
      spacing: { xs: 2, sm: 2, md: 3 }
    }),
    []
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
        <Masonry
          columns={masonryConfig.columns}
          spacing={masonryConfig.spacing}
        >
          {items.map(item => (
            <RegistryItem
              key={item.id}
              data={item}
              disabled={item.takenBy && item.takenBy !== user.id}
              color={registryData.color}
              onToggle={handleItemToggle}
              onEditClick={handleItemEditClick}
              onRemoveClick={handleItemRemoveClick}
              areActionsEnabled={isOwner}
            />
          ))}
        </Masonry>
      ) : (
        <Empty text="No products in the registry" />
      )}
    </>
  )
}

export default memo(Registry)
