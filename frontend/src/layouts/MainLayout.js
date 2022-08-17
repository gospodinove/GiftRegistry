import { memo, useMemo, useState, useCallback } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '../components/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import Icon from '../components/Icon'
import Toast from '../components/Toast'
import Modals from '../components/Modals'
import { styles } from './MainLayout.styles'
import { api } from '../utils/api'

const authNavItems = [
  { title: 'login', route: 'login' },
  { title: 'register', route: 'register' }
]

function MainLayout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector(state => state.auth.user)
  const isAuthenticated = user !== undefined

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [innerDrawer, setInnerDrawer] = useState(false)
  const [toggleAvatarDropdown, setToggleAvatarDropdown] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleDrawerToggle = useCallback(() => {
    setIsDrawerOpen(!isDrawerOpen)
  }, [isDrawerOpen, setIsDrawerOpen])

  const handleInnerDrawerToggle = useCallback(() => {
    setInnerDrawer(!innerDrawer)
  }, [innerDrawer])

  const handleDrawerItemClick = useCallback(
    route => {
      handleDrawerToggle()
      navigate(route)
    },
    [handleDrawerToggle, navigate]
  )

  const handleLogoutClick = useCallback(async () => {
    try {
      await api('auth/logout')

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
        payload: { type: 'error', message: 'Something went wrong' }
      })
    }
    setToggleAvatarDropdown(false)
    setAnchorEl(null)
  }, [dispatch])

  const drawer = useCallback(
    () => (
      <Box sx={styles.drawerBox}>
        <Box display="flex" justifyContent="flex-end" p={0.5} pr={2}>
          <Button
            onClick={handleDrawerToggle}
            icon-mode="icon-only"
            icon="close"
          />
        </Box>

        <Divider />

        {/* <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItemButton>
        </List>
      </Collapse> */}

        <List>
          {isAuthenticated ? (
            <>
              <ListItem key="logout" disablePadding>
                <ListItemButton
                  onClick={handleInnerDrawerToggle}
                  sx={styles.listItemButton}
                >
                  <ListItemIcon>
                    <Icon type="account-box" />
                  </ListItemIcon>
                  <ListItemText
                    primary={(
                      user?.firstName +
                      ' ' +
                      user?.lastName
                    ).toUpperCase()}
                  />
                  {innerDrawer ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={innerDrawer} timeout="auto" unmountOnExit>
                <List>
                  <ListItemButton
                    onClick={handleLogoutClick}
                    sx={styles.logoutListItemButton}
                  >
                    <ListItemIcon>
                      <Icon type="logout" />
                    </ListItemIcon>
                    <ListItemText primary="LOG OUT" />
                  </ListItemButton>
                </List>
              </Collapse>
            </>
          ) : (
            authNavItems.map(item => (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  onClick={() => handleDrawerItemClick(item.route)}
                  sx={styles.listItemButton}
                >
                  <ListItemIcon>
                    <Icon type={item.title.replace(/\s/g, '')} />
                  </ListItemIcon>
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
      handleLogoutClick,
      user?.firstName,
      user?.lastName,
      innerDrawer,
      handleInnerDrawerToggle
    ]
  )

  const container = useMemo(
    () => (window !== undefined ? window.document.body : undefined),
    []
  )

  const handleHomeClick = useCallback(() => navigate('/'), [navigate])
  const handleAuthItemClick = useCallback(
    e => {
      const route = e.target.getAttribute('data-route')
      navigate(route)
    },
    [navigate]
  )

  const handleAvatarClick = useCallback(
    event => {
      setToggleAvatarDropdown(!toggleAvatarDropdown)
      setAnchorEl(anchorEl ? null : event.currentTarget)
    },
    [toggleAvatarDropdown, anchorEl]
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

          <Box sx={styles.authNavBox}>
            {isAuthenticated ? (
              <>
                <Button
                  icon="account-circle"
                  color="#ffffff"
                  icon-mode="start"
                  onClick={handleAvatarClick}
                >
                  {user?.firstName + ' ' + user?.lastName}
                </Button>

                <Menu
                  open={toggleAvatarDropdown}
                  anchorEl={anchorEl}
                  onClose={handleAvatarClick}
                >
                  <MenuItem onClick={handleLogoutClick}>
                    <Icon type="logout" />
                    {'\xa0\xa0Logout'}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              authNavItems.map(item => (
                <Button
                  key={item.title}
                  color="#ffffff"
                  data-route={item.route}
                  onClick={handleAuthItemClick}
                >
                  {item.title}
                </Button>
              ))
            )}
          </Box>

          <Button
            color="#ffffff"
            icon="menu"
            icon-mode="icon-only"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={styles.iconButton}
          >
            <Icon type="menu" />
          </Button>
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
      <Modals />
    </Box>
  )
}

export default memo(MainLayout)
