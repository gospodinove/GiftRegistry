import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
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
import { styles } from './MainLayout.styles'
import { api } from '../utils/api'

const authNavItems = [
  { title: 'login', route: 'login' },
  { title: 'register', route: 'register' }
]

function MainLayout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

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

  const handleLogoutClick = React.useCallback(async () => {
    try {
      const response = await api('auth/logout')

      if (!response.success) {
        dispatch({
          type: 'toast/show',
          payload: { type: 'error', message: 'Could not log out' }
        })
        return
      }

      dispatch({ type: 'auth/clear' })
      dispatch({ type: 'registries/clear' })
      dispatch({ type: 'registryItems/clear' })

      dispatch({
        type: 'toast/show',
        payload: { type: 'success', message: 'Logged out!' }
      })
    } catch {
      dispatch({
        type: 'toast/show',
        payload: { type: 'error', message: 'Could not log out' }
      })
    }
  }, [dispatch])

  const drawer = React.useCallback(
    () => (
      <Box sx={styles.drawerBox}>
        <Box display="flex" justifyContent="flex-end" p={0.5} pr={2}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <List>
          {isAuthenticated ? (
            <ListItem key="logout" disablePadding>
              <ListItemButton
                onClick={handleLogoutClick}
                sx={styles.listItemButton}
              >
                <ListItemText primary="Log out" />
              </ListItemButton>
            </ListItem>
          ) : (
            authNavItems.map(item => (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  onClick={() => handleDrawerItemClick(item.route)}
                  sx={styles.listItemButton}
                >
                  <ListItemText primary={item.title.toUpperCase()} />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Box>
    ),
    [
      handleDrawerItemClick,
      handleDrawerToggle,
      isAuthenticated,
      handleLogoutClick
    ]
  )

  const container = React.useMemo(
    () => (window !== undefined ? window.document.body : undefined),
    []
  )

  const handleHomeClick = React.useCallback(() => navigate('/'), [navigate])
  const handleAuthItemClick = React.useCallback(
    e => {
      const route = e.target.getAttribute('data-route')
      navigate(route)
    },
    [navigate]
  )

  return (
    <Box sx={styles.rootBox}>
      <AppBar position="fixed" sx={styles.appBar}>
        <Toolbar sx={styles.toolbar}>
          <Typography
            variant="h6"
            component="div"
            sx={styles.typography}
            onClick={handleHomeClick}
          >
            Gift Registry
          </Typography>

          <Box
            sx={{
              display: { xs: 'none', sm: 'block' }
            }}
          >
            {isAuthenticated ? (
              <Button key="logout" color="inherit" onClick={handleLogoutClick}>
                Log out
              </Button>
            ) : (
              authNavItems.map(item => (
                <Button
                  key={item.title}
                  color="inherit"
                  data-route={item.route}
                  onClick={handleAuthItemClick}
                >
                  {item.title}
                </Button>
              ))
            )}
          </Box>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={styles.iconButton}
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
          sx={styles.drawer}
        >
          {drawer()}
        </Drawer>
      </Box>

      <Box component="main" sx={styles.mainBox}>
        <Toolbar sx={styles.toolbar} />
        <Outlet />
      </Box>

      <Toast />
    </Box>
  )
}

export default React.memo(MainLayout)
