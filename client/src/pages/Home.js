import { memo, useEffect, useMemo, useState } from 'react'
import { Box, Drawer, Grid, Toolbar, Typography } from '@mui/material'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistriesList from '../components/RegistriesList'
import Registry from '../components/Registry'
import { styles } from './Home.styles'
import './Home.css'
import { useNavigate, useParams } from 'react-router-dom'
import usePrevious from '../hooks/usePrevious'
import { hasUser } from '../redux/authSlice'
import { showModal } from '../redux/modalsSlice'
import {
  allRegistries,
  fetchRegistries,
  fetchSharedRegistry,
  isFetchingRegistries,
  isRegistryRemoved,
  areRegistriesSuccessfullyFetched as reduxAreRegistriesSuccessfullyFetched,
  resetRegistryRemoveStatus,
  shouldFetchRegistries as reduxShouldFetchRegistries
} from '../redux/registriesSlice'
import { Stack } from '@mui/system'
import Icon from '../components/Icon'
import Button from '../components/Button'
import { MODAL_NAMES } from '../constants/types'

function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()

  const isAuthenticated = useSelector(hasUser)
  const shouldClearSelectedRegistry = useSelector(isRegistryRemoved)

  const registries = useSelector(allRegistries)
  const isLoadingRegistries = useSelector(isFetchingRegistries)
  const shouldFetchRegistries =
    useSelector(reduxShouldFetchRegistries) && isAuthenticated

  const areRegistriesSuccessfullyFetched = useSelector(
    reduxAreRegistriesSuccessfullyFetched
  )

  // const areSuccessfullyFetched = useMemo(
  //   () => (isAuthenticated ? areRegistriesSuccessfullyFetched : true),
  //   [areRegistriesSuccessfullyFetched, isAuthenticated]
  // )

  const reduxHasRegistry = useMemo(
    () => registries.some(r => r.id === params.registryId),
    [params.registryId, registries]
  )

  const maybeFetchRegistryById = useCallback(() => {
    if (
      params.registryId &&
      areRegistriesSuccessfullyFetched &&
      !reduxHasRegistry
    ) {
      dispatch(fetchSharedRegistry(params.registryId))
    }
  }, [
    areRegistriesSuccessfullyFetched,
    dispatch,
    params.registryId,
    reduxHasRegistry
  ])

  useEffect(() => {
    maybeFetchRegistryById()
  }, [maybeFetchRegistryById])

  const [isRegistriesDrawerOpen, setIsRegistriesDrawerOpen] = useState(false)

  const prev = usePrevious({ isAuthenticated })

  const sortedRegistries = useMemo(
    () =>
      [...registries].sort(
        (registryOne, registryTwo) =>
          new Date(registryTwo.date) - new Date(registryOne.date)
      ),
    [registries]
  )

  const maybeFetchRegistries = useCallback(async () => {
    if (shouldFetchRegistries) {
      dispatch(fetchRegistries())
    }
  }, [dispatch, shouldFetchRegistries])

  useEffect(() => {
    maybeFetchRegistries()
  }, [maybeFetchRegistries])

  useEffect(() => {
    if (prev?.isAuthenticated && !isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, prev?.isAuthenticated, navigate])

  useEffect(() => {
    if (!params?.registryId) {
      setTimeout(() => setIsRegistriesDrawerOpen(true), 300)
    }
  }, [params?.registryId])

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
    registryId => {
      setIsRegistriesDrawerOpen(false)
      navigate('/registry/' + registryId)
    },
    [navigate]
  )

  const handleOpenRegistriesDrawerButtonClick = useCallback(
    () => setIsRegistriesDrawerOpen(true),
    []
  )

  const handleRegistriesDrawerClose = useCallback(
    () => setIsRegistriesDrawerOpen(false),
    []
  )

  const renderRegistriesList = useCallback(
    isCreateRegistryButtonVisible => (
      <RegistriesList
        data={sortedRegistries}
        isLoading={isLoadingRegistries}
        selectedRegistryId={params?.registryId}
        isCreateRegistryButtonVisible={isCreateRegistryButtonVisible}
        onSelectedChange={handleSelectedRegistryChange}
        onCreateRegistryButtonClick={handleCreateRegistryButtonClick}
      />
    ),
    [
      handleCreateRegistryButtonClick,
      handleSelectedRegistryChange,
      isLoadingRegistries,
      params?.registryId,
      sortedRegistries
    ]
  )

  return (
    <>
      <Drawer
        anchor="left"
        open={isRegistriesDrawerOpen}
        onClose={handleRegistriesDrawerClose}
        sx={styles.registriesDrawer}
      >
        <Toolbar sx={styles.toolbar} />
        {renderRegistriesList(isAuthenticated)}
      </Drawer>

      <Box sx={styles.box}>
        <Box sx={styles.registriesDrawerToggleButtonContainer}>
          <Button
            color="black"
            icon-mode="start"
            icon="list"
            sx={styles.registriesDrawerToggleButton}
            onClick={handleOpenRegistriesDrawerButtonClick}
          >
            Registries
          </Button>
        </Box>

        <Grid container sx={styles.gridContainer} columnSpacing={2}>
          <Grid item xs={3} sx={styles.gridItemLeft}>
            {renderRegistriesList(isAuthenticated)}
          </Grid>
          <Grid item xs={12} sm={9} sx={styles.gridItemRight}>
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
    </>
  )
}

export default memo(Home)
