import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Button, Stack, Typography } from '@mui/material'
import { api } from '../utils/api'

export default function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const [errors, setErrors] = React.useState({})

  const [isLoading, setIsLoading] = React.useState(true)

  const onSubmit = React.useCallback(
    async e => {
      e.preventDefault()

      setIsLoading(true)
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
              // TODO: show toast
              console.log(response.errors)
              return

            default:
              return
          }
        }

        // TODO: store user in redux
        console.log(response.user)
      } catch {
        // TODO: show toast
        console.log('Register error')
      } finally {
        setIsLoading(false)
      }
    },
    [email, password]
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
