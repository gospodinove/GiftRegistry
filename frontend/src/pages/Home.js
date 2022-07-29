import { Box, Button, Grid } from '@mui/material'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegistriesList from '../components/RegistriesList'
import Registry from '../components/Registry'
import { navbarHeight } from '../constants'
import AddIcon from '@mui/icons-material/Add'
import './Home.css'

export default function Home() {
  const dispatch = useDispatch()

  const isAuthenticated = useSelector(state => state.auth.user !== undefined)

  const [selectedListId, setSelectedListId] = useState()

  const handleCreateRegistryButtonClick = useCallback(
    () =>
      dispatch({ type: 'modals/show', payload: { name: 'createRegistry' } }),
    [dispatch]
  )

  const onListClick = useCallback(
    list => setSelectedListId(list.id),
    [setSelectedListId]
  )

  return (
    <Box
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        height: '100%',
        mt: `-${navbarHeight}px`,
        pt: navbarHeight + 'px'
      }}
    >
      <Grid container sx={{ height: '100%', pt: 3 }} spacing={2}>
        <Grid item xs={3}>
          {isAuthenticated ? (
            <Button
              sx={{
                width: 'fit-content',
                height: 'fit-content'
              }}
              variant="outlined"
              fullWidth
              onClick={handleCreateRegistryButtonClick}
              startIcon={<AddIcon />}
            >
              Create new list
            </Button>
          ) : null}
          <RegistriesList onListClick={onListClick} />
        </Grid>
        <Grid item xs={9}>
          <Registry listId={selectedListId} />
        </Grid>
      </Grid>
    </Box>
  )
}
