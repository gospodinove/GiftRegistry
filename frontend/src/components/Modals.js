import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CreateRegistryModal from './CreateRegistryModal'

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

  return (
    <>
      <CreateRegistryModal
        open={isCreateRegistryModalOpen}
        onClose={handleCreateRegistryModalClose}
      />
    </>
  )
}

export default Modals
