import { memo, useCallback, useMemo } from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { ListItem } from '@mui/material'
import { styles } from './RegistriesListItem.styles'
import Icon from './Icon'
import { COLORS } from '..//constants'

const getIconType = registryType => {
  switch (registryType) {
    case 'Birthday':
      return 'cake'
    case 'Wedding':
      return 'favorite'
    case 'Graduation/Prom':
      return 'school'
    case 'Christmas':
      return 'park'
    case 'Custom':
    default:
      return 'animation'
  }
}

function RegistriesListItem({ registry, isSelected, onClick }) {
  const handleClick = useCallback(() => onClick(registry), [registry, onClick])

  const componentStyles = useMemo(
    () => styles(registry.color ?? COLORS.BLACK, isSelected),
    [registry.color, isSelected]
  )

  return (
    <ListItem component="div" disablePadding>
      <ListItemButton
        component="button"
        className="listItemButton"
        sx={componentStyles.registryItemStyles}
        onClick={handleClick}
      >
        <ListItemText primary={registry.name} secondary={registry.type} />

        <Icon type={getIconType(registry.type)} color={registry.color} />
      </ListItemButton>
    </ListItem>
  )
}

export default memo(RegistriesListItem)
