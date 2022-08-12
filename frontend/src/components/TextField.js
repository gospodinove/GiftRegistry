import React, { useMemo } from 'react'
import MuiTextField from '@mui/material/TextField'
import { styles } from './TextField.styles'

function TextField({ color, ...props }) {
  const textFieldStyles = useMemo(() => styles(color), [color])

  return (
    <MuiTextField sx={textFieldStyles} {...props}>
      {props.children}
    </MuiTextField>
  )
}

export default React.memo(TextField)
