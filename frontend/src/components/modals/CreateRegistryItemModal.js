import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../../utils/api'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import { Grid, InputAdornment } from '@mui/material'

function CreateRegistryItemModal({ open, onClose }) {
  const dispatch = useDispatch()

  const initialData = useSelector(state => state.modals.createRegistryItem)

  const [name, setName] = React.useState('')
  const [price, setPrice] = React.useState(0)
  const [description, setDescription] = React.useState('')
  const [link, setLink] = React.useState('')
  const [errors, setErrors] = React.useState({})

  useEffect(() => {}, [])

  const handleClose = useCallback(() => {
    onClose()

    setTimeout(() => {
      setName('')
      setErrors({})
      setLink('')
      setPrice(0)
      setDescription('')
    }, 100)
  }, [onClose])

  const handleNameChange = useCallback(
    e => {
      setName(e.target.value)

      if (errors.name !== undefined) {
        setErrors({ ...errors, name: undefined })
      }
    },
    [errors]
  )

  const handlePriceChange = useCallback(
    e => {
      setPrice(e.target.value)

      if (errors.price !== undefined) {
        setErrors({ ...errors, price: undefined })
      }
    },
    [errors]
  )

  const handleDescriptionChange = useCallback(e => {
    setDescription(e.target.value)

    if (errors.description !== undefined) {
      setErrors({ ...errors, description: undefined })
    }
  })

  const handleLinkChange = useCallback(
    e => {
      setLink(e.target.value)

      if (errors.link !== undefined) {
        setErrors({ ...errors, link: undefined })
      }
    },
    [errors]
  )

  const onSubmit = useCallback(
    async e => {
      e.preventDefault()

      setErrors({})

      const data = {
        name,
        price,
        description,
        link
      }

      try {
        const response = await api(
          'lists/' + initialData.registryId + '/items',
          'post',
          data
        )

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

        dispatch({
          type: 'listItems/add',
          payload: { listId: initialData.registryId, item: response.item }
        })

        handleClose()
      } catch {
        dispatch({
          type: 'toast/show',
          payload: { type: 'error', message: 'Could not add product' }
        })
      }
    },
    [
      name,
      price,
      link,
      description,
      dispatch,
      handleClose,
      initialData?.registryId
    ]
  )

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={onSubmit}>
        <DialogTitle>New product to your registry</DialogTitle>

        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={9}>
              <TextField
                error={errors.name !== undefined}
                helperText={errors.name}
                autoFocus
                required
                margin="normal"
                id="name"
                label="Product name"
                value={name}
                onChange={handleNameChange}
                fullWidth
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                error={errors.price !== undefined}
                helperText={errors.price}
                required
                margin="normal"
                id="price"
                label="Price"
                value={price}
                onChange={handlePriceChange}
                variant="outlined"
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                error={errors.description !== undefined}
                helperText={errors.description}
                margin="normal"
                id="name"
                label="Description"
                value={description}
                onChange={handleDescriptionChange}
                fullWidth
                variant="outlined"
                multiline
                maxRows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                error={errors.link !== undefined}
                helperText={errors.link}
                margin="normal"
                id="name"
                label="Link"
                value={link}
                onChange={handleLinkChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add product</Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default CreateRegistryItemModal
