import { memo, useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Button, Stack, Typography } from '@mui/material'
import { api } from '../utils/api'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

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

      try {
        const response = await api('auth/login', 'POST', {
          email,
          password
        })

        dispatch({ type: 'auth/setUser', payload: response.user })
        navigate('/')
      } catch (error) {
        switch (error.type) {
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
    [email, password, navigate, dispatch]
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
            fullWidth
            value={email}
            onChange={handleEmailChange}
            error={errors.email !== undefined}
            helperText={errors.email}
            required
          />

          <TextField
            id="password"
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
            error={errors.password !== undefined}
            helperText={errors.password}
            required
          />

          <Button variant="contained" type="submit" size="large">
            Submit
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

export default memo(Login)
