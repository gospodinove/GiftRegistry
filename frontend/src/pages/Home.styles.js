import { navbarHeight } from '../constants'

export const styles = {
  box: {
    width: '100%',
    boxSizing: 'border-box',
    height: '100%',
    mt: `-${navbarHeight}px`,
    pt: navbarHeight + 'px'
  },
  gridContainer: {
    height: '100%',
    pt: 3
  },
  gridItemXs3: {
    height: '100%',
    overflow: 'auto'
  },
  gridItemXs9: { height: '100%', overflow: 'auto' }
}
