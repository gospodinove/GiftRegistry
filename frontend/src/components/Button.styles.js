import { shadeColor } from '../utils/colors'

export function styles(color) {
  return {
    text: {
      color,
      '&:hover': {
        backgroundColor: shadeColor(color, 230)
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
      border: '1px solid' + shadeColor(color, 100),
      '&:hover': {
        border: '1px solid' + color,
        backgroundColor: shadeColor(color, 230)
      }
    },
    iconButton: {
      color
    }
  }
}
