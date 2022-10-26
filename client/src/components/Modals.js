import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideModal, isModalOpen, MODAL_NAMES } from '../redux/modalsSlice'
import PopulateRegistryItemModal from './modals/PopulateRegistryItemModal'
import RemoveRegistryItemConfirmationModal from './modals/RemoveRegistryItemConfirmationModal'
import PopulateRegistryModal from './modals/PopulateRegistryModal'
import ShareViaEmailModal from './modals/ShareViaEmailModal'
import RemoveRegistryConfirmationModal from './modals/RemoveRegistryConfirmationModal'
import ShareViaLinkConfirmationModal from './modals/ShareViaLinkConfirmationModal'

const Modals = () => {
  const dispatch = useDispatch()

  const isPopulateRegistryModalOpen = useSelector(state =>
    isModalOpen(state, MODAL_NAMES.populateRegistry)
  )
  const handlePopulateRegistryModalClose = useCallback(
    () => dispatch(hideModal({ name: MODAL_NAMES.populateRegistry })),
    [dispatch]
  )

  const isPopulateRegistryItemModalOpen = useSelector(state =>
    isModalOpen(state, MODAL_NAMES.populateRegistryItem)
  )
  const handlePopulateRegistryItemModalClose = useCallback(
    () => dispatch(hideModal({ name: MODAL_NAMES.populateRegistryItem })),
    [dispatch]
  )

  const isRemoveRegistryItemConfirmationModalOpen = useSelector(state =>
    isModalOpen(state, MODAL_NAMES.removeRegistryItemConfirmation)
  )
  const handleRemoveRegistryItemConfirmationModalClose = useCallback(
    () =>
      dispatch(hideModal({ name: MODAL_NAMES.removeRegistryItemConfirmation })),
    [dispatch]
  )

  const isShareViaEmailModalOpen = useSelector(state =>
    isModalOpen(state, MODAL_NAMES.shareViaEmail)
  )
  const handleShareViaEmailModalClose = useCallback(
    () => dispatch(hideModal({ name: MODAL_NAMES.shareViaEmail })),
    [dispatch]
  )

  const isRemoveRegistryConfirmationModalOpen = useSelector(state =>
    isModalOpen(state, MODAL_NAMES.removeRegistryConfirmation)
  )

  const handleRemoveRegistryConfirmationModalClose = useCallback(
    () => dispatch(hideModal({ name: MODAL_NAMES.removeRegistryConfirmation })),
    [dispatch]
  )

  const isShareViaLinkConfirmationModalOpen = useSelector(state =>
    isModalOpen(state, MODAL_NAMES.shareViaLinkConfirmation)
  )

  const handleShareViaLinkConfirmationModalClose = useCallback(
    () => dispatch(hideModal({ name: MODAL_NAMES.shareViaLinkConfirmation })),
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

      <RemoveRegistryItemConfirmationModal
        open={isRemoveRegistryItemConfirmationModalOpen}
        onClose={handleRemoveRegistryItemConfirmationModalClose}
      />

      <ShareViaEmailModal
        open={isShareViaEmailModalOpen}
        onClose={handleShareViaEmailModalClose}
      />

      <RemoveRegistryConfirmationModal
        open={isRemoveRegistryConfirmationModalOpen}
        onClose={handleRemoveRegistryConfirmationModalClose}
      />

      <ShareViaLinkConfirmationModal
        open={isShareViaLinkConfirmationModalOpen}
        onClose={handleShareViaLinkConfirmationModalClose}
      />
    </>
  )
}

export default memo(Modals)
