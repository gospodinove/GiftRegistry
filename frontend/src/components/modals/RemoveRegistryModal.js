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

function RemoveRegistryModal({ open, onClose }) {
  const dispatch = useDispatch()

  const initialData = useSelector(state => state.modals.removeRegistry?.data)

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()

      // setIsLoading(true)

      try {
        const result = await api('registries/' + initialData.id, 'delete')

        console.log(result)

        dispatch({
          type: 'registries/remove'
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
        // setIsLoading(false)
      }
    },
    [dispatch, handleClose, initialData?.id]
  )

  // useEffect(() => {
  //   const listener = event => {
  //     if (event.code === 'Enter' || event.code === 'NumpadEnter') {
  //       handleSubmit()
  //       event.preventDefault()
  //     }
  //   }
  //   document.addEventListener('keydown', listener)
  //   return () => {
  //     document.removeEventListener('keydown', listener)
  //   }
  // }, [handleSubmit])

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        {/* onSubmit={handleSubmit} */}
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
          <Button onClick={handleSubmit} color={initialData?.color} autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default memo(RemoveRegistryModal)
