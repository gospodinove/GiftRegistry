import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CreateRegistryItemModal from './modals/CreateRegistryItemModal'
import CreateRegistryModal from './modals/CreateRegistryModal'
import ShareRegistryModal from './modals/ShareRegistryModal'

const Modals = () => {
  const dispatch = useDispatch()

  const isCreateRegistryModalOpen = useSelector(
    state => state.modals.createRegistry !== undefined
  )
  const handleCreateRegistryModalClose = useCallback(
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
      <CreateRegistryModal
        open={isCreateRegistryModalOpen}
        onClose={handleCreateRegistryModalClose}
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

export default Modals
