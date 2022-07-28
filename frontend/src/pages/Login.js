import React, { useCallback } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Button, Stack, Typography } from '@mui/material'
import { api } from '../utils/api'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const [errors, setErrors] = React.useState({})

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

  const onSubmit = React.useCallback(
    async e => {
      e.preventDefault()

      setErrors({})

      try {
        const response = await api('auth/login', 'POST', {
          email,
          password
        })

        if (!response.success) {
          switch (response.errorType) {
            case 'field-error':
              setErrors(response.errors)
              return

            case 'general':
              dispatch({
                type: 'toast/show',
                payload: { type: 'error', message: response.errors }
              })
              return

            default:
              return
          }
        }

        dispatch({ type: 'auth/setUser', payload: response.user })
        navigate('/')
      } catch {
        dispatch({
          type: 'toast/show',
          payload: { type: 'error', message: 'Could not login' }
        })
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
        onSubmit={onSubmit}
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
