import tinycolor from 'tinycolor2'
import { COLORS } from '../constants'

export const styles = (color, disabled) => ({
  cardStyles: {
    backgroundColor: disabled
      ? tinycolor(COLORS.LIGHTGRAY).setAlpha(0.2).toString()
      : null
  },
  headerTypography: {
    flex: 5
  },
  priceTypography: {
    backgroundColor: tinycolor(!disabled ? color : COLORS.LIGHTGRAY)
      .setAlpha(0.2)
      .toString(),
    borderRadius: '10px 60px 60px 10px',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardMedia: {
    filter: disabled ? 'grayscale(1)' : null,
    '-webkit-filter': disabled ? 'grayscale(1)' : null
  },

  hiddenButton: { flex: 1 }
})
