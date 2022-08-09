import React, { useCallback, useMemo } from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import CakeIcon from '@mui/icons-material/Cake'
import SchoolIcon from '@mui/icons-material/School'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ParkIcon from '@mui/icons-material/Park'
import AnimationIcon from '@mui/icons-material/Animation'
import { ListItem } from '@mui/material'
import { getHexByColorName } from '../utils/colors'
import { styles } from './RegistriesListItem.styles'

const getIcon = (type, color) => {
  switch (type) {
    case 'Birthday':
      return <CakeIcon color={color} />

    case 'Wedding':
      return <FavoriteIcon color={color} />

    case 'Graduation/Prom':
      return <SchoolIcon color={color} />

    case 'Christmas':
      return <ParkIcon color={color} />

    default:
      return <AnimationIcon color={color} />
  }
}

function RegistriesListItem({ registry, onClick }) {
  const handleClick = useCallback(() => onClick(registry), [registry, onClick])

  const hexColor = useMemo(
    () => getHexByColorName(registry.color),
    [registry.color]
  )

  return (
    <ListItem component="div" disablePadding>
      <ListItemButton
        component="button"
        className="listItemButton"
        onClick={handleClick}
        sx={useMemo(() => styles(hexColor), [hexColor])}
      >
        <ListItemText primary={registry.name} secondary={registry.type} />
        {getIcon(registry.type, registry.color)}
      </ListItemButton>
    </ListItem>
  )
}

export default React.memo(RegistriesListItem)
