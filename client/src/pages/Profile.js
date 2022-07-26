import { TabPanel, TabContext } from '@mui/lab'
import { Avatar, Typography, Grid, Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { styles } from './Profile.styles'
import { COLORS } from '../constants'
import Icon from '../components/Icon'
import { fetchUserItems, isFetchingUserItems } from '../redux/userItemsSlice'
import RegistryItemsMasonry from '../components/RegistryItemsMasonry'
import { useNavigate } from 'react-router-dom'
import { toggleRegistryItem } from '../redux/registryItemsSlice'

const PROFILE_TAB_VALUES = {
  takenProducts: 'takenProducts',
  notifications: 'notifications',
  other: 'other'
}

export default function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userItems = useSelector(state => state.userItems.data)

  const user = useSelector(state => state.auth.user)

  const [tabValue, setTabValue] = useState(PROFILE_TAB_VALUES.takenProducts)

  const isLoadingItems = useSelector(isFetchingUserItems)

  const handleTabChange = useCallback(
    (_e, newValue) => setTabValue(newValue),
    []
  )

  const handleLinkClick = useCallback(
    registryId => {
      navigate('/registry/' + registryId)
    },
    [navigate]
  )

  const handleItemToggle = useCallback(
    async (registryId, itemId) =>
      dispatch(toggleRegistryItem({ registryId, itemId })),
    [dispatch]
  )

  const fetchTakenRegistryItems = useCallback(async () => {
    dispatch(fetchUserItems(user.id))
  }, [dispatch, user.id])

  useEffect(() => {
    fetchTakenRegistryItems()
  }, [fetchTakenRegistryItems])

  return (
    <>
      <Box sx={styles.gridContainerBox}>
        <Grid container sx={styles.gridContainer}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" sx={styles.avatarBox}>
              <Avatar sx={styles.avatar}>
                {user.firstName[0] + user.lastName[0]}
              </Avatar>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={styles.gridItem}>
            <Box
              display="flex"
              justifyContent="space-between"
              height="100%"
              flexDirection="column"
              sx={styles.infoBox}
            >
              <Box display="flex" alignItems="center">
                <Icon type="email" color={COLORS.PROFILE_PRIMARY} />
                <Typography
                  component="div"
                  color={COLORS.PROFILE_PRIMARY}
                  variant="h5"
                >
                  {user.email}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Icon type="account-circle" color={COLORS.PROFILE_PRIMARY} />
                <Typography
                  component="div"
                  variant="h5"
                  color={COLORS.PROFILE_PRIMARY}
                  marginTop="0px"
                >
                  {user.firstName + ' ' + user.lastName}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography
                  component="div"
                  color={COLORS.PROFILE_PRIMARY}
                  variant="h5"
                  sx={styles.numTypography}
                >
                  {userItems.length}
                </Typography>

                <Typography
                  component="div"
                  color={COLORS.PROFILE_PRIMARY}
                  variant="h5"
                >
                  Items taken
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <TabContext value={tabValue}>
        <Box sx={styles.tabsBox}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            <Tab
              label="Taken items"
              value={PROFILE_TAB_VALUES.takenProducts}
              sx={styles.tab}
            />
            <Tab
              label="Notifications"
              value={PROFILE_TAB_VALUES.notifications}
              sx={styles.tab}
            />
            <Tab
              label="Item Three"
              value={PROFILE_TAB_VALUES.other}
              sx={styles.tab}
            />
          </Tabs>
        </Box>

        <TabPanel value={PROFILE_TAB_VALUES.takenProducts} index={1}>
          <RegistryItemsMasonry
            onToggle={handleItemToggle}
            items={userItems}
            shouldLinkToRegistry
            onLinkClick={handleLinkClick}
            isLoading={isLoadingItems}
            emptyMessage="No taken items"
          />
        </TabPanel>
        <TabPanel value={PROFILE_TAB_VALUES.notifications} index={2}>
          NOTIFICATIONS
        </TabPanel>
        <TabPanel value={PROFILE_TAB_VALUES.other} index={3}>
          SOMETHING ELSE
        </TabPanel>
      </TabContext>
    </>
  )
}
