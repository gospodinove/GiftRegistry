import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideModal, MODAL_NAMES } from '../redux/modalsSlice'
import PopulateRegistryItemModal from './modals/PopulateRegistryItemModal'
import PopulateRegistryModal from './modals/PopulateRegistryModal'
import ShareRegistryModal from './modals/ShareRegistryModal'

const Modals = () => {
  const dispatch = useDispatch()

  const isPopulateRegistryModalOpen = useSelector(
    state => state.modals.populateRegistry !== undefined
  )
  const handlePopulateRegistryModalClose = useCallback(
    () => dispatch(hideModal({ name: MODAL_NAMES.populateRegistry })),
    [dispatch]
  )

  const isPopulateRegistryItemModalOpen = useSelector(
    state => state.modals.populateRegistryItem !== undefined
  )
  const handlePopulateRegistryItemModalClose = useCallback(
    () => dispatch(hideModal({ name: MODAL_NAMES.populateRegistryItem })),
    [dispatch]
  )

  const isShareRegistryModalOpen = useSelector(
    state => state.modals.shareRegistry !== undefined
  )
  const handleShareRegistryModalClose = useCallback(
    () => dispatch(hideModal({ name: MODAL_NAMES.shareRegistry })),
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

      <ShareRegistryModal
        open={isShareRegistryModalOpen}
        onClose={handleShareRegistryModalClose}
      />
    </>
  )
}

export default memo(Modals)
