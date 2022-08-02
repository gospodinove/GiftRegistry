import { navbarHeight } from '../constants'

export const styles = {
  drawerBox: { textAlign: 'center' },
  listItemButton: { textAlign: 'center' },
  box1: { flexGrow: 1, height: '100%' },
  appBar: { height: `${navbarHeight}px` },
  toolbar1: { height: `${navbarHeight}px` },
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
  box2: { p: 3, pt: 0, pb: 0, height: '100%' },
  toolbar2: { height: `${navbarHeight}px` }
}
