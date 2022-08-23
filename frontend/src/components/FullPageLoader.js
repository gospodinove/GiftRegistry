import { Box } from '@mui/material'
import { memo } from 'react'
import calendarGif from '../assets/flipbook.gif'

const FullPageLoader = () => (
  <Box
    width="100%"
    height="100%"
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <img src={calendarGif} alt="Loading..." width={250} height={250} />
  </Box>
)

export default memo(FullPageLoader)
