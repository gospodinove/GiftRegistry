import { List } from '@mui/material'
import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistriesListItem from './RegistriesListItem'
import RegistriesListItemSkeleton from './RegistriesListItemSkeleton'
import Empty from './Empty'
import {
  areRegistriesFetched,
  fetchRegistries,
  isFetchingRegistry,
  registriesSortedByDate
} from '../redux/registriesSlice'

const RegistriesList = ({ onSelectedChange }) => {
  const dispatch = useDispatch()

  const registries = useSelector(registriesSortedByDate)
  const isLoading = useSelector(isFetchingRegistry)
  const isDataFetched = useSelector(areRegistriesFetched)

  const [selectedRegistryId, setSelectedRegistryId] = useState()

  const maybeFetchRegistries = useCallback(async () => {
    if (!isDataFetched) {
      dispatch(fetchRegistries())
    }
  }, [dispatch, isDataFetched])

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

  return registries.length > 0 ? (
    <List>
      {registries.map(registry => (
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
