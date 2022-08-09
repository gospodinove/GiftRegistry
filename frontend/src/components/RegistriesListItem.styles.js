import { hexToRGBA } from '../utils/colors'

export function styles(hex) {
  return {
    backgroundColor: hexToRGBA(hex, 0.07),
    '&:hover': {
      backgroundColor: hexToRGBA(hex, 0.3)
    },
    '&:focus': {
      backgroundColor: hexToRGBA(hex, 0.5)
    }
  }
}
