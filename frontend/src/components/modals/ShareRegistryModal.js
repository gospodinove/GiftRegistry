import { memo, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../../utils/api'
import Button from '../Button'
import TextField from '../TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'

function ShareRegistryModal({ open, onClose }) {
  const dispatch = useDispatch()

  const initialData = useSelector(state => state.modals.shareRegistry)

  const [emails, setEmails] = useState([''])
  const [errors, setErrors] = useState([])

  const handleClose = useCallback(() => {
    onClose()

    setTimeout(() => {
      setEmails([''])
      setErrors([])
    }, 100)
  }, [onClose])

  const handleEmailChange = useCallback(
    e => {
      const index = e.target.getAttribute('data-index')
      const copy = [...emails]

      copy[index] = e.target.value

      setEmails(copy)
    },
    [emails]
  )

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()

      if (emails.some(email => email === '')) {
        return
      }

      setEmails([...emails, ''])
    },
    [emails]
  )

  const handleSendClick = useCallback(
    async e => {
      e.preventDefault()

      if (!initialData?.registryId) {
        return
      }

      setErrors([])

      const data = { emails: emails.filter(e => e !== '') }

      try {
        const response = await api(
          'registries/' + initialData.registryId + '/share',
          'patch',
          data
        )

        dispatch({ type: 'registries/update', payload: response.registry })

        handleClose()
      } catch (error) {
        switch (error.type) {
          case 'incomplete-registration':
            dispatch({
              type: 'toast/show',
              payload: { type: 'error', message: error.data }
            })
            return

          case 'field-error':
            setErrors(error.data)
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
      }
    },
    [emails, initialData?.registryId, dispatch, handleClose]
  )

  const renderTextField = (index, email, isInvited) => (
    <TextField
      key={isInvited ? email : index + 'email'}
      margin="normal"
      id={isInvited ? email : index + 'email'}
      label={isInvited ? 'Invited' : 'Email ' + (index + 1)}
      value={email}
      disabled={isInvited}
      onChange={handleEmailChange}
      type="email"
      fullWidth
      variant="outlined"
      inputProps={{ 'data-index': index }}
      autoFocus={index === emails.length - 1}
      error={isInvited ? undefined : errors['emails.' + index] !== undefined}
      helperText={isInvited ? undefined : errors['emails.' + index]}
      color={initialData?.color}
    />
  )

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Share registry</DialogTitle>
        <DialogContent>
          {initialData?.users.map((user, index) =>
            renderTextField(index, user.email, true)
          )}
          {emails.map((email, index) => renderTextField(index, email, false))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color={initialData?.color}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color={initialData?.color}>
            Add more
          </Button>
          {/* hidden because it is needed to trigger the submit action of the form by pressing ENTER */}
          <Button type="submit" sx={{ display: 'none' }}></Button>
          {/* this is used as the real submit button */}
          <Button onClick={handleSendClick} color={initialData?.color}>
            Send
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default memo(ShareRegistryModal)
