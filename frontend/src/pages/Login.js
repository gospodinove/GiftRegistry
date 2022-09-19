import { memo, useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Stack, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../components/Button'
import { login } from '../redux/authSlice'
import { DATA_STATUS } from '../constants'

function Login() {
  const dispatch = useDispatch()

  const isLoading = useSelector(
    state => state.auth.loginStatus === DATA_STATUS.loading
  )

  const reduxErrors = useSelector(state => state.auth.loginErrors)

  useEffect(() => {
    if (reduxErrors !== undefined) {
      setErrors(reduxErrors)
    }
  }, [reduxErrors])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [errors, setErrors] = useState({})

  const handleEmailChange = useCallback(
    e => {
      setEmail(e.target.value)

      if (errors.email !== undefined) {
        setErrors({ ...errors, email: undefined })
      }
    },
    [errors]
  )

  const handlePasswordChange = useCallback(
    e => {
      setPassword(e.target.value)

      if (errors.password !== undefined) {
        setErrors({ ...errors, password: undefined })
      }
    },
    [errors]
  )

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()
      setErrors({})
      dispatch(login({ email, password }))
    },
    [email, password, dispatch]
  )

  return (
    <Box display="flex" justifyContent="center" minHeight="100vh">
      <Box
        component="form"
        autoComplete="off"
        width="400px"
        onSubmit={handleSubmit}
      >
        <Stack spacing={2} mt={2}>
          <Typography variant="h4">Login</Typography>

          <TextField
            id="email"
            type="email"
            label="Email"
            variant="outlined"
            value={email}
            error={errors.email !== undefined}
            helperText={errors.email}
            required
            onChange={handleEmailChange}
          />

          <TextField
            id="password"
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            error={errors.password !== undefined}
            helperText={errors.password}
            required
            onChange={handlePasswordChange}
          />

          <Button
            variant="contained"
            type="submit"
            size="large"
            loading={isLoading}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

export default memo(Login)
