import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Button, Stack, Typography } from '@mui/material'
import { api } from '../utils/api'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const [errors, setErrors] = React.useState({})

  const onSubmit = React.useCallback(
    async e => {
      e.preventDefault()

      setErrors({})

      const user = {
        firstName,
        lastName,
        email,
        password
      }

      try {
        const response = await api('auth/register', 'POST', user)

        if (!response.success) {
          switch (response.errorType) {
            case 'field-error':
              setErrors(response.errors)
              return

            case 'general':
              // TODO: show toast
              console.log(response.errors)
              return

            default:
              return
          }
        }

        dispatch({ type: 'auth/setUser', payload: response.user })
        navigate('/')
      } catch {
        // TODO: show toast
        console.log('Register error')
      }
    },
    [firstName, lastName, email, password]
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
          <Typography variant="h4">Register</Typography>

          <TextField
            id="first-name"
            label="First name"
            variant="outlined"
            fullWidth
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            error={errors.firstName !== undefined}
            helperText={errors.firstName}
            required
          />
          <TextField
            id="last-name"
            label="Last name"
            variant="outlined"
            fullWidth
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            error={errors.lastName !== undefined}
            helperText={errors.lastName}
            required
          />

          <TextField
            id="email"
            type="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            onChange={e => setPassword(e.target.value)}
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
