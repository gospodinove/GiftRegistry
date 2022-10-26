import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../Button'
import {
  isRegistryRemoved,
  isRemovingRegistry,
  removeRegistry
} from '../../redux/registriesSlice'
import { modalInitialDataForName } from '../../redux/modalsSlice'
import { styles } from './RemoveRegistryConfirmationModal.styles'
import { MODAL_NAMES } from '../../constants/types'

function RemoveRegistryConfirmationModal({ open, onClose }) {
  const dispatch = useDispatch()

  const initialData = useSelector(state =>
    modalInitialDataForName(state, MODAL_NAMES.removeRegistryConfirmation)
  )
  const isLoading = useSelector(isRemovingRegistry)
  const shouldClose = useSelector(isRegistryRemoved)

  const modalStyles = useMemo(
    () => styles(initialData?.color),
    [initialData?.color]
  )

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (shouldClose) {
      handleClose()
    }
  }, [shouldClose, handleClose])

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()
      dispatch(removeRegistry(initialData.id))
    },
    [dispatch, initialData?.id]
  )

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Delete{' '}
          <Typography
            component="span"
            variant="h6"
            sx={modalStyles.registryName}
          >
            {initialData?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography component="span" variant="h6">
            Are you sure you wish to proceed with deleting{' '}
          </Typography>
          <Typography
            component="span"
            variant="h6"
            sx={modalStyles.registryName}
          >
            {initialData?.name}
          </Typography>
          <Typography component="span" variant="h6">
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color={initialData?.color} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color={initialData?.color}
            loading={isLoading}
            autoFocus
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default memo(RemoveRegistryConfirmationModal)
