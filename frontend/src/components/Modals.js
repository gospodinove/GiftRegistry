import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CreateRegistryItemModal from './modals/CreateRegistryItemModal'
import CreateRegistryModal from './modals/CreateRegistryModal'

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
    </>
  )
}

export default Modals
