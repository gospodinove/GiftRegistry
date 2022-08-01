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
import { styles } from '../styles/MainLayoutStyles'

const authNavItems = [
  { title: 'login', route: 'login' },
  { title: 'register', route: 'register' }
]

function MainLayout() {
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
      <Box sx={styles.drawerBox}>
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
                    sx={styles.listItemButton}
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

  const container = React.useMemo(
    () => (window !== undefined ? window.document.body : undefined),
    []
  )

  const handleClick = React.useCallback(() => navigate('/'), [navigate])
  const handleButtonClick = React.useCallback(
    item => navigate(item.route),
    [navigate]
  )

  return (
    <Box sx={styles.box1}>
      <AppBar position="fixed" sx={styles.appBar}>
        <Toolbar sx={styles.toolbar1}>
          <Typography
            variant="h6"
            component="div"
            sx={styles.typography}
            onClick={handleClick}
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
                onClick={handleButtonClick(item)}
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

      <Box component="main" sx={styles.box2}>
        <Toolbar sx={styles.toolbar2} />
        <Outlet />
      </Box>

      <Toast />
    </Box>
  )
}

export default React.memo(MainLayout)
