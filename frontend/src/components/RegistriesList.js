import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader
} from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistriesListItem from './RegistriesListItem'
import RegistriesListItemSkeleton from './RegistriesListItemSkeleton'
import Empty from './Empty'
import { styles } from './RegistriesList.styles'
import Icon from './Icon'
import {
  areRegistriesFetched,
  fetchRegistries,
  isFetchingRegistry,
  allRegistries
} from '../redux/registriesSlice'

// TODO: take registries as prop
const RegistriesList = ({ onSelectedChange, onCreateRegistryButtonClick }) => {
  const dispatch = useDispatch()

  const registries = useSelector(allRegistries)
  const isLoading = useSelector(isFetchingRegistry)
  const isDataFetched = useSelector(areRegistriesFetched)

  const [selectedRegistryId, setSelectedRegistryId] = useState()

  const sortedRegistries = useMemo(
    () =>
      [...registries].sort(
        (registryOne, registryTwo) =>
          new Date(registryTwo.date) - new Date(registryOne.date)
      ),
    [registries]
  )

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
      onSelectedChange(registry.id)
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

  return (
    <>
      <List subheader={<div />}>
        <ListSubheader disableGutters sx={styles.subheader}>
          <ListItem component="div" disablePadding>
            <ListItemButton
              component="button"
              className="listItemButton"
              onClick={onCreateRegistryButtonClick}
            >
              <ListItemText primary="Create new registry" />

              <Icon type="add" />
            </ListItemButton>
          </ListItem>
        </ListSubheader>
        {sortedRegistries.map(registry => (
          <RegistriesListItem
            key={registry.id}
            registry={registry}
            isSelected={selectedRegistryId === registry.id}
            onClick={handleRegistryClick}
          />
        ))}
      </List>
      {registries.length === 0 && <Empty text="No registries" />}
    </>
  )
}

export default memo(RegistriesList)
