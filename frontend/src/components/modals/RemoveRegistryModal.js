import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'
import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../Button'
import { api } from '../../utils/api'
import { useState } from 'react'

function RemoveRegistryModal({ open, onClose }) {
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)

  const initialData = useSelector(state => state.modals.removeRegistry?.data)

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  // FIXME: After the registry gets removed an error message appears as fetchRegistry is still looking for the registry id which is no longer available

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()

      setIsLoading(true)

      try {
        await api('registries/' + initialData.id, 'delete')

        dispatch({
          type: 'registries/remove',
          payload: { id: initialData.id }
        })

        handleClose()
      } catch (error) {
        console.log(error)
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
            break

          case 'general':
            dispatch({
              type: 'toast/show',
              payload: { type: 'error', message: error.data }
            })
            break

          default:
            dispatch({
              type: 'toast/show',
              payload: { type: 'error', message: 'Something went wrong' }
            })
            break
        }
      } finally {
        setIsLoading(false)
      }
    },
    [dispatch, handleClose, initialData?.id]
  )

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Delete{' '}
          <Typography
            component="span"
            variant="h6"
            sx={{ color: initialData?.color }}
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
            sx={{ color: initialData?.color }}
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

export default memo(RemoveRegistryModal)
