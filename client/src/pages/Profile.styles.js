import { COLORS } from '../constants/colors'

export const styles = {
  gridContainerBox: {
    ml: '24px',
    mr: '24px'
  },
  avatarBox: {
    borderRight: { sm: '2px solid lightgray' },
    justifyContent: { xs: 'center', sm: 'end' },
    pr: { sm: '24px !important' }
  },
  avatar: {
    height: '150px',
    width: '150px',
    background: `linear-gradient(to bottom right, ${COLORS.PROFILE_PRIMARY}, ${COLORS.PROFILE_SECONDARY} )`
  },
  gridContainer: {
    pt: { xs: '40px' },
    pb: { xs: '40px' },
    pl: { xs: '20px' },
    pr: { xs: '20px' },
    borderBottom: { xs: '2px solid lightgray' }
  },
  gridItem: {
    display: 'flex',
    justifyContent: { xs: 'center', sm: 'start' }
  },
  infoBox: {
    alignItems: { xs: 'center', sm: 'start' },
    pl: '24px !important'
  },
  tabsBox: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '10px',
    paddingLeft: '0px',
    paddingRight: '0px'
  },
  tab: { color: COLORS.PROFILE_PRIMARY },
  numTypography: {
    width: '24px',
    height: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold'
  }
}
