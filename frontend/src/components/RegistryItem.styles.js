import tinycolor from 'tinycolor2'
import { COLORS } from '../constants'

export const styles = (color, disabled) => ({
  cardStyles: {
    backgroundColor:
      disabled && tinycolor(COLORS.LIGHTGRAY).setAlpha(0.2).toString()
  },
  priceTypography: {
    backgroundColor: tinycolor(!disabled ? color : COLORS.LIGHTGRAY)
      .setAlpha(0.2)
      .toString(),
    borderRadius: '10px 60px 60px 10px',
    padding: '0 20px 0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardMedia: {
    filter: disabled ? 'grayscale(1)' : null,
    '-webkit-filter': disabled && 'grayscale(1)'
  },

  cardActions: { display: 'flex', justifyContent: 'space-between' }
})
