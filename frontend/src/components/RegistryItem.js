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
  disabled,
  isEditEnabled,
  onEditClick
}) => {
  const [isEditButtonVisible, setIsEditButtonVisible] = useState(false)

  const handleClick = useCallback(() => {
    onToggle(data.id)
  }, [onToggle, data.id])

  const inputProps = useMemo(() => ({ 'aria-labelledby': data.id }), [data.id])

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
          checked={data.takenBy !== null}
          tabIndex={-1}
          disableRipple
          inputProps={inputProps}
          color={color}
          disabled={disabled}
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
