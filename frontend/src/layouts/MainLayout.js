import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Outlet, useNavigate } from 'react-router-dom'

export default function MainLayout() {
  const navigate = useNavigate()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gift Registry
          </Typography>

          <Button color="inherit" onClick={() => navigate('login')}>
            Login
          </Button>
          <Button color="inherit" onClick={() => navigate('register')}>
            Register
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ p: 3, pt: 0 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
