import { Box, Skeleton, Stack } from '@mui/material'
import { memo } from 'react'

const RegistriesListItemSkeleton = () => (
  <Stack direction="row" spacing={5} pt="8px" pb="8px" pl="16px" pr="16px">
    <Stack spacing={1} width="80%">
      <Skeleton height={15} />
      <Skeleton width="40%" height={15} />
    </Stack>

    <Box width="20%" display="flex" justifyContent="end" alignItems="center">
      <Skeleton variant="circular" width={24} height={24} />
    </Box>
  </Stack>
)

export default memo(RegistriesListItemSkeleton)
