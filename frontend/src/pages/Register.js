import React, { useCallback } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Button, Stack, Typography } from '@mui/material'
import { api } from '../utils/api'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
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

  const handleFirstNameChange = useCallback(
    e => {
      setFirstName(e.target.value)

      if (errors.firstName !== undefined) {
        setErrors({ ...errors, firstName: undefined })
      }
    },
    [errors]
  )

  const handleLastNameChange = useCallback(
    e => {
      setLastName(e.target.value)

      if (errors.lastName !== undefined) {
        setErrors({ ...errors, lastName: undefined })
      }
    },
    [errors]
  )

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
    [firstName, lastName, email, password, navigate, dispatch]
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
            onChange={handleFirstNameChange}
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
            onChange={handleLastNameChange}
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

export default React.memo(Register)
