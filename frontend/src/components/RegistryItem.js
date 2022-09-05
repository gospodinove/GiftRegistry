import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Grid,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { memo, useCallback, useState, useMemo } from 'react'
import Button from './Button'
import Checkbox from './Checkbox'
import { styles } from './RegistryItem.styles'

// TODO: display the article link
const RegistryItem = ({ data, onToggle, color, disabled, onEditClick }) => {
  const [isCardExpanded, setIsCardExpanded] = useState(false)

  const registryItemStyles = useMemo(() => styles(color), [color])

  const handleClick = useCallback(() => {
    onToggle(data.id)
  }, [onToggle, data.id])

  const inputProps = useMemo(() => ({ 'aria-labelledby': data.id }), [data.id])

  const handleEditClick = useCallback(() => {
    onEditClick(data.id)
  }, [onEditClick, data.id])

  const handleCardExpandClick = useCallback(() => {
    setIsCardExpanded(!isCardExpanded)
  }, [isCardExpanded])

  return (
    <Grid item xs={2} sm={4} md={4}>
      <Card>
        <CardHeader
          title={
            <Box display="flex">
              <Typography
                component={data.link ? 'a' : 'div'}
                href={data.link || null}
                variant="h5"
                sx={registryItemStyles.headerTypography}
                color={data.link ? color : 'inherit'}
              >
                {data.name}
              </Typography>

              {data.price ? (
                <Typography sx={registryItemStyles.priceTypography}>
                  {data.price}$
                </Typography>
              ) : null}
            </Box>
          }
        ></CardHeader>

        <CardMedia
          component="img"
          height="150"
          sx={registryItemStyles.cardMedia}
        />
        {data.description ? (
          <CardContent>
            <Box display="flex" alignItems="center">
              <Typography>{data.description}</Typography>
            </Box>
          </CardContent>
        ) : null}

        <CardActions>
          <Checkbox
            checked={data.takenBy !== null}
            tabIndex={-1}
            inputProps={inputProps}
            color={color}
            disabled={disabled}
            onClick={handleClick}
          />
          <Button
            icon-mode="icon-only"
            icon="edit"
            color={color}
            onClick={handleEditClick}
          />

          <Button disabled sx={registryItemStyles.hiddenButton} />

          <Button
            icon-mode="icon-only"
            icon={!isCardExpanded ? 'expand-more' : 'expand-less'}
            color={color}
            onClick={handleCardExpandClick}
          />
        </CardActions>
        <Collapse in={isCardExpanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography>Some data </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  )
}

export default memo(RegistryItem)
