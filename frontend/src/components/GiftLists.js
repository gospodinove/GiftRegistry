import { Box, ListItem } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GiftListItem from './GiftListItem'
import { api } from '../utils/api'

const GiftLists = () => {
  const lists = useSelector(state => state.lists)

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
    <Box sx={{ maxHeight: '80vh', overflow: 'auto' }}>
      {lists.map(list => (
        <ListItem key={list.id} component="div" disablePadding>
          <GiftListItem list={list} action={onListClick} />
        </ListItem>
      ))}
    </Box>
  )
}

export default GiftLists
