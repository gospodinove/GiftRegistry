import { memo, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistryDetails from './RegistryDetails'
import { showModal } from '../redux/modalsSlice'
import {
  areItemsFetched,
  fetchRegistryItems,
  isFetchingRegistryItems,
  itemsByRegistryId,
  resetFetchStatus,
  toggleRegistryItem
} from '../redux/registryItemsSlice'
import {
  fetchOwner,
  isFetchingOwner,
  ownerByRegistryId
} from '../redux/registryOwnersSlice'
import { registryDataById } from '../redux/registriesSlice'
import RegistryItemsMasonry from './RegistryItemsMasonry'
import { Box } from '@mui/material'
import { showToast } from '../redux/toastSlice'
import {
  MODAL_NAMES,
  POPULATE_REGISTRY_ITEM_MODAL_VARIANT,
  USER_ROLES
} from '../constants/types'
import { generateShareURL } from '../constants/urls'

const Registry = ({ registryId }) => {
  const dispatch = useDispatch()

  const registryData = useSelector(state => registryDataById(state, registryId))
  const items = useSelector(state => itemsByRegistryId(state, registryId))
  const user = useSelector(state => state.auth.user)
  const owner = useSelector(state => ownerByRegistryId(state, registryId))

  const shouldPreventItemsFetch = useSelector(state =>
    areItemsFetched(state, registryId)
  )
  const isLoadingItems = useSelector(isFetchingRegistryItems)
  const isLoadingOwner = useSelector(isFetchingOwner)

  const sortedItems = useMemo(() => {
    if (!items) {
      return []
    }

    return [...items].sort(
      (itemOne, itemTwo) => new Date(itemTwo.date) - new Date(itemOne.date)
    )
  }, [items])

  const isOwner = useMemo(
    () =>
      user?.email ===
      registryData?.users.find(user => user.role === USER_ROLES.owner)?.email,
    [registryData?.users, user?.email]
  )

  const maybeFetchItems = useCallback(async () => {
    if (registryId && registryData && !shouldPreventItemsFetch) {
      dispatch(fetchRegistryItems(registryId))
    }
  }, [registryId, registryData, shouldPreventItemsFetch, dispatch])

  const maybeFetchRegistryOwner = useCallback(async () => {
    if (registryId && registryData && !isOwner && owner === undefined) {
      dispatch(fetchOwner(registryId))
    }
  }, [registryId, registryData, isOwner, owner, dispatch])

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
    async (registryId, itemId) =>
      dispatch(toggleRegistryItem({ registryId, itemId })),
    [dispatch]
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

  const handleShareViaEmailClick = useCallback(() => {
    if (!registryData) {
      return
    }

    dispatch(
      showModal({
        name: MODAL_NAMES.shareViaEmail,
        data: {
          name: registryData.name,
          registryId: registryData.id,
          users: registryData.users.filter(
            user => user.role !== USER_ROLES.owner
          ),
          color: registryData.color
        }
      })
    )
  }, [dispatch, registryData])

  const handleShareViaLinkClick = useCallback(() => {
    if (!registryData) {
      return
    }

    if (registryData.public) {
      navigator.clipboard.writeText(generateShareURL(registryData.id))
      dispatch(
        showToast({ type: 'success', message: 'Link copied to clipboard' })
      )
    } else {
      dispatch(
        showModal({
          name: MODAL_NAMES.shareViaLinkConfirmation,
          data: registryData
        })
      )
    }
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

  const handleRemoveClick = useCallback(() => {
    if (!registryData?.id) {
      return
    }

    dispatch(
      showModal({
        name: MODAL_NAMES.removeRegistryConfirmation,
        data: {
          id: registryData.id,
          name: registryData.name,
          color: registryData.color
        }
      })
    )
  }, [dispatch, registryData?.color, registryData?.id, registryData?.name])

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

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {registryData && (
        <RegistryDetails
          shouldShowActionButtons={isOwner}
          name={registryData.name}
          color={registryData.color}
          owner={owner}
          shouldShowOwner={
            registryData.users.find(u => u.role === USER_ROLES.owner).email !==
            user?.email
          }
          isLoadingOwner={isLoadingOwner}
          onEditClick={handleEditClick}
          onRemoveClick={handleRemoveClick}
          onAddClick={handleAddClick}
          onShareViaEmailClick={handleShareViaEmailClick}
          onShareViaLinkClick={handleShareViaLinkClick}
        />
      )}

      <RegistryItemsMasonry
        items={sortedItems}
        onToggle={handleItemToggle}
        onEditClick={handleItemEditClick}
        onRemoveClick={handleItemRemoveClick}
        areActionsEnabled={isOwner}
        isLoading={isLoadingItems}
        emptyMessage="No items in this registry"
      />
    </Box>
  )
}

export default memo(Registry)
