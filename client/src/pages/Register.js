import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Stack, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../components/Button'
import {
  completeRegistration,
  isCompletingRegistration,
  isRegistering,
  register
} from '../redux/authSlice'

function Register() {
  const dispatch = useDispatch()

  const user = useSelector(state => state.auth.user)

  const isCompleteRegistrationVariant = useMemo(
    () => user !== undefined && !user.isRegistrationComplete,
    [user]
  )

  const isLoading = useSelector(state =>
    isCompleteRegistrationVariant
      ? isCompletingRegistration(state)
      : isRegistering(state)
  )

  const reduxErrors = useSelector(state =>
    isCompleteRegistrationVariant
      ? state.auth.completeRegistrationErrors
      : state.auth.registerErrors
  )

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isCompleteRegistrationVariant) {
      return
    }

    // fill the form with the data from the partially registered user
    setEmail(user.email)
  }, [isCompleteRegistrationVariant, user])

  useEffect(() => {
    if (reduxErrors !== undefined) {
      setErrors(reduxErrors)
    }
  }, [reduxErrors])

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

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()

      const data = {
        firstName,
        lastName,
        email,
        password
      }

      setErrors({})

      if (user === undefined) {
        dispatch(register(data))
      } else {
        dispatch(completeRegistration(data))
      }
    },
    [dispatch, email, firstName, lastName, password, user]
  )

  return (
    <Box display="flex" justifyContent="center" minHeight="100vh" ml={2} mr={2}>
      <Box
        component="form"
        autoComplete="off"
        width="400px"
        onSubmit={handleSubmit}
      >
        <Stack spacing={2} mt={2}>
          <Typography variant="h4">
            {user ? 'Complete registration' : 'Register'}
          </Typography>

          <TextField
            id="first-name"
            label="First name"
            value={firstName}
            onChange={handleFirstNameChange}
            error={errors.firstName !== undefined}
            helperText={errors.firstName}
            required
          />
          <TextField
            id="last-name"
            label="Last name"
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
            value={email}
            onChange={handleEmailChange}
            error={errors.email !== undefined}
            helperText={errors.email}
            disabled={user !== undefined}
            required
          />

          <TextField
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={handlePasswordChange}
            error={errors.password !== undefined}
            helperText={errors.password}
            required
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

export default memo(Register)
