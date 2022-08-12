import { List } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistriesListItem from './RegistriesListItem'
import { api } from '../utils/api'

const RegistriesList = ({ onSelectedChange }) => {
  const registries = useSelector(state => state.registries.data)
  const isAuthenticated = useSelector(state => state.auth.user !== undefined)

  const [selectedRegistryId, setSelectedRegistryId] = useState()

  const registriesSortedByDate = useMemo(
    () =>
      [...registries].sort(
        (registryOne, registryTwo) =>
          new Date(registryTwo.date) - new Date(registryOne.date)
      ),
    [registries]
  )

  const dispatch = useDispatch()

  const getRegistries = useCallback(async () => {
    if (!isAuthenticated) {
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
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    getRegistries()
  }, [getRegistries])

  const handleRegistryClick = useCallback(
    registry => {
      onSelectedChange(registry)
      setSelectedRegistryId(registry.id)
    },
    [onSelectedChange]
  )

  return (
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
  )
}

export default React.memo(RegistriesList)
