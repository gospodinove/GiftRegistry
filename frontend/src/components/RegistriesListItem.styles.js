import { hexToRGBA } from '../utils/colors'

export function styles(hex, isSelected) {
  return {
    registryItemStyles: {
      backgroundColor: hexToRGBA(hex, isSelected ? 0.3 : 0.05),
      '&:hover': {
        backgroundColor: hexToRGBA(hex, 0.3)
      }
    },
    iconStyles: {
      color: hex
    }
  }
}
