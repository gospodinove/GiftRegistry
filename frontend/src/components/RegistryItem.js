import { Checkbox, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import React, { useCallback, useState } from 'react'

// TODO: display the article link
const RegistryItem = ({ data, onToggle, color }) => {
  const [isChecked, setIsChecked] = useState(data.takenBy !== null)

  const handleClick = useCallback(() => {
    onToggle(data.id)
    setIsChecked(!isChecked)
  }, [setIsChecked, onToggle, data.id, isChecked])

  return (
    <ListItem>
      <ListItemIcon>
        <Checkbox
          checked={isChecked}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': data.id }}
          onClick={handleClick}
          color={color}
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

export default React.memo(RegistryItem)
