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
  isRegistryUpdated,
  isUpdatingRegistry,
  togglePublicRegistry
} from '../../redux/registriesSlice'
import { modalInitialDataForName, MODAL_NAMES } from '../../redux/modalsSlice'
import { BASE_URL } from '../../constants'
import { styles } from './ShareViaLinkConfirmationModal.styles'

function ShareViaLinkConfirmationModal({ open, onClose }) {
  const dispatch = useDispatch()

  const initialData = useSelector(state =>
    modalInitialDataForName(state, MODAL_NAMES.shareViaLinkConfirmation)
  )
  const isLoading = useSelector(isUpdatingRegistry)
  const shouldClose = useSelector(isRegistryUpdated)

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

  const handleConfirmClick = useCallback(async () => {
    navigator.clipboard.writeText(BASE_URL + '/registry/' + initialData.id)
    dispatch(togglePublicRegistry(initialData.id))
    onClose()
  }, [dispatch, initialData?.id, onClose])

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Share registry{' '}
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
            Everybody with the link will have access to your registry{' '}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color={initialData?.color} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmClick}
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

export default memo(ShareViaLinkConfirmationModal)
