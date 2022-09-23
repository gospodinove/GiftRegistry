import { Masonry } from '@mui/lab'
import { Skeleton } from '@mui/material'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import RegistryItem from './RegistryItem'
import Empty from '../components/Empty'

export default function RegistryItemsMasonry({
  items,
  onToggle,
  onEditClick,
  onRemoveClick,
  areActionsEnabled,
  shouldLinkToRegistry,
  onLinkClick,
  isLoading
}) {
  const user = useSelector(state => state.auth.user)

  const hasItems = useMemo(() => items?.length > 0, [items?.length])

  const masonryConfig = useMemo(
    () => ({
      columns: { xs: 1, sm: 2, md: 3 },
      spacing: { xs: 2, sm: 2, md: 3 }
    }),
    []
  )

  if (isLoading) {
    return (
      <Masonry columns={masonryConfig.columns} spacing={masonryConfig.spacing}>
        <Skeleton
          variant="rectangular"
          height="120px"
          sx={{ borderRadius: '5px' }}
        />
        <Skeleton
          variant="rectangular"
          height="170px"
          sx={{ borderRadius: '5px' }}
        />
      </Masonry>
    )
  }

  if (!hasItems) {
    return <Empty text="No products in the registry" />
  }

  return (
    <Masonry columns={masonryConfig.columns} spacing={masonryConfig.spacing}>
      {items.map(item => (
        <RegistryItem
          key={item.id}
          data={item}
          disabled={item.takenBy && item.takenBy !== user.id}
          color={item.color}
          onToggle={onToggle}
          onEditClick={onEditClick}
          onRemoveClick={onRemoveClick}
          onLinkClick={onLinkClick}
          areActionsEnabled={areActionsEnabled}
          shouldLinkToRegistry={shouldLinkToRegistry}
        />
      ))}
    </Masonry>
  )
}
