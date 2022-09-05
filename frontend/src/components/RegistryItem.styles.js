import tinycolor from 'tinycolor2'

export const styles = color => ({
  headerTypography: {
    flex: 5
  },
  priceTypography: {
    backgroundColor: tinycolor(color).setAlpha(0.2).toString(),
    borderRadius: '10px 60px 60px 10px',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardMedia: { backgroundColor: color },
  hiddenButton: { flex: 1 }
})
