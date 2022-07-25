import { Box, ListItem } from '@mui/material'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import GiftListItem from './GiftListItem'

const GiftLists = () => {
  const lists = useSelector(state => state.lists)

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
