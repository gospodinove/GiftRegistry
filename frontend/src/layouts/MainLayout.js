import { memo, useMemo, useState, useCallback } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '../components/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Collapse from '@mui/material/Collapse'
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
import { COLORS } from '../constants'

const authNavItems = [
  { title: 'login', route: 'login', icon: 'login' },
  { title: 'register', route: 'register', icon: 'register' }
]

function MainLayout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector(state => state.auth.user)
  const isAuthenticated = user !== undefined

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isUserInnerDrawerOpen, setIsUserInnerDrawerOpen] = useState(false)
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false)
  const [avatarDropdownAnchorElement, setAvatarDropdownAnchorElement] =
    useState(null)

  const handleDrawerToggle = useCallback(() => {
    setIsDrawerOpen(!isDrawerOpen)
  }, [isDrawerOpen, setIsDrawerOpen])

  const handleInnerDrawerToggle = useCallback(() => {
    setIsUserInnerDrawerOpen(!isUserInnerDrawerOpen)
  }, [isUserInnerDrawerOpen])

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
    setIsAvatarDropdownOpen(false)
    setAvatarDropdownAnchorElement(null)
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
                  {isUserInnerDrawerOpen ? (
                    <Icon type="expand-less" />
                  ) : (
                    <Icon type="expand-more" />
                  )}
                </ListItemButton>
              </ListItem>
              <Collapse in={isUserInnerDrawerOpen} timeout="auto" unmountOnExit>
                <List>
                  <ListItemButton
                    onClick={handleLogoutClick}
                    sx={styles.nestedListItem}
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
                    <Icon type={item.icon} />
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
      isUserInnerDrawerOpen,
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

  const handleAvatarDropdownToggle = useCallback(
    event => {
      setIsAvatarDropdownOpen(!isAvatarDropdownOpen)
      setAvatarDropdownAnchorElement(
        avatarDropdownAnchorElement ? null : event.currentTarget
      )
    },
    [isAvatarDropdownOpen, avatarDropdownAnchorElement]
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
                  color={COLORS.WHITE}
                  icon-mode="start"
                  onClick={handleAvatarDropdownToggle}
                >
                  {user?.firstName + ' ' + user?.lastName}
                </Button>

                <Menu
                  open={isAvatarDropdownOpen}
                  anchorEl={avatarDropdownAnchorElement}
                  onClose={handleAvatarDropdownToggle}
                >
                  <MenuItem onClick={handleLogoutClick}>
                    <Icon type="logout" sx={styles.logoutIcon} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              authNavItems.map(item => (
                <Button
                  key={item.title}
                  color={COLORS.WHITE}
                  data-route={item.route}
                  onClick={handleAuthItemClick}
                >
                  {item.title}
                </Button>
              ))
            )}
          </Box>

          <Button
            color={COLORS.WHITE}
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
