import { Box, List, Skeleton, Stack } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistriesListItem from './RegistriesListItem'
import { api } from '../utils/api'
import { styles } from './RegistriesList.styles'

const Loader = () => (
  <>
    <Stack direction="row" spacing={5} pt="8px" pb="8px" pl="16px" pr="16px">
      <Stack spacing={1} width="80%">
        <Skeleton height={15} />
        <Skeleton width="40%" height={15} />
      </Stack>

      <Box width="20%" sx={styles.skeletonCircleContainer}>
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
    </Stack>

    <Stack direction="row" spacing={5} pt="8px" pb="8px" pl="16px" pr="16px">
      <Stack spacing={1} width="80%">
        <Skeleton height={15} />
        <Skeleton width="40%" height={15} />
      </Stack>

      <Box width="20%" sx={styles.skeletonCircleContainer}>
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
    </Stack>
  </>
)

const RegistriesList = ({ onSelectedChange }) => {
  const registries = useSelector(state => state.registries.data)
  const isAuthenticated = useSelector(state => state.auth.user !== undefined)

  const [selectedRegistryId, setSelectedRegistryId] = useState()

  const [isLoading, setIsLoading] = useState(true)

  const registriesSortedByDate = useMemo(
    () =>
      [...registries].sort(
        (registryOne, registryTwo) =>
          new Date(registryTwo.date) - new Date(registryOne.date)
      ),
    [registries]
  )

  const dispatch = useDispatch()

  const maybeFetchRegistries = useCallback(async () => {
    if (!isAuthenticated || registries.length > 0) {
      return
    }

    try {
      const response = await api('registries')

      dispatch({ type: 'registries/add', payload: response.registries })
    } catch (error) {
      dispatch({
        type: 'toast/show',
        payload: { type: 'error', message: error.data }
      })
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, isAuthenticated, registries.length])

  useEffect(() => {
    maybeFetchRegistries()
  }, [maybeFetchRegistries])

  const handleRegistryClick = useCallback(
    registry => {
      setSelectedRegistryId(registry.id)
      onSelectedChange(registry)
    },
    [onSelectedChange, setSelectedRegistryId]
  )

  return (
    <List>
      {isLoading ? (
        <Loader />
      ) : (
        registriesSortedByDate.map(registry => (
          <RegistriesListItem
            key={registry.id}
            registry={registry}
            isSelected={selectedRegistryId === registry.id}
            onClick={handleRegistryClick}
          />
        ))
      )}
    </List>
  )
}

export default React.memo(RegistriesList)
