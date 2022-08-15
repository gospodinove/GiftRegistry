import { memo, useMemo } from 'react'
import MuiButton from '@mui/material/Button'
import { styles } from './Button.styles'
import { IconButton } from '@mui/material'
import { COLORS } from '../constants'
import Icon from './Icon'

function Button({ color, ...props }) {
  // FIXME: on some colors before the scroller in the createRegistryModal appears font weight is bolded
  const buttonStyles = useMemo(
    () => ({
      ...props.sx,
      ...styles(color ?? COLORS.APP[0])[props.variant ?? 'text']
    }),
    [color, props.sx, props.variant]
  )

  // switch (props['icon-mode']) {
  //   case 'only':
  //     return (
  //       <IconButton {...props} sx={buttonStyles}>
  //         <Icon type={props.icon}>{props.children}</Icon>
  //       </IconButton>
  //     )
  //   case 'start':
  //     return (
  //       <MuiButton
  //         {...props}
  //         sx={buttonStyles}
  //         startIcon={<Icon type={props.icon}></Icon>}
  //       >
  //         {props.children}
  //       </MuiButton>
  //     )
  //   case 'end':
  //     return (
  //       <MuiButton
  //         {...props}
  //         sx={buttonStyles}
  //         endIcon={<Icon type={props.icon}></Icon>}
  //       >
  //         {props.children}
  //       </MuiButton>
  //     )
  //   default:
  //     return (
  //       <MuiButton {...props} sx={buttonStyles}>
  //         {props.children}
  //       </MuiButton>
  //     )
  // }

  const startIcon = useMemo(
    () => (props['icon-mode'] === 'start' ? <Icon type={props.icon} /> : null),
    [props]
  )
  const endIcon = useMemo(
    () => (props['icon-mode'] === 'end' ? <Icon type={props.icon} /> : null),
    [props]
  )

  return props['icon-mode'] === 'only' ? (
    <IconButton {...props} sx={buttonStyles}>
      <Icon type={props.icon} />
    </IconButton>
  ) : (
    <MuiButton
      {...props}
      sx={buttonStyles}
      startIcon={startIcon}
      endIcon={endIcon}
    >
      {props.children}
    </MuiButton>
  )
}

export default memo(Button)
