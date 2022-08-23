import { Skeleton, Stack } from '@mui/material'
import { memo } from 'react'

const RegistryItemSkeleton = () => (
  <Stack
    direction="row"
    spacing={3}
    pt={3}
    pl={3}
    display="flex"
    alignItems="center"
  >
    <Skeleton width={20} height={30} />
    <Skeleton width="40%" height={15} />
  </Stack>
)

export default memo(RegistryItemSkeleton)
