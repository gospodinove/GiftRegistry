import { memo, useMemo } from 'react'
import MuiTextField from '@mui/material/TextField'
import { styles } from './TextField.styles'

function TextField({ color, ...props }) {
  const textFieldStyles = useMemo(() => styles(color), [color])

  return (
    <MuiTextField
      sx={textFieldStyles}
      {...props}
      fullWidth
      margin="normal"
      variant="outlined"
    >
      {props.children}
    </MuiTextField>
  )
}

export default memo(TextField)
