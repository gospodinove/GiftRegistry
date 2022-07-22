import React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'

import CakeIcon from '@mui/icons-material/Cake'
import SchoolIcon from '@mui/icons-material/School'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ParkIcon from '@mui/icons-material/Park'
import AnimationIcon from '@mui/icons-material/Animation'

function GiftListItem({ list, action }) {
  const getIcon = () => {
    switch (list.type) {
      case 'Birthday':
        return <CakeIcon />

      case 'Wedding':
        return <FavoriteIcon />

      case 'Graduation/Prom':
        return <SchoolIcon />

      case 'Christmas':
        return <ParkIcon />

      case 'Other':
        return <AnimationIcon />

      default:
        break
    }
  }

  const secondary = list.type !== 'Other' ? list.type : 'Custom'

  return (
    <ListItemButton component="button" onClick={() => action(list)}>
      <ListItemText primary={list.name} secondary={secondary} />
      <ListItemIcon>{getIcon()}</ListItemIcon>
    </ListItemButton>
  )
}

export default GiftListItem
