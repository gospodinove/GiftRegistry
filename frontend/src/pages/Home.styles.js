import { COLORS, NAVBAR_HEIGHT } from '../constants'

export const styles = {
  box: {
    width: '100%',
    boxSizing: 'border-box',
    height: '100%',
    mt: `-${NAVBAR_HEIGHT}px`,
    pt: NAVBAR_HEIGHT + 'px'
  },
  gridContainer: {
    height: '100%'
  },
  gridItemLeft: {
    display: { xs: 'none', sm: 'block' },
    height: '100%',
    overflow: 'auto',
    pt: 3
  },
  gridItemRight: {
    height: '100%',
    overflow: 'auto',
    ml: { xs: 2, sm: 0 },
    pt: { xs: '50px', sm: 3 }
  },
  registriesDrawerToggleButton: {
    width: '100%',
    borderRadius: 0,
    height: '50px',
    borderBottom: '1px solid ' + COLORS.LIGHTGRAY
  },
  registriesDrawerToggleButtonContainer: {
    display: { sm: 'none' },
    width: '100%',
    position: 'fixed',
    backgroundColor: COLORS.WHITE,
    zIndex: 1000
  },
  registriesDrawer: {
    width: '85%',
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: '85%',
      boxSizing: 'border-box'
    }
  },
  toolbar: { height: NAVBAR_HEIGHT + 'px' }
}
