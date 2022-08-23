import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CreateRegistryItemModal from './modals/CreateRegistryItemModal'
import PopulateRegistryModal from './modals/PopulateRegistryModal'
import ShareRegistryModal from './modals/ShareRegistryModal'

const Modals = () => {
  const dispatch = useDispatch()

  const isPopulateRegistryModalOpen = useSelector(
    state => state.modals.createRegistry !== undefined
  )
  const handlePopulateRegistryModalClose = useCallback(
    () =>
      dispatch({ type: 'modals/hide', payload: { name: 'createRegistry' } }),
    [dispatch]
  )

  const isCreateRegistryItemModalOpen = useSelector(
    state => state.modals.createRegistryItem !== undefined
  )
  const handleCreateRegistryItemModalClose = useCallback(
    () =>
      dispatch({
        type: 'modals/hide',
        payload: { name: 'createRegistryItem' }
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

      <CreateRegistryItemModal
        open={isCreateRegistryItemModalOpen}
        onClose={handleCreateRegistryItemModalClose}
      />

      <ShareRegistryModal
        open={isShareRegistryModalOpen}
        onClose={handleShareRegistryModalClose}
      />
    </>
  )
}

export default memo(Modals)
