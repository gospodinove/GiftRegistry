import React, { useCallback } from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
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

function RegistriesListItem({ registry, isSelected, onClick }) {
  const handleClick = useCallback(() => {
    onClick(registry)
  }, [registry, onClick])

  return (
    <ListItem component="div" disablePadding>
      <ListItemButton
        component="button"
        selected={isSelected}
        onClick={handleClick}
      >
        <ListItemText primary={registry.name} secondary={registry.type} />
        {getIcon(registry.type)}
      </ListItemButton>
    </ListItem>
  )
}

export default React.memo(RegistriesListItem)
