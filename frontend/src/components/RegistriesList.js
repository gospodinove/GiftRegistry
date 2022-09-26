import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader
} from '@mui/material'
import { memo, useCallback } from 'react'
import RegistriesListItem from './RegistriesListItem'
import RegistriesListItemSkeleton from './RegistriesListItemSkeleton'
import Empty from './Empty'
import { styles } from './RegistriesList.styles'
import Icon from './Icon'

const RegistriesList = ({
  data,
  isLoading,
  selectedRegistryId,
  onSelectedChange,
  onCreateRegistryButtonClick
}) => {
  const handleRegistryClick = useCallback(
    registry => onSelectedChange(registry.id),
    [onSelectedChange]
  )

  if (isLoading) {
    return (
      <>
        <RegistriesListItemSkeleton />
        <RegistriesListItemSkeleton />
      </>
    )
  }

  return (
    <>
      <List subheader={<div />}>
        <ListSubheader disableGutters sx={styles.subheader}>
          <ListItem component="div" disablePadding>
            <ListItemButton
              component="button"
              className="listItemButton"
              onClick={onCreateRegistryButtonClick}
            >
              <ListItemText primary="Create new registry" />

              <Icon type="add" />
            </ListItemButton>
          </ListItem>
        </ListSubheader>
        {data.map(registry => (
          <RegistriesListItem
            key={registry.id}
            registry={registry}
            isSelected={selectedRegistryId === registry.id}
            onClick={handleRegistryClick}
          />
        ))}
      </List>
      {data.length === 0 && <Empty text="No registries" />}
    </>
  )
}

export default memo(RegistriesList)
