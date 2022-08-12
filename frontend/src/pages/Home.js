import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistriesList from '../components/RegistriesList'
import Registry from '../components/Registry'
import { styles } from './Home.styles'
import Icon from '../components/Icon'
import './Home.css'
import Button from '../components/Button'

function Home() {
  const dispatch = useDispatch()

  const isAuthenticated = useSelector(state => state.auth.user !== undefined)

  const [selectedRegistryId, setSelectedRegistryId] = useState()

  const handleCreateRegistryButtonClick = useCallback(
    () =>
      dispatch({ type: 'modals/show', payload: { name: 'createRegistry' } }),
    [dispatch]
  )

  const onSelectedChange = useCallback(
    registry => setSelectedRegistryId(registry.id),
    [setSelectedRegistryId]
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
              startIcon={<Icon type="add" />}
            >
              Create new registry
            </Button>
          ) : null}
          <RegistriesList onSelectedChange={onSelectedChange} />
        </Grid>
        <Grid item xs={9} sx={styles.gridItem}>
          {selectedRegistryId ? (
            <Registry registryId={selectedRegistryId} />
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
