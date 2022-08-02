import { Alert, Snackbar } from '@mui/material'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { styles } from './Toast.styles'

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
      <Alert severity={data.type} sx={styles.width} onClose={handleClose}>
        {data.message}
      </Alert>
    </Snackbar>
  )
}

export default React.memo(Toast)
