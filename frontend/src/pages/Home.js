import { memo, useEffect } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistriesList from '../components/RegistriesList'
import Registry from '../components/Registry'
import { styles } from './Home.styles'
import './Home.css'
import { useNavigate, useParams } from 'react-router-dom'
import usePrevious from '../hooks/usePrevious'
import { hasUser, loginViaToken } from '../redux/authSlice'
import { MODAL_NAMES, showModal } from '../redux/modalsSlice'
import {
  isRegistryRemoved,
  resetRegistryRemoveStatus
} from '../redux/registriesSlice'
import { Stack } from '@mui/system'
import Icon from '../components/Icon'

function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()

  const isAuthenticated = useSelector(hasUser)
  const shouldClearSelectedRegistry = useSelector(isRegistryRemoved)

  const prev = usePrevious({ isAuthenticated })

  useEffect(() => {
    if (params?.token && !isAuthenticated) {
      dispatch(loginViaToken(params.token))
    }
  }, [params, isAuthenticated, dispatch])

  useEffect(() => {
    if (prev?.isAuthenticated && !isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, prev?.isAuthenticated, navigate])

  useEffect(() => {
    if (shouldClearSelectedRegistry) {
      navigate('/')
      dispatch(resetRegistryRemoveStatus())
    }
  }, [shouldClearSelectedRegistry, dispatch, navigate])

  const handleCreateRegistryButtonClick = useCallback(
    () => dispatch(showModal({ name: MODAL_NAMES.populateRegistry })),
    [dispatch]
  )

  const handleSelectedRegistryChange = useCallback(
    registryId => navigate('/registry/' + registryId),
    [navigate]
  )

  return (
    <Box sx={styles.box}>
      <Grid container sx={styles.gridContainer} columnSpacing={2}>
        <Grid item xs={3} sx={styles.gridItem}>
          {isAuthenticated && (
            <RegistriesList
              onSelectedChange={handleSelectedRegistryChange}
              onCreateRegistryButtonClick={handleCreateRegistryButtonClick}
            />
          )}
        </Grid>
        <Grid item xs={9} sx={styles.gridItem}>
          {params.registryId ? (
            <Registry registryId={params.registryId} />
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Stack alignItems="center" spacing={1}>
                <Icon type="highlight-alt" size={80} />
                <Typography variant="h5">No registry selected</Typography>
              </Stack>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default memo(Home)
