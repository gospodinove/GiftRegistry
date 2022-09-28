export function styles(color) {
  return {
    '& label.Mui-focused': {
      color
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: color
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: color
      },
      '&:hover fieldset': {
        borderColor: color
      },
      '&.Mui-focused fieldset': {
        borderColor: color
      }
    }
  }
}
