import { TabPanel, TabContext } from '@mui/lab'
import { Avatar, Typography, Grid, Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { styles } from './Profile.styles'
import { COLORS } from '../constants'

import Icon from '../components/Icon'

export default function Profile() {
  const user = useSelector(state => state.auth.user)

  const [tabValue, setTabValue] = useState('1')

  const handleTabChange = useCallback(
    (_e, newValue) => setTabValue(newValue),
    []
  )

  return (
    <>
      <Box
        mt="70px"
        justifyContent="center"
        backgroundColor={COLORS.LIGHTGRAY}
        borderRadius="15px"
        position="relative"
        sx={styles.profileBox}
      >
        <Box display="flex" justifyContent="center">
          <Avatar sx={styles.avatar}>
            {user.firstName.charAt(0) + user.lastName.charAt(0)}
          </Avatar>
        </Box>

        <Grid
          container
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          rowSpacing={{ xs: 3 }}
          sx={styles.gridContainer}
        >
          <Grid item xs={12} sx={styles.gridItem}>
            <Icon type="account-circle" color={COLORS.WHITE} />
            <Typography
              component="div"
              variant="h6"
              color={COLORS.WHITE}
              marginTop="0px"
            >
              {user.firstName + ' ' + user.lastName}
            </Typography>
          </Grid>

          <Grid item xs={12} sx={styles.gridItem}>
            <Icon type="email" color={COLORS.WHITE} />
            <Typography component="div" color={COLORS.WHITE} variant="h6">
              {user.email}
            </Typography>
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
            <Tab label="TAKEN PRODUCTS" value="1" sx={styles.tab}></Tab>
            <Tab label="NOTIFICATIONS" value="2" sx={styles.tab}></Tab>
            <Tab label="Item Three" value="3" sx={styles.tab}></Tab>
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
