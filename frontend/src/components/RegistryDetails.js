import { Box, Skeleton, Stack, Typography } from '@mui/material'
import { memo, useCallback } from 'react'
import { COLORS } from '../constants'
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
  onAddClick,
  onShareClick
}) => {
  const handleEditClick = useCallback(() => onEditClick(), [onEditClick])

  const handleAddClick = useCallback(() => onAddClick(), [onAddClick])

  const handleShareClick = useCallback(() => onShareClick(), [onShareClick])

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
          <Button
            icon-mode="icon-only"
            icon="edit"
            color={COLORS.LIGHTGRAY}
            component="div"
            onClick={handleEditClick}
          />
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
        </Stack>
      )}
    </>
  )
}

export default memo(RegistryDetails)
