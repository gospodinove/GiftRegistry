import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Stack,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { memo, useCallback, useMemo, useState } from 'react'
import Button from './Button'
import Checkbox from './Checkbox'
import { styles } from './RegistryItem.styles'

const RegistryItem = ({
  data,
  onToggle,
  color,
  disabled,
  areActionsEnabled,
  onEditClick,
  onRemoveClick,
  onLinkClick,
  shouldLinkToRegistry
}) => {
  const [isCardExpanded, setIsCardExpanded] = useState(false)

  const registryItemStyles = useMemo(
    () => styles(color, disabled),
    [color, disabled]
  )

  const handleCheckboxClick = useCallback(() => {
    onToggle(data.registryId, data.id)
  }, [onToggle, data?.registryId, data?.id])

  const inputProps = useMemo(() => ({ 'aria-labelledby': data.id }), [data.id])

  const handleEditClick = useCallback(() => {
    onEditClick(data.id)
  }, [onEditClick, data.id])

  const handleRemoveClick = useCallback(() => {
    onRemoveClick(data.id)
  }, [data.id, onRemoveClick])

  const handleCardExpandClick = useCallback(() => {
    setIsCardExpanded(!isCardExpanded)
  }, [isCardExpanded])

  const handleLinkToRegistryClick = useCallback(() => {
    onLinkClick(data.registryId)
  }, [data.registryId, onLinkClick])

  return (
    <Card sx={registryItemStyles.cardStyles}>
      <CardHeader
        title={
          <Box display="flex" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                component={data.link ? 'a' : 'div'}
                href={data.link || null}
                variant="h5"
                sx={registryItemStyles.headerTypography}
                color={data.link ? color : 'inherit'}
              >
                {data.name}
              </Typography>

              {shouldLinkToRegistry && (
                <Button
                  onClick={handleLinkToRegistryClick}
                  icon-mode="icon-only"
                  icon="launch"
                  color={color}
                />
              )}
            </Stack>

            {data.price && (
              <Typography sx={registryItemStyles.priceTypography}>
                {data.price}лв.
              </Typography>
            )}
          </Box>
        }
      />

      {data.image && (
        <CardMedia
          component="img"
          src={data.image}
          height="150"
          sx={registryItemStyles.cardMedia}
        />
      )}

      {data.description && (
        <CardContent>
          <Typography>{data.description}</Typography>
        </CardContent>
      )}

      <CardActions sx={registryItemStyles.cardActions}>
        <Box>
          <Checkbox
            checked={data.takenBy !== null}
            tabIndex={-1}
            inputProps={inputProps}
            color={!disabled && color}
            disabled={disabled}
            onClick={handleCheckboxClick}
          />

          {areActionsEnabled && (
            <>
              <Button
                icon-mode="icon-only"
                icon="edit"
                color={color}
                onClick={handleEditClick}
              />
              <Button
                icon-mode="icon-only"
                icon="delete"
                color={color}
                onClick={handleRemoveClick}
              />
            </>
          )}
        </Box>

        {/* Hidden until a use case is found. (most likely for further information about a product) */}
        <Button
          icon-mode="icon-only"
          icon={!isCardExpanded ? 'expand-more' : 'expand-less'}
          color={color}
          disabled={disabled}
          onClick={handleCardExpandClick}
          sx={registryItemStyles.hidden}
        />
      </CardActions>
      <Collapse in={isCardExpanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>Some data </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default memo(RegistryItem)
