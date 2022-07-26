import React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'

import CakeIcon from '@mui/icons-material/Cake'
import SchoolIcon from '@mui/icons-material/School'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ParkIcon from '@mui/icons-material/Park'
import AnimationIcon from '@mui/icons-material/Animation'

const getIcon = type => {
  switch (type) {
    case 'Birthday':
      return <CakeIcon />

    case 'Wedding':
      return <FavoriteIcon />

    case 'Graduation/Prom':
      return <SchoolIcon />

    case 'Christmas':
      return <ParkIcon />

    default:
      return <AnimationIcon />
  }
}

function GiftListItem({ list, onClick }) {
  const secondary = list.type !== 'Other' ? list.type : 'Custom'

  return (
    <ListItemButton component="button" onClick={() => onClick(list)}>
      <ListItemText primary={list.name} secondary={secondary} />
      <ListItemIcon sx={{ minWidth: '0px' }}>{getIcon(list.type)}</ListItemIcon>
    </ListItemButton>
  )
}

export default GiftListItem
