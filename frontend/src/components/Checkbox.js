import React, { useMemo } from 'react'
import MuiCheckbox from '@mui/material/Checkbox'
import { styles } from './Checkbox.styles'

function Checkbox({ color, ...props }) {
  const checkboxStyles = useMemo(() => styles(color), [color])

  return (
    <MuiCheckbox style={checkboxStyles} {...props}>
      {props.children}
    </MuiCheckbox>
  )
}

export default React.memo(Checkbox)
