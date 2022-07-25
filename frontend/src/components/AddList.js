import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../utils/api'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Icon from '@mui/material/Icon'
import Box from '@mui/material/Box'
import { Grid, Stack } from '@mui/material'
import GiftListItem from './GiftListItem'

function AddList() {
  const dispatch = useDispatch()

  const [open, setOpen] = React.useState(false)
  const [type, setType] = React.useState('Birthday')
  const [name, setName] = React.useState('')
  const [errors, setErrors] = React.useState({})

  const listTypes = [
    'Birthday',
    'Wedding',
    'Graduation/Prom',
    'Christmas',
    'Other'
  ]

  const handleClickOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleChange = useCallback(event => {
    setType(event.target.value)
  }, [])

  const lists = useSelector(state => state.lists)

  // const lists = [
  //   { name: 'My birthday list', type: 'Birthday' },
  //   { name: 'My wedding list', type: 'Wedding' },
  //   { name: 'My graduation list', type: 'Graduation/Prom' },
  //   { name: 'My Christmas list', type: 'Christmas' },
  //   { name: 'My custom list', type: 'Other' }
  // ]

  const onSubmit = useCallback(
    async e => {
      e.preventDefault()

      setErrors({})

      const data = {
        type,
        name
      }
      try {
        const response = await api('lists', 'post', data)

        if (!response.success) {
          switch (response.errorType) {
            case 'field-error':
              setErrors(response.errors)
              return
            case 'general':
              dispatch({
                type: 'toast/show',
                payload: { type: 'error', message: response.errors }
              })
              return
            default:
              return
          }
        }

        dispatch({ type: 'lists/add', payload: response.list })

        handleClose()
      } catch {
        dispatch({
          type: 'toast/show',
          payload: { type: 'error', message: 'Could not create list' }
        })
      }
    },
    [name, type, dispatch, handleClose]
  )

  const onListClick = useCallback(list => console.log(list.id), [])

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container>
        <Grid item xs={3}>
          <Button
            sx={{
              mt: 3.5,
              mr: 2.5,
              width: 'fit-content',
              height: 'fit-content'
            }}
            variant="outlined"
            fullWidth
            onClick={handleClickOpen}
            startIcon={<Icon color="primary">add_circle</Icon>}
          >
            CREATE NEW LIST
          </Button>

          <Box sx={{ maxHeight: '80vh', overflow: 'auto' }}>
            {lists.map(list => (
              <ListItem key={list.id} component="div" disablePadding>
                <GiftListItem list={list} action={onListClick} />
              </ListItem>
            ))}
          </Box>
          <Dialog open={open} onClose={handleClose}>
            <Box component="form" onSubmit={onSubmit}>
              <DialogTitle>Your new list</DialogTitle>
              <DialogContent>
                <TextField
                  select
                  margin="normal"
                  id="name"
                  label="List type"
                  value={type}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {listTypes.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  error={errors.name !== undefined}
                  helperText={errors.name}
                  autoFocus
                  required
                  margin="normal"
                  id="name"
                  label="List name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Create List</Button>
              </DialogActions>
            </Box>
          </Dialog>
        </Grid>
        <Grid item xs={9} sx={{ backgroundColor: 'blue' }}></Grid>
      </Grid>
    </Box>
  )
}

export default AddList
