import { NAVBAR_HEIGHT, NAVBAR_Z_INDEX } from '../constants/navbar'

export const styles = {
  icons: { pr: 1 },
  rootBox: {
    flexGrow: 1,
    height: '100%',
    '& .MuiBox-root': {
      paddingLeft: '0px',
      paddingRight: '0px'
    }
  },
  appBar: { height: `${NAVBAR_HEIGHT}px`, zIndex: NAVBAR_Z_INDEX },
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
  mainBox: { p: 3, pt: 0, pb: 0, height: '100%' },
  menu: { zIndex: NAVBAR_Z_INDEX + 1 },
  authNavBox: {
    display: { xs: 'none', sm: 'block' }
  },
  skeleton: { backgroundColor: 'rgba(255,255,255,0.6)' }
}
