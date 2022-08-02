import { Checkbox, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import React, { useCallback, useState } from 'react'

// TODO: display the article link
const RegistryItem = ({ data, onToggle }) => {
  const [isChecked, setIsChecked] = useState(data.taken)

  const handleClick = useCallback(() => {
    onToggle(data.id)
    setIsChecked(!isChecked)
  }, [setIsChecked, onToggle, data.id, isChecked])

  return (
    <ListItem>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={isChecked}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': data.id }}
          onClick={handleClick}
        />
      </ListItemIcon>
      <ListItemText
        id={data.id}
        primary={data.title}
        secondary={data.description}
      />
    </ListItem>
  )
}

export default React.memo(RegistryItem)
