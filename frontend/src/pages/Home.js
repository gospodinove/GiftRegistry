import { Box, Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import CreateList from '../components/CreateList'
import GiftLists from '../components/GiftLists'

export default function Home() {
  const isAuthenticated = useSelector(state => state.auth.user !== undefined)

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container>
        <Grid item xs={3}>
          {isAuthenticated ? <CreateList /> : null}
          <GiftLists />
        </Grid>
        <Grid item xs={9} sx={{ backgroundColor: 'blue' }}></Grid>
      </Grid>
    </Box>
  )
}
