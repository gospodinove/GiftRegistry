import { Alert, Button, Snackbar } from '@mui/material'
import { memo, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { resetModalsSlice } from '../redux/modalsSlice'
import { styles } from './Toast.styles'

const Toast = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const data = useSelector(state => state.toast)

  const handleClose = useCallback(
    () => dispatch({ type: 'toast/hide' }),
    [dispatch]
  )

  const handleActionClick = useCallback(() => {
    dispatch(resetModalsSlice())
    navigate(data.navigation.target)
    handleClose()
  }, [data.navigation?.target, dispatch, handleClose, navigate])

  const action = useMemo(
    () =>
      data.navigation !== undefined ? (
        <Button color="inherit" size="small" onClick={handleActionClick}>
          {data.navigation.title}
        </Button>
      ) : undefined,
    [data.navigation, handleActionClick]
  )

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={data.open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        severity={data.type}
        sx={styles.alert}
        action={action}
        onClose={handleClose}
      >
        {data.message}
      </Alert>
    </Snackbar>
  )
}

export default memo(Toast)
