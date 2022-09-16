import { List } from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistriesListItem from './RegistriesListItem'
import RegistriesListItemSkeleton from './RegistriesListItemSkeleton'
import Empty from './Empty'
import { fetchRegistries } from '../redux/registriesSlice'
import { DATA_STATUS } from '../constants'

const RegistriesList = ({ onSelectedChange }) => {
  const registries = useSelector(state => state.registries.data)

  const [selectedRegistryId, setSelectedRegistryId] = useState()

  const isLoading = useSelector(
    state => state.registries.fetchStatus === DATA_STATUS.loading
  )

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
    dispatch(fetchRegistries())
  }, [dispatch])

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
