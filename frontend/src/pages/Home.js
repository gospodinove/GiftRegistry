import React from 'react'
import { Box, Grid } from '@mui/material'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import CreateRegistry from '../components/CreateRegistry'
import RegistriesList from '../components/RegistriesList'
import Registry from '../components/Registry'
import { navbarHeight } from '../constants'
import './Home.css'

function Home() {
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
      <Grid
        container
        sx={{
          height: '100%',
          pt: 3
        }}
      >
        <Grid
          item
          xs={3}
          sx={{
            height: '100%',
            overflow: 'auto'
          }}
        >
          {isAuthenticated ? <CreateRegistry /> : null}
          <RegistriesList onListClick={onListClick} />
        </Grid>
        <Grid
          item
          xs={9}
          sx={{
            height: '100%',
            overflow: 'auto'
          }}
        >
          <Registry listId={selectedListId} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default React.memo(Home)
