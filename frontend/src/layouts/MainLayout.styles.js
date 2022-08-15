import { NAVBAR_HEIGHT } from '../constants'

export const styles = {
  drawerBox: { textAlign: 'center' },
  listItemButton: { textAlign: 'center' },
  rootBox: { flexGrow: 1, height: '100%' },
  appBar: { height: `${NAVBAR_HEIGHT}px` },
  toolbar: { height: `${NAVBAR_HEIGHT}px` },
  typography: {
    flexGrow: 1,
    fontFamily: 'monospace',
    fontWeight: 700,
    letterSpacing: '.3rem',
    color: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  iconButton: { display: { sm: 'none' } },
  drawer: {
    display: { xs: 'block', sm: 'none' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      height: '100%'
    }
  },
  mainBox: { p: 3, pt: 0, pb: 0, height: '100%' },
  authNavBox: {
    display: { xs: 'none', sm: 'block' }
  }
}
