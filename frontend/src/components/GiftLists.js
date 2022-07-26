import { Box, ListItem } from '@mui/material'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GiftListItem from './GiftListItem'
import { api } from '../utils/api'

const GiftLists = () => {
  const lists = useSelector(state => state.lists)

  const listsSortedByDate = useMemo(
    () =>
      [...lists].sort(
        (objA, objB) => new Date(objB.date) - new Date(objA.date)
      ),
    [lists]
  )

  const dispatch = useDispatch()

  const getLists = useCallback(async () => {
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
  }, [dispatch])

  useEffect(() => {
    getLists()
  }, [getLists])

  const onListClick = useCallback(list => console.log(list.id), [])

  return (
    <Box sx={{ overflow: 'auto' }}>
      {listsSortedByDate.map(list => (
        <ListItem key={list.id} component="div" disablePadding>
          <GiftListItem list={list} onClick={onListClick} />
        </ListItem>
      ))}
    </Box>
  )
}

export default GiftLists
