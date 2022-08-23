import { hexToRGBA } from '../utils/colors'

export function styles(hex, isSelected) {
  return {
    registryItemStyles: {
      backgroundColor: hexToRGBA(hex, isSelected ? 0.5 : 0.07),
      '&:hover': {
        backgroundColor: hexToRGBA(hex, 0.3)
      }
    },
    iconStyles: {
      color: hex
    }
  }
}
