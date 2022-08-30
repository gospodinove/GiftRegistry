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
import { api } from '../utils/api'
import RegistriesListItemSkeleton from './RegistriesListItemSkeleton'
import Empty from './Empty'
import { styles } from './RegistriesList.styles'
import Icon from './Icon'

const RegistriesList = ({ onSelectedChange, onNewRegistryButtonClick }) => {
  const registries = useSelector(state => state.registries.data)

  const [selectedRegistryId, setSelectedRegistryId] = useState()

  const [isLoading, setIsLoading] = useState(true)

  const newRegistryButton = useMemo(
    () => (
      <ListItem component="div" disablePadding>
        <ListItemButton
          component="button"
          className="listItemButton"
          onClick={onNewRegistryButtonClick}
        >
          <ListItemText primary="Create new registry" />

          <Icon type="add" />
        </ListItemButton>
      </ListItem>
    ),
    [onNewRegistryButtonClick]
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
    setIsLoading(true)

    try {
      if (registries.length > 0) {
        return
      }

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
    <List subheader={<div />}>
      <ListSubheader disableGutters sx={styles.subheader}>
        {newRegistryButton}
      </ListSubheader>
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
