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
import { memo } from 'react'

const getIcon = (type, color) => {
  switch (type) {
    case 'cake':
      return <CakeIcon sx={{ color }} />

    case 'favorite':
      return <FavoriteIcon sx={{ color }} />

    case 'school':
      return <SchoolIcon sx={{ color }} />

    case 'park':
      return <ParkIcon sx={{ color }} />

    case 'animation':
      return <AnimationIcon sx={{ color }} />

    case 'circle':
      return <CircleIcon sx={{ color }} />

    case 'add-outlined':
      return <AddCircleOutlineOutlinedIcon sx={{ color }} />

    case 'add-filled':
      return <AddCircleIcon sx={{ color }} />

    case 'camera-rounded':
      return <CameraRoundedIcon sx={{ color }} />

    case 'add':
      return <AddIcon sx={{ color }} />

    case 'share':
      return <ShareIcon sx={{ color }} />

    case 'menu':
      return <MenuIcon sx={{ color }} />

    case 'close':
      return <CloseIcon sx={{ color }} />

    case 'account-circle':
      return <AccountCircleIcon sx={{ color }} />

    default:
      return <QuestionMarkIcon sx={{ color }} />
  }
}

function Icon({ type, color }) {
  return getIcon(type, color)
}

export default memo(Icon)
