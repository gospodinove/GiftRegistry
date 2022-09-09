import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PopulateRegistryItemModal from './modals/PopulateRegistryItemModal'
import RemoveRegistryItemModal from './modals/RemoveRegistryItemModal'
import PopulateRegistryModal from './modals/PopulateRegistryModal'
import ShareRegistryModal from './modals/ShareRegistryModal'

const Modals = () => {
  const dispatch = useDispatch()

  const isPopulateRegistryModalOpen = useSelector(
    state => state.modals.populateRegistry !== undefined
  )
  const handlePopulateRegistryModalClose = useCallback(
    () =>
      dispatch({ type: 'modals/hide', payload: { name: 'populateRegistry' } }),
    [dispatch]
  )

  const isPopulateRegistryItemModalOpen = useSelector(
    state => state.modals.populateRegistryItem !== undefined
  )
  const handlePopulateRegistryItemModalClose = useCallback(
    () =>
      dispatch({
        type: 'modals/hide',
        payload: { name: 'populateRegistryItem' }
      }),
    [dispatch]
  )

  const isRemoveRegistryItemModalOpen = useSelector(
    state => state.modals.removeRegistryItem !== undefined
  )
  const handleRemoveRegistryItemModalClose = useCallback(
    () =>
      dispatch({
        type: 'modals/hide',
        payload: { name: 'removeRegistryItem' }
      }),
    [dispatch]
  )

  const isShareRegistryModalOpen = useSelector(
    state => state.modals.shareRegistry !== undefined
  )
  const handleShareRegistryModalClose = useCallback(
    () => dispatch({ type: 'modals/hide', payload: { name: 'shareRegistry' } }),
    [dispatch]
  )

  return (
    <>
      <PopulateRegistryModal
        open={isPopulateRegistryModalOpen}
        onClose={handlePopulateRegistryModalClose}
      />

      <PopulateRegistryItemModal
        open={isPopulateRegistryItemModalOpen}
        onClose={handlePopulateRegistryItemModalClose}
      />

      <RemoveRegistryItemModal
        open={isRemoveRegistryItemModalOpen}
        onClose={handleRemoveRegistryItemModalClose}
      />

      <ShareRegistryModal
        open={isShareRegistryModalOpen}
        onClose={handleShareRegistryModalClose}
      />
    </>
  )
}

export default memo(Modals)
