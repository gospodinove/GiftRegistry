import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import Toast from '../components/Toast'
import { navbarHeight } from '../constants'
import Modals from '../components/Modals'

const authNavItems = [
  { title: 'login', route: 'login' },
  { title: 'register', route: 'register' }
]

export default function MainLayout() {
  const navigate = useNavigate()

  const isAuthenticated = useSelector(state => state.auth.user !== undefined)

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  const handleDrawerToggle = React.useCallback(() => {
    setIsDrawerOpen(!isDrawerOpen)
  }, [isDrawerOpen, setIsDrawerOpen])

  const handleDrawerItemClick = React.useCallback(
    route => {
      handleDrawerToggle()
      navigate(route)
    },
    [handleDrawerToggle, navigate]
  )

  const drawer = React.useCallback(
    () => (
      <Box sx={{ textAlign: 'center' }}>
        <Box display="flex" justifyContent="flex-end" p={0.5} pr={2}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <List>
          {!isAuthenticated
            ? authNavItems.map(item => (
                <ListItem key={item.title} disablePadding>
                  <ListItemButton
                    onClick={() => handleDrawerItemClick(item.route)}
                    sx={{ textAlign: 'center' }}
                  >
                    <ListItemText primary={item.title.toUpperCase()} />
                  </ListItemButton>
                </ListItem>
              ))
            : null}
        </List>
      </Box>
    ),
    [handleDrawerItemClick, handleDrawerToggle, isAuthenticated]
  )

  const container = window !== undefined ? window.document.body : undefined

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <AppBar position="fixed" sx={{ height: `${navbarHeight}px` }}>
        <Toolbar sx={{ height: `${navbarHeight}px` }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            Gift Registry
          </Typography>

          <Box
            sx={{
              display: isAuthenticated ? 'none' : { xs: 'none', sm: 'block' }
            }}
          >
            {authNavItems.map(item => (
              <Button
                key={item.title}
                color="inherit"
                onClick={() => navigate(item.route)}
              >
                {item.title}
              </Button>
            ))}
          </Box>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          container={container}
          anchor="top"
          variant="temporary"
          open={isDrawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              height: '100%'
            }
          }}
        >
          {drawer()}
        </Drawer>
      </Box>

      <Box component="main" sx={{ p: 3, pt: 0, pb: 0, height: '100%' }}>
        <Toolbar sx={{ height: `${navbarHeight}px` }} />
        <Outlet />
      </Box>

      <Toast />
      <Modals />
    </Box>
  )
}
