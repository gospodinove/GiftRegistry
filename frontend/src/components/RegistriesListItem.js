import React, { useCallback } from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import CakeIcon from '@mui/icons-material/Cake'
import SchoolIcon from '@mui/icons-material/School'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ParkIcon from '@mui/icons-material/Park'
import AnimationIcon from '@mui/icons-material/Animation'
import { ListItem } from '@mui/material'
// import { styles } from '../styles/RegistriesListItemStyles'

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

function RegistriesListItem({ list, isSelected, onClick }) {
  const handleClick = useCallback(() => {
    onClick(list)
  }, [list, onClick])

  return (
    <ListItem component="div" disablePadding>
      <ListItemButton
        component="button"
        selected={isSelected}
        onClick={handleClick}
      >
        <ListItemText primary={list.name} secondary={list.type} />
        <ListItemIcon>{getIcon(list.type)}</ListItemIcon>
      </ListItemButton>
    </ListItem>
  )
}

export default React.memo(RegistriesListItem)
