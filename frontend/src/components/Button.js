import React, { memo, useMemo } from 'react'
import MuiButton from '@mui/material/Button'
import { styles } from './Button.styles'
import { IconButton } from '@mui/material'
import { appColors } from '../constants'

function Button({ color, ...props }) {
  // FIXME: on some colors before the scroller in the createRegistryModal appears font weight is bolded
  const buttonStyles = useMemo(() => styles(color ?? appColors[0]), [color])

  return props['icon-only'] ? (
    <IconButton sx={buttonStyles.iconButton} {...props}>
      {props.children}
    </IconButton>
  ) : (
    <MuiButton sx={buttonStyles[props.variant ?? 'text']} {...props}>
      {props.children}
    </MuiButton>
  )
}

export default memo(Button)
