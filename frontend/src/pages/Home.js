import React from 'react'
import { Box, Grid } from '@mui/material'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import CreateRegistry from '../components/CreateRegistry'
import RegistriesList from '../components/RegistriesList'
import Registry from '../components/Registry'
import { styles } from '../styles/HomeStyles'
import './Home.css'

function Home() {
  const isAuthenticated = useSelector(state => state.auth.user !== undefined)

  const [selectedListId, setSelectedListId] = useState()

  const onListClick = useCallback(
    list => setSelectedListId(list.id),
    [setSelectedListId]
  )

  return (
    <Box sx={styles.box}>
      <Grid container sx={styles.container}>
        <Grid item xs={3} sx={styles.gridItemXs3}>
          {isAuthenticated ? <CreateRegistry /> : null}
          <RegistriesList onListClick={onListClick} />
        </Grid>
        <Grid item xs={9} sx={styles.gridItemXs9}>
          <Registry listId={selectedListId} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default React.memo(Home)
