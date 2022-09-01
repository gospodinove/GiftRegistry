import { memo, useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Stack, Typography } from '@mui/material'
import { api } from '../utils/api'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { setUser } from '../redux/authSlice'
import { showToast } from '../redux/toastSlice'

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(state => state.auth.user)

  const [isLoading, setIsLoading] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user === undefined || user.isRegistrationComplete) {
      return
    }

    // fill the form with the data from the partially registered user
    setEmail(user.email)
  }, [user])

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

  const makeRequest = useCallback(
    async (endpoint, method) => {
      const user = {
        firstName,
        lastName,
        email,
        password
      }

      setIsLoading(true)

      try {
        const response = await api(endpoint, method, user)

        dispatch(setUser(response.user))
        navigate('/')
      } catch (error) {
        switch (error.type) {
          case 'field-error':
            setErrors(error.data)
            return

          case 'general':
            dispatch(showToast({ type: 'error', message: error.data }))
            return

          default:
            dispatch(
              showToast({ type: 'error', message: 'Something went wrong' })
            )
            return
        }
      } finally {
        setIsLoading(false)
      }
    },
    [dispatch, email, firstName, lastName, navigate, password]
  )

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()

      setErrors({})

      if (user === undefined) {
        makeRequest('auth/register', 'post')
      } else {
        makeRequest('users/' + user.id, 'put')
      }
    },
    [makeRequest, user]
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
