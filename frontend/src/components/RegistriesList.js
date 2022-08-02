import { List } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistriesListItem from './RegistriesListItem'
import { api } from '../utils/api'

const RegistriesList = ({ onRegistryClick }) => {
  const registries = useSelector(state => state.registries)
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

      if (!response.success) {
        switch (response.errorType) {
          case 'general':
            dispatch({
              type: 'toast/show',
              payload: { type: 'error', message: response.errors }
            })
            return
          default:
            return
        }
      }

      dispatch({ type: 'registries/add', payload: response.registries })
    } catch {
      dispatch({
        type: 'toast/show',
        payload: { type: 'error', message: 'No registries from this user' }
      })
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    getRegistries()
  }, [getRegistries])

  const handleRegistryClick = useCallback(
    registry => {
      setSelectedRegistryId(registry.id)
      onRegistryClick(registry)
    },
    [onRegistryClick, setSelectedRegistryId]
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
