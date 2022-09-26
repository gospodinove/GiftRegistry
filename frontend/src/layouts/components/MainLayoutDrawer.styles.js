import { NAVBAR_Z_INDEX } from '../../constants'

export const styles = {
  drawerBox: { textAlign: 'center' },
  nestedListItem: { pl: 4 },
  drawer: {
    zIndex: NAVBAR_Z_INDEX + 1,
    display: { xs: 'block', sm: 'none' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      height: '100%'
    }
  }
}
