import { Box, Menu, MenuItem, Skeleton, Stack, Typography } from '@mui/material'
import { memo, useCallback, useState } from 'react'
import { COLORS } from '../constants/colors'
import Button from './Button'
import { styles } from './RegistryDetails.styles'
import Icon from './Icon'

const RegistryDetails = ({
  shouldShowActionButtons,
  name,
  color,
  shouldShowOwner,
  owner,
  isLoadingOwner,
  onEditClick,
  onRemoveClick,
  onAddClick,
  onShareViaEmailClick,
  onShareViaLinkClick
}) => {
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false)
  const [shareDropdownAnchorElement, setShareDropdownAnchorElement] =
    useState(null)

  const handleEditClick = useCallback(() => onEditClick(), [onEditClick])

  const handleRemoveClick = useCallback(() => onRemoveClick(), [onRemoveClick])

  const handleAddClick = useCallback(() => onAddClick(), [onAddClick])

  const handleShareClick = useCallback(
    event => {
      setIsShareDropdownOpen(!isShareDropdownOpen)

      setShareDropdownAnchorElement(
        shareDropdownAnchorElement ? null : event.currentTarget
      )
    },
    [isShareDropdownOpen, shareDropdownAnchorElement]
  )

  const handleShareViaEmailClick = useCallback(
    () => onShareViaEmailClick(),
    [onShareViaEmailClick]
  )

  const handleShareViaLinkClick = useCallback(
    event => {
      setIsShareDropdownOpen(!isShareDropdownOpen)
      setShareDropdownAnchorElement(
        shareDropdownAnchorElement ? null : event.currentTarget
      )
      onShareViaLinkClick()
    },
    [isShareDropdownOpen, onShareViaLinkClick, shareDropdownAnchorElement]
  )

  const maybeRenderOwner = useCallback(() => {
    if (!owner || !shouldShowOwner) {
      return null
    }

    if (isLoadingOwner) {
      return (
        <Typography variant="h6">
          <Skeleton width="250px" />
        </Typography>
      )
    }

    return (
      <Stack direction="row" spacing={1}>
        <Icon type="account-circle" />
        <Typography variant="h6">
          {owner.firstName + ' ' + owner.lastName}
        </Typography>
      </Stack>
    )
  }, [isLoadingOwner, owner, shouldShowOwner])

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4">{name}</Typography>
        {shouldShowActionButtons && (
          <Box>
            <Button
              icon-mode="icon-only"
              icon="edit"
              color={COLORS.lightgray}
              onClick={handleEditClick}
            />
            <Button
              icon-mode="icon-only"
              icon="delete"
              color={COLORS.lightgray}
              onClick={handleRemoveClick}
            />
          </Box>
        )}
      </Box>

      {maybeRenderOwner()}

      {shouldShowActionButtons && (
        <Stack direction="row" spacing={1} sx={styles.stack}>
          <Button
            variant="outlined"
            icon-mode="start"
            icon="add"
            onClick={handleAddClick}
            color={color}
          >
            Add
          </Button>
          <Button
            variant="contained"
            icon-mode="start"
            icon="share"
            onClick={handleShareClick}
            color={color}
          >
            Share
          </Button>

          <Menu
            open={isShareDropdownOpen}
            anchorEl={shareDropdownAnchorElement}
            onClose={handleShareClick}
            sx={styles.menu}
          >
            <MenuItem onClick={handleShareViaLinkClick}>
              <Icon type="link" sx={styles.icons} />
              Copy link
            </MenuItem>

            <MenuItem onClick={handleShareViaEmailClick}>
              <Icon type="mail-outline" sx={styles.icons} />
              Share via email
            </MenuItem>
          </Menu>
        </Stack>
      )}
    </>
  )
}

export default memo(RegistryDetails)
