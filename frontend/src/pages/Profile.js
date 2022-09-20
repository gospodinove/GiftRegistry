import { TabPanel, TabContext } from '@mui/lab'
import { Avatar, Typography, Grid, Tab, Tabs, Badge } from '@mui/material'
import { Box } from '@mui/system'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { styles } from './Profile.styles'
import { COLORS } from '../constants'

import Icon from '../components/Icon'
import { api } from '../utils/api'

export default function Profile() {
  const dispatch = useDispatch()

  const userItems = useSelector(state => state.registryItems.userItems)
  // console.log(userItems.items.length)

  const user = useSelector(state => state.auth.user)

  const [tabValue, setTabValue] = useState('1')

  const handleTabChange = useCallback(
    (_e, newValue) => setTabValue(newValue),
    []
  )

  const fetchTakenRegistryItems = useCallback(async () => {
    const response = await api('registryItems/withTaker/' + user.id)
    dispatch({ type: 'registryItems/setUserItems', payload: response })
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
                {user.firstName.charAt(0) + user.lastName.charAt(0)}
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
                  {userItems?.items?.length}
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
            <Box flex="1"></Box>
            <Tab label="TAKEN PRODUCTS" value="1" sx={styles.tab}></Tab>
            <Tab label="NOTIFICATIONS" value="2" sx={styles.tab}></Tab>
            <Tab label="Item Three" value="3" sx={styles.tab}></Tab>
            <Box flex="1"></Box>
          </Tabs>
        </Box>

        <TabPanel value="1" index={1}>
          TAKEN PRODUCTS
        </TabPanel>
        <TabPanel value="2" index={2}>
          NOTIFICATIONS
        </TabPanel>
        <TabPanel value="3" index={3}>
          SOMETHING ELSE
        </TabPanel>
      </TabContext>
    </>
  )
}
