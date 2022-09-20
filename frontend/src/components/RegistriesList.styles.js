import tinycolor from 'tinycolor2'
import { COLORS } from '../constants'

export const styles = {
  subheader: {
    color: COLORS.BLACK,
    '&:hover': {
      backgroundColor: tinycolor(COLORS.BLACK).lighten(90).toString()
    }
  }
}
