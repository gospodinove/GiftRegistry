import { NAVBAR_HEIGHT } from '../constants'

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
    mt: { xs: '50px', sm: 0 },
    pt: { xs: 0, sm: 3 }
  },
  registriesDrawerToggleButton: {
    display: { xs: 'block', sm: 'none' },
    width: '100%',
    borderRadius: 0,
    height: '50px',
    position: 'fixed'
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
