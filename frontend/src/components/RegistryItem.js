import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { memo, useCallback, useState, useMemo } from 'react'
import Button from './Button'
import Checkbox from './Checkbox'
import { styles } from './RegistryItem.styles'

// TODO: display the article link
const RegistryItem = ({
  data,
  onToggle,
  color,
  isEditEnabled,
  onEditClick
}) => {
  const [isChecked, setIsChecked] = useState(data.takenBy !== null)
  const [isEditButtonVisible, setIsEditButtonVisible] = useState(false)

  const handleClick = useCallback(() => {
    onToggle(data.id)
    setIsChecked(!isChecked)
  }, [setIsChecked, onToggle, data.id, isChecked])

  const handleEnterHover = useCallback(() => {
    if (!isEditEnabled) {
      return
    }

    setIsEditButtonVisible(true)
  }, [isEditEnabled])

  const handleLeaveHover = useCallback(() => {
    if (!isEditEnabled) {
      return
    }

    setIsEditButtonVisible(false)
  }, [isEditEnabled])

  const handleEditClick = useCallback(() => {
    onEditClick(data.id)
  }, [onEditClick, data.id])

  const secondaryAction = useMemo(
    () => (
      <>
        {isEditButtonVisible ? (
          <Button
            icon-mode="icon-only"
            icon="edit"
            color={color}
            sx={styles.editButton}
            onClick={handleEditClick}
          />
        ) : null}

        <Button
          icon-mode="icon-only"
          icon="edit"
          color={color}
          sx={styles.editButtonXs}
          onClick={handleEditClick}
        />
      </>
    ),
    [color, handleEditClick, isEditButtonVisible]
  )

  return (
    <ListItem
      onMouseEnter={handleEnterHover}
      onMouseLeave={handleLeaveHover}
      secondaryAction={secondaryAction}
    >
      <ListItemIcon>
        <Checkbox
          checked={isChecked}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': data.id }}
          color={color}
          onClick={handleClick}
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
