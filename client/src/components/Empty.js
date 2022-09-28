import { Box, Typography } from '@mui/material'
import { memo } from 'react'
import emptyBox from '../assets/empty_box.png'

const Empty = ({ text }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100%"
    flexDirection="column"
  >
    <Box mb={3}>
      <img src={emptyBox} alt="Empty box" width={100} height={100} />
    </Box>

    <Typography variant="h6">{text}</Typography>
  </Box>
)

export default memo(Empty)
