import { Box, List } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistriesListItem from './RegistriesListItem'
import { api } from '../utils/api'

const RegistriesList = ({ onListClick }) => {
  const lists = useSelector(state => state.lists)
  const isAuthenticated = useSelector(state => state.auth.user !== undefined)

  const [selectedListId, setSelectedListId] = useState()

  const listsSortedByDate = useMemo(
    () =>
      [...lists].sort(
        (listOne, listTwo) => new Date(listTwo.date) - new Date(listOne.date)
      ),
    [lists]
  )

  const dispatch = useDispatch()

  const getLists = useCallback(async () => {
    if (!isAuthenticated) {
      return
    }

    try {
      const response = await api('lists')

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

      dispatch({ type: 'lists/add', payload: response.lists })
    } catch {
      dispatch({
        type: 'toast/show',
        payload: { type: 'error', message: 'No lists from this user' }
      })
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    getLists()
  }, [getLists])

  const handleListClick = useCallback(
    list => {
      setSelectedListId(list.id)
      onListClick(list)
    },
    [onListClick, setSelectedListId]
  )

  return (
    <Box sx={{ overflow: 'auto' }}>
      <List>
        {listsSortedByDate.map(list => (
          <RegistriesListItem
            key={list.id}
            list={list}
            isSelected={selectedListId === list.id}
            onClick={handleListClick}
          />
        ))}
      </List>
    </Box>
  )
}

export default RegistriesList
