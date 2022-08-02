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
  gridItem: {
    height: '100%',
    overflow: 'auto'
  }
}
