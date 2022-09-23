import { memo, useEffect } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistriesList from '../components/RegistriesList'
import Registry from '../components/Registry'
import { styles } from './Home.styles'
import './Home.css'
import { useParams } from 'react-router-dom'
import usePrevious from '../hooks/usePrevious'
import { hasUser, loginViaToken } from '../redux/authSlice'
import { MODAL_NAMES, showModal } from '../redux/modalsSlice'
import {
  isRegistryRemoved,
  resetRegistryRemoveStatus
} from '../redux/registriesSlice'

function Home() {
  const dispatch = useDispatch()
  const params = useParams()

  const isAuthenticated = useSelector(hasUser)
  const shouldClearSelectedRegistryId = useSelector(isRegistryRemoved)

  const [selectedRegistryId, setSelectedRegistryId] = useState()

  const prev = usePrevious({ isAuthenticated })

  useEffect(() => {
    if (params?.token && !isAuthenticated) {
      dispatch(loginViaToken(params.token))
    }
  }, [params, isAuthenticated, dispatch])

  useEffect(() => {
    if (prev?.isAuthenticated && !isAuthenticated) {
      setSelectedRegistryId(null)
    }
  }, [isAuthenticated, prev?.isAuthenticated])

  useEffect(() => {
    if (shouldClearSelectedRegistryId) {
      setSelectedRegistryId(null)
      dispatch(resetRegistryRemoveStatus())
    }
  }, [shouldClearSelectedRegistryId, dispatch])

  const handleCreateRegistryButtonClick = useCallback(
    () => dispatch(showModal({ name: MODAL_NAMES.populateRegistry })),
    [dispatch]
  )

  const onSelectedChange = useCallback(
    registry => setSelectedRegistryId(registry.id),
    [setSelectedRegistryId]
  )

  return (
    <Box sx={styles.box}>
      <Grid container sx={styles.gridContainer} columnSpacing={2}>
        <Grid item xs={3} sx={styles.gridItem}>
          {isAuthenticated && (
            <RegistriesList
              onSelectedChange={onSelectedChange}
              onCreateRegistryButtonClick={handleCreateRegistryButtonClick}
            />
          )}
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

export default memo(Home)
