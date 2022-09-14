import CakeIcon from '@mui/icons-material/Cake'
import SchoolIcon from '@mui/icons-material/School'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ParkIcon from '@mui/icons-material/Park'
import AnimationIcon from '@mui/icons-material/Animation'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import CircleIcon from '@mui/icons-material/Circle'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import CameraRoundedIcon from '@mui/icons-material/CameraRounded'
import AddIcon from '@mui/icons-material/Add'
import ShareIcon from '@mui/icons-material/Share'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import { memo } from 'react'

const getIcon = (type, color, sx) => {
  const styles = { ...sx, color }

  switch (type) {
    case 'cake':
      return <CakeIcon sx={styles} />

    case 'favorite':
      return <FavoriteIcon sx={styles} />

    case 'school':
      return <SchoolIcon sx={styles} />

    case 'park':
      return <ParkIcon sx={styles} />

    case 'animation':
      return <AnimationIcon sx={styles} />

    case 'circle':
      return <CircleIcon sx={styles} />

    case 'add-outlined':
      return <AddCircleOutlineOutlinedIcon sx={styles} />

    case 'add-filled':
      return <AddCircleIcon sx={styles} />

    case 'camera-rounded':
      return <CameraRoundedIcon sx={styles} />

    case 'add':
      return <AddIcon sx={styles} />

    case 'share':
      return <ShareIcon sx={styles} />

    case 'menu':
      return <MenuIcon sx={styles} />

    case 'close':
      return <CloseIcon sx={styles} />

    case 'account-circle':
      return <AccountCircleIcon sx={styles} />

    case 'logout':
      return <LogoutIcon sx={styles} />

    case 'login':
      return <LoginIcon sx={styles} />

    case 'account-box':
      return <AccountBoxIcon sx={styles} />

    case 'register':
      return <AppRegistrationIcon sx={styles} />

    case 'expand-less':
      return <ExpandLessIcon sx={styles} />

    case 'expand-more':
      return <ExpandMoreIcon sx={styles} />

    case 'edit':
      return <EditIcon sx={styles} />

    case 'delete':
      return <DeleteIcon sx={styles} />

    case 'email':
      return <EmailIcon sx={styles} />

    default:
      return <QuestionMarkIcon sx={styles} />
  }
}

function Icon({ type, color, sx }) {
  return getIcon(type, color, sx)
}

export default memo(Icon)
