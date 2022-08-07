import { hexToRGB } from '../utils/colors'

export function styles(hex) {
  const listItemButton = {
    backgroundColor: hexToRGB(hex, 0.07),
    '&:hover': {
      backgroundColor: hexToRGB(hex, 0.3)
    },
    '&:focus': {
      backgroundColor: hexToRGB(hex, 0.5)
    }
  }

  return listItemButton
}
