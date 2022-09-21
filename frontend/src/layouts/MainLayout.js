import { memo, useMemo, useState, useCallback } from 'react'
import Button from '../components/Button'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  AppBar,
  Box,
  Menu,
  MenuItem,
  Skeleton,
  Toolbar,
  Typography
} from '@mui/material'
import Icon from '../components/Icon'
import Toast from '../components/Toast'
import Modals from '../components/Modals'
import { styles } from './MainLayout.styles'
import { AUTH_NAV_ITEMS, COLORS } from '../constants'
import MainLayoutDrawer from './components/MainLayoutDrawer'
import { isFetchingUserSession, logout } from '../redux/authSlice'

function MainLayout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isFetchingSession = useSelector(isFetchingUserSession)

  const user = useSelector(state => state.auth.user)
  const isAuthenticated = user !== undefined

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false)
  const [avatarDropdownAnchorElement, setAvatarDropdownAnchorElement] =
    useState(null)

  const handleDrawerToggle = useCallback(() => {
    setIsDrawerOpen(!isDrawerOpen)
  }, [isDrawerOpen, setIsDrawerOpen])

  const handleLogoutClick = useCallback(async () => {
    setIsAvatarDropdownOpen(false)
    setAvatarDropdownAnchorElement(null)

    dispatch(logout())
  }, [dispatch])

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

  const handleProfileClick = useCallback(() => navigate('/profile'), [navigate])

  const renderAuthItems = useCallback(() => {
    if (isFetchingSession) {
      return <Skeleton height={30} width={200} sx={styles.skeleton} />
    }

    if (!isAuthenticated) {
      return AUTH_NAV_ITEMS.map(item => (
        <Button
          key={item.title}
          color={COLORS.WHITE}
          data-route={item.route}
          onClick={handleAuthItemClick}
          icon={item.icon}
          icon-mode="start"
        >
          {item.title}
        </Button>
      ))
    }

    return (
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
            <Icon type="logout" sx={styles.icons} />
            Logout
          </MenuItem>

          <MenuItem onClick={handleProfileClick}>
            <Icon type="account-circle" sx={styles.icons} />
            Profile
          </MenuItem>
        </Menu>
      </>
    )
  }, [
    avatarDropdownAnchorElement,
    handleAuthItemClick,
    handleAvatarDropdownToggle,
    handleLogoutClick,
    handleProfileClick,
    isAuthenticated,
    isAvatarDropdownOpen,
    isFetchingSession,
    user?.firstName,
    user?.lastName
  ])

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

          <Box sx={styles.authNavBox}>{renderAuthItems()}</Box>

          <Button
            color={COLORS.WHITE}
            icon="menu"
            icon-mode="icon-only"
            aria-label="open drawer"
            edge="start"
            sx={styles.iconButton}
            onClick={handleDrawerToggle}
          >
            <Icon type="menu" />
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <MainLayoutDrawer
          container={container}
          open={isDrawerOpen}
          user={user}
          isFetchingSession={isFetchingSession}
          onToggle={handleDrawerToggle}
          onLogoutClick={handleLogoutClick}
          onProfileClick={handleProfileClick}
        />
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
