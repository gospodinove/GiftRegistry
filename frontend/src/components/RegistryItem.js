import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { memo, useCallback, useState } from 'react'
import Button from './Button'
import Checkbox from './Checkbox'
import { styles } from './RegistryItem.styles'

// TODO: display the article link
const RegistryItem = ({ data, onToggle, color, onEditClick, isOwner }) => {
  const [isChecked, setIsChecked] = useState(data.takenBy !== null)
  const [isEditButtonVisible, setIsEditButtonVisible] = useState(false)

  const handleClick = useCallback(() => {
    onToggle(data.id)
    setIsChecked(!isChecked)
  }, [setIsChecked, onToggle, data.id, isChecked])

  const handleEnterHover = useCallback(() => {
    if (isOwner) {
      setIsEditButtonVisible(true)
    }
  }, [isOwner])

  const handleLeaveHover = useCallback(() => {
    setIsEditButtonVisible(false)
  }, [])

  const handleEditClick = useCallback(() => {
    onEditClick(data.id)
  }, [onEditClick, data.id])

  return (
    <ListItem onMouseEnter={handleEnterHover} onMouseLeave={handleLeaveHover}>
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

      {isEditButtonVisible ? (
        <Button
          icon-mode="icon-only"
          icon="edit"
          color={color}
          onClick={handleEditClick}
        ></Button>
      ) : (
        <Button
          icon-mode="icon-only"
          icon="edit"
          color={color}
          sx={styles.buttonSm}
          onClick={handleEditClick}
        ></Button>
      )}
    </ListItem>
  )
}

export default memo(RegistryItem)
