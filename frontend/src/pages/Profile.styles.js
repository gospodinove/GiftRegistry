import { COLORS } from '../constants'

export const styles = {
  profileBox: {
    background: `linear-gradient(to bottom right, ${COLORS.PROFILE_PRIMARY}, ${COLORS.PROFILE_SECONDARY} )`
  },
  avatar: {
    height: '120px',
    width: '120px',
    position: 'absolute',
    top: '-60px',
    boxShadow: `0 0 4px 2px COLORS.WHITE`
  },
  gridContainer: {
    padding: '24px',
    pb: '68px',
    pt: '68px',
    pr: '0px'
  },
  gridItem: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap'
  },
  tabsBox: { width: '100%', display: 'flex', justifyContent: 'center' },
  tab: { color: COLORS.PROFILE_PRIMARY }
}
