import React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import CakeIcon from '@mui/icons-material/Cake'
import SchoolIcon from '@mui/icons-material/School'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ParkIcon from '@mui/icons-material/Park'
import AnimationIcon from '@mui/icons-material/Animation'
import { ListItem } from '@mui/material'

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

function GiftListItem({ list, isSelected, onClick }) {
  const secondary = list.type !== 'Other' ? list.type : 'Custom'

  return (
    <ListItem component="div" disablePadding>
      <ListItemButton
        component="button"
        selected={isSelected}
        onClick={() => onClick(list)}
      >
        <ListItemText primary={list.name} secondary={secondary} />
        <ListItemIcon sx={{ minWidth: '0px' }}>
          {getIcon(list.type)}
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  )
}

export default GiftListItem
