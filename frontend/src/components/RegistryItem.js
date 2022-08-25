import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { memo, useCallback, useMemo } from 'react'
import Checkbox from './Checkbox'

// TODO: display the article link
const RegistryItem = ({ data, color, disabled, onToggle }) => {
  const handleClick = useCallback(() => {
    onToggle(data.id)
  }, [onToggle, data.id])

  const inputProps = useMemo(() => ({ 'aria-labelledby': data.id }), [data.id])

  return (
    <ListItem>
      <ListItemIcon>
        <Checkbox
          checked={data.takenBy !== null}
          tabIndex={-1}
          disableRipple
          inputProps={inputProps}
          onClick={handleClick}
          color={color}
          disabled={disabled}
        />
      </ListItemIcon>
      <ListItemText
        id={data.id}
        primary={data.name}
        secondary={data.description}
      />
    </ListItem>
  )
}

export default memo(RegistryItem)
