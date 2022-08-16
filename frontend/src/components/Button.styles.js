import tinycolor from 'tinycolor2'

export function styles(color) {
  return {
    text: {
      color,
      '&:hover': {
        backgroundColor: tinycolor(color).setAlpha(0.1).toString()
      }
    },
    contained: {
      backgroundColor: color,
      '&:hover': {
        backgroundColor: color
      }
    },
    outlined: {
      color,
      border: '1px solid ' + tinycolor(color).lighten(20).toString(),
      '&:hover': {
        border: '1px solid ' + color,
        backgroundColor: tinycolor(color).setAlpha(0.1).toString()
      }
    },
    iconButton: {
      color
    }
  }
}
