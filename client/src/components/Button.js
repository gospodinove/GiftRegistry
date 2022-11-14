import { memo, useMemo } from 'react'
import { LoadingButton } from '@mui/lab'
import { styles } from './Button.styles'
import { IconButton } from '@mui/material'
import { COLORS } from '../constants/colors'
import Icon from './Icon'

function Button({ color, ...props }) {
  // FIXME: on some colors before the scroller in the PopulateRegistryModal appears font weight is bolded
  const buttonStyles = useMemo(
    () => ({
      ...props.sx,
      ...styles(color ?? COLORS.app[0])[props.variant ?? 'text']
    }),
    [color, props.sx, props.variant]
  )

  const startIcon = useMemo(
    () => (props['icon-mode'] === 'start' ? <Icon type={props.icon} /> : null),
    [props]
  )
  const endIcon = useMemo(
    () => (props['icon-mode'] === 'end' ? <Icon type={props.icon} /> : null),
    [props]
  )

  return props['icon-mode'] === 'icon-only' ? (
    <IconButton {...props} sx={buttonStyles}>
      <Icon type={props.icon} />
    </IconButton>
  ) : (
    <LoadingButton
      {...props}
      disableFocusRipple
      sx={buttonStyles}
      startIcon={startIcon}
      endIcon={endIcon}
      loadingPosition={
        props['icon-mode'] === 'icon-only' ? undefined : props['icon-mode']
      }
    >
      {props.children}
    </LoadingButton>
  )
}

export default memo(Button)
