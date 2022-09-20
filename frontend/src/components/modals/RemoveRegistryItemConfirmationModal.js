import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'
import { useMemo } from 'react'
import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { modalInitialDataForName, MODAL_NAMES } from '../../redux/modalsSlice'
import {
  isRemovingItem,
  removeRegistryItem
} from '../../redux/registryItemsSlice'
import Button from '../Button'
import { styles } from './RemoveRegistryItemConfirmationModal.styles'

function RemoveRegistryItemConfirmationModal({ open, onClose }) {
  const dispatch = useDispatch()

  const isLoading = useSelector(isRemovingItem)

  const initialData = useSelector(state =>
    modalInitialDataForName(state, MODAL_NAMES.removeRegistryItemConfirmation)
  )

  const removeRegistryItemConfirmationStyles = useMemo(
    () => styles(initialData?.color),
    [initialData?.color]
  )

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()

      dispatch(
        removeRegistryItem({
          itemId: initialData.item.id,
          registryId: initialData.registryId
        })
      )
      handleClose()
    },
    [dispatch, handleClose, initialData?.item?.id, initialData?.registryId]
  )

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography component="span" variant="h6">
          Delete{' '}
        </Typography>

        <Typography
          component="span"
          variant="h6"
          sx={removeRegistryItemConfirmationStyles.typography}
        >
          {initialData?.item.name}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography component="span" variant="h6">
          Are you sure you want to delete{' '}
        </Typography>
        <Typography
          component="span"
          variant="h6"
          sx={removeRegistryItemConfirmationStyles.button}
        >
          {initialData?.item.name}
        </Typography>
        <Typography component="span" variant="h6">
          ?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color={initialData?.color}>
          Cancel
        </Button>
        <Button
          type="submit"
          color={initialData?.color}
          loading={isLoading}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(RemoveRegistryItemConfirmationModal)
