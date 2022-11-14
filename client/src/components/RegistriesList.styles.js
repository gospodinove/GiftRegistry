import tinycolor from 'tinycolor2'
import { COLORS } from '../constants/colors'

export const styles = {
  subheader: {
    color: COLORS.black,
    '&:hover': {
      backgroundColor: tinycolor(COLORS.black).lighten(90).toString()
    }
  }
}
