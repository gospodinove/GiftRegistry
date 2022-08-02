import React from 'react'
import { Box, Button, Grid, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistriesList from '../components/RegistriesList'
import Registry from '../components/Registry'
import { styles } from './Home.styles'
import AddIcon from '@mui/icons-material/Add'
import './Home.css'

function Home() {
  const dispatch = useDispatch()

  const isAuthenticated = useSelector(state => state.auth.user !== undefined)

  const [selectedListId, setSelectedListId] = useState()

  const handleCreateRegistryButtonClick = useCallback(
    () =>
      dispatch({ type: 'modals/show', payload: { name: 'createRegistry' } }),
    [dispatch]
  )

  const onListClick = useCallback(
    list => setSelectedListId(list.id),
    [setSelectedListId]
  )

  return (
    <Box sx={styles.box}>
      <Grid container sx={styles.gridContainer} spacing={2}>
        <Grid item xs={3} sx={styles.gridItem}>
          {isAuthenticated ? (
            <Button
              sx={styles.button}
              variant="outlined"
              fullWidth
              onClick={handleCreateRegistryButtonClick}
              startIcon={<AddIcon />}
            >
              Create new list
            </Button>
          ) : null}
          <RegistriesList onListClick={onListClick} />
        </Grid>
        <Grid item xs={9} sx={styles.gridItem}>
          {selectedListId ? (
            <Registry listId={selectedListId} />
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Typography variant="h5">No registry selected</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default React.memo(Home)
