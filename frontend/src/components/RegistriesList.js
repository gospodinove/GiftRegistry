import { List } from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistriesListItem from './RegistriesListItem'
import { api } from '../utils/api'
import RegistriesListItemSkeleton from './RegistriesListItemSkeleton'
import Empty from './Empty'
import { addRegistryData } from '../redux/registriesSlice'
import { showToast } from '../redux/toastSlice'

const RegistriesList = ({ onSelectedChange }) => {
  const registries = useSelector(state => state.registries.data)

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
    setIsLoading(true)

    try {
      if (registries.length > 0) {
        return
      }

      const response = await api('registries')

      dispatch(addRegistryData(response.registries))
    } catch (error) {
      dispatch(showToast({ type: 'error', message: error.data }))
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, registries.length])

  useEffect(() => {
    maybeFetchRegistries()
  }, [maybeFetchRegistries])

  const handleRegistryClick = useCallback(
    registry => {
      onSelectedChange(registry)
      setSelectedRegistryId(registry.id)
    },
    [onSelectedChange]
  )

  if (isLoading) {
    return (
      <>
        <RegistriesListItemSkeleton />
        <RegistriesListItemSkeleton />
      </>
    )
  }

  return registriesSortedByDate.length > 0 ? (
    <List>
      {registriesSortedByDate.map(registry => (
        <RegistriesListItem
          key={registry.id}
          registry={registry}
          isSelected={selectedRegistryId === registry.id}
          onClick={handleRegistryClick}
        />
      ))}
    </List>
  ) : (
    <Empty text="No registries" />
  )
}

export default memo(RegistriesList)
