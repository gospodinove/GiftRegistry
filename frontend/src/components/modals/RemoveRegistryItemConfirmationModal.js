import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'
import { useMemo, useState } from 'react'
import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../../utils/api'
import Button from '../Button'
import { styles } from './RemoveRegistryItemConfirmationModal.styles'

function RemoveRegistryItemConfirmationModal({ open, onClose }) {
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)

  const initialData = useSelector(
    state => state.modals.removeRegistryItemConfirmation?.data
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

      setIsLoading(true)
      try {
        await api('registryItems/' + initialData.item.id, 'delete')

        dispatch({
          type: 'registryItems/remove',
          payload: {
            id: initialData.item.id,
            registryId: initialData.registryId
          }
        })

        handleClose()
      } catch (error) {
        switch (error.type) {
          case 'incomplete-registration':
            dispatch({
              type: 'toast/show',
              payload: {
                type: 'error',
                message: error.data,
                navigation: { title: 'Register', target: '/register' }
              }
            })
            return

          case 'general':
            dispatch({
              type: 'toast/show',
              payload: { type: 'error', message: error.data }
            })
            return

          default:
            dispatch({
              type: 'toast/show',
              payload: { type: 'error', message: 'Something went wrong' }
            })
            return
        }
      } finally {
        setIsLoading(false)
      }
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
