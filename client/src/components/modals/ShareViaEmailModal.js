import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../Button'
import TextField from '../TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import { styles } from './ShareRegistryModal.styles'
import {
  isRegistryShared,
  isSharingRegistry,
  shareViaEmail
} from '../../redux/registriesSlice'
import { modalInitialDataForName } from '../../redux/modalsSlice'
import { MODAL_NAMES } from '../../constants/types'

function ShareViaEmailModal({ open, onClose }) {
  const dispatch = useDispatch()

  const initialData = useSelector(state =>
    modalInitialDataForName(state, MODAL_NAMES.shareViaEmail)
  )
  const isLoading = useSelector(isSharingRegistry)
  const shouldCloseModal = useSelector(isRegistryShared)
  const reduxErrors = useSelector(state => state.registries.shareErrors)

  const [emails, setEmails] = useState([''])
  const [errors, setErrors] = useState([])

  useEffect(() => {
    setErrors(reduxErrors ?? [])
  }, [reduxErrors])

  const handleClose = useCallback(() => {
    onClose()

    setTimeout(() => {
      setEmails([''])
      setErrors([])
    }, 100)
  }, [onClose])

  useEffect(() => {
    if (shouldCloseModal) {
      handleClose()
    }
  }, [shouldCloseModal, handleClose])

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
    e => {
      e.preventDefault()

      if (!initialData?.registryId) {
        return
      }

      setErrors([])

      const data = { emails: emails.filter(e => e !== '') }
      dispatch(shareViaEmail({ id: initialData.registryId, data }))
    },
    [emails, initialData, dispatch]
  )

  const renderTextField = (index, email, isInvited) => (
    <TextField
      key={isInvited ? email : index + 'email'}
      id={isInvited ? email : index + 'email'}
      label={isInvited ? 'Invited' : 'Email ' + (index + 1)}
      value={email}
      disabled={isInvited}
      type="email"
      inputProps={{ 'data-index': index }}
      autoFocus={index === emails.length - 1}
      error={isInvited ? undefined : errors['emails.' + index] !== undefined}
      helperText={isInvited ? undefined : errors['emails.' + index]}
      color={initialData?.color}
      onChange={handleEmailChange}
    />
  )

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Share registry</DialogTitle>
        <DialogContent>
          {initialData?.users.map((user, index) =>
            renderTextField(index, user.email, true)
          )}
          {emails.map((email, index) => renderTextField(index, email, false))}
        </DialogContent>
        <DialogActions>
          <Button color={initialData?.color} onClick={handleClose}>
            Cancel
          </Button>
          <Button color={initialData?.color} onClick={handleSubmit}>
            Add more
          </Button>
          {/* hidden because it is needed to trigger the submit action of the form by pressing ENTER */}
          <Button type="submit" sx={styles.hiddenButton} />
          {/* this is used as the real submit button */}
          <Button
            color={initialData?.color}
            loading={isLoading}
            onClick={handleSendClick}
          >
            Send
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default memo(ShareViaEmailModal)
