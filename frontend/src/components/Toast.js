import { Alert, Snackbar } from '@mui/material'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Toast = () => {
  const dispatch = useDispatch()

  const data = useSelector(state => state.toast)

  const handleClose = useCallback(
    () => dispatch({ type: 'toast/hide' }),
    [dispatch]
  )

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={data.open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert severity={data.type} sx={{ width: '100%' }} onClose={handleClose}>
        {data.message}
      </Alert>
    </Snackbar>
  )
}

export default Toast
