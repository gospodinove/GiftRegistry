import { memo, useMemo } from 'react'
import MuiCheckbox from '@mui/material/Checkbox'
import { styles } from './Checkbox.styles'

function Checkbox({ color, ...props }) {
  const checkboxStyles = useMemo(() => styles(color), [color])

  return (
    <MuiCheckbox {...props} style={checkboxStyles}>
      {props.children}
    </MuiCheckbox>
  )
}

export default memo(Checkbox)
