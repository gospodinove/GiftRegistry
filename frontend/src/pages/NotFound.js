import { Box } from '@mui/material'
import { memo } from 'react'
import notFoundGif from '../assets/404.gif'

const NotFound = () => (
  <Box
    width="100%"
    height="100%"
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <img src={notFoundGif} alt="Loading..." width="40%" />
  </Box>
)

export default memo(NotFound)
