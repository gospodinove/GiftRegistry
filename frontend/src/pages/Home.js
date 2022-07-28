import { Box, Grid } from '@mui/material'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import CreateList from '../components/CreateList'
import GiftListItems from '../components/GiftListItems'
import GiftLists from '../components/GiftLists'
import { navbarHeight } from '../constants'
import './Home.css'

export default function Home() {
  const isAuthenticated = useSelector(state => state.auth.user !== undefined)

  const [selectedListId, setSelectedListId] = useState()

  const onListClick = useCallback(
    list => setSelectedListId(list.id),
    [setSelectedListId]
  )

  return (
    <Box
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        height: '100%',
        mt: `-${navbarHeight}px`,
        pt: navbarHeight + 'px'
      }}
    >
      <Grid container sx={{ height: '100%', mt: 3 }}>
        <Grid item xs={3}>
          {isAuthenticated ? <CreateList /> : null}
          <GiftLists onListClick={onListClick} />
        </Grid>
        <Grid item xs={9}>
          <GiftListItems listId={selectedListId} />
        </Grid>
      </Grid>
    </Box>
  )
}
