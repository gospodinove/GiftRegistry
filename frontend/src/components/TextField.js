import { memo, useMemo } from 'react'
import MuiTextField from '@mui/material/TextField'
import { styles } from './TextField.styles'

function TextField({ color, ...props }) {
  const textFieldStyles = useMemo(() => styles(color), [color])

  return (
    <MuiTextField
      {...props}
      sx={textFieldStyles}
      fullWidth
      margin="normal"
      variant="outlined"
    >
      {props.children}
    </MuiTextField>
  )
}

export default memo(TextField)
