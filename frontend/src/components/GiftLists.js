import { Box, List, ListItem } from '@mui/material'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GiftListItem from './GiftListItem'
import { api } from '../utils/api'

const GiftLists = ({ onListClick }) => {
  const lists = useSelector(state => state.lists)
  const isAuthenticated = useSelector(state => state.auth.user !== undefined)

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

  const handeOnListClick = useCallback(list => onListClick(list), [onListClick])

  return (
    <Box sx={{ overflow: 'auto' }}>
      <List>
        {listsSortedByDate.map(list => (
          <ListItem key={list.id} component="div" disablePadding>
            <GiftListItem list={list} onClick={handeOnListClick} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default GiftLists
