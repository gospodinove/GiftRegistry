import {
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton
} from '@mui/material'
import { memo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Icon from '../../components/Icon'
import { AUTH_NAV_ITEMS, NAVBAR_HEIGHT } from '../../constants'
import { styles } from './MainLayoutDrawer.styles'

const MainLayoutDrawer = ({
  container,
  open,
  user,
  isFetchingSession,
  onToggle,
  onLogoutClick,
  onProfileClick
}) => {
  const navigate = useNavigate()

  const [isUserInnerDrawerOpen, setIsUserInnerDrawerOpen] = useState(false)

  const isAuthenticated = user !== undefined

  const handleInnerDrawerToggle = useCallback(() => {
    setIsUserInnerDrawerOpen(!isUserInnerDrawerOpen)
  }, [isUserInnerDrawerOpen])

  const handleDrawerItemClick = useCallback(
    route => {
      onToggle()
      navigate(route)
    },
    [onToggle, navigate]
  )

  const handleProfileClick = useCallback(() => {
    onProfileClick()
    onToggle()
  }, [onProfileClick, onToggle])

  const renderDrawerAuthItems = useCallback(() => {
    if (isFetchingSession) {
      return (
        <Box mr={3} ml={3}>
          <Skeleton height={40} width="100%" />
        </Box>
      )
    }

    if (!isAuthenticated) {
      return AUTH_NAV_ITEMS.map(item => (
        <ListItem key={item.title} disablePadding>
          <ListItemButton onClick={() => handleDrawerItemClick(item.route)}>
            <ListItemIcon>
              <Icon type={item.icon} />
            </ListItemIcon>
            <ListItemText primary={item.title.toUpperCase()} />
          </ListItemButton>
        </ListItem>
      ))
    }

    return (
      <>
        <ListItem key="logout" disablePadding>
          <ListItemButton onClick={handleInnerDrawerToggle}>
            <ListItemIcon>
              <Icon type="account-box" />
            </ListItemIcon>
            <ListItemText
              primary={(user?.firstName + ' ' + user?.lastName).toUpperCase()}
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
              onClick={handleProfileClick}
              sx={styles.nestedListItem}
            >
              <ListItemIcon>
                <Icon type="account-circle" />
              </ListItemIcon>
              <ListItemText primary="PROFILE" />
            </ListItemButton>
            <ListItemButton onClick={onLogoutClick} sx={styles.nestedListItem}>
              <ListItemIcon>
                <Icon type="logout" />
              </ListItemIcon>
              <ListItemText primary="LOG OUT" />
            </ListItemButton>
          </List>
        </Collapse>
      </>
    )
  }, [
    handleDrawerItemClick,
    handleInnerDrawerToggle,
    handleProfileClick,
    isAuthenticated,
    isFetchingSession,
    isUserInnerDrawerOpen,
    onLogoutClick,
    user?.firstName,
    user?.lastName
  ])

  return (
    <Drawer
      container={container}
      anchor="top"
      variant="temporary"
      open={open}
      onClose={onToggle}
      ModalProps={{ keepMounted: true }}
      sx={styles.drawer}
    >
      <Box sx={styles.drawerBox}>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          p={0.5}
          pr={2}
          height={NAVBAR_HEIGHT}
        >
          <Button onClick={onToggle} icon-mode="icon-only" icon="close" />
        </Box>

        <Divider />

        <List>{renderDrawerAuthItems()}</List>
      </Box>
    </Drawer>
  )
}

export default memo(MainLayoutDrawer)
