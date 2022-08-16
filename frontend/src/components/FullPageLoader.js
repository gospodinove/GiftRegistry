import { Box } from '@mui/material'
import { memo } from 'react'
import calendarGif from '../assets/flipbook.gif'
import { styles } from './FullPageLoader.styles'

const FullPageLoader = () => (
  <Box sx={styles}>
    <img src={calendarGif} alt="Loading..." width={250} height={250} />
  </Box>
)

export default memo(FullPageLoader)
