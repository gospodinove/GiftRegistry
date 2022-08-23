import { memo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../../utils/api'
import Button from '../Button'
import TextField from '../TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import { Grid, InputAdornment } from '@mui/material'

function CreateRegistryItemModal({ open, onClose }) {
  const dispatch = useDispatch()

  const initialData = useSelector(
    state => state.modals.createRegistryItem?.data
  )

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [errors, setErrors] = useState({})

  const handleClose = useCallback(() => {
    onClose()

    setTimeout(() => {
      setName('')
      setErrors({})
      setLink('')
      setPrice('')
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
      if (e.target.value >= 0) {
        setPrice(e.target.value)
      }

      if (errors.price !== undefined) {
        setErrors({ ...errors, price: undefined })
      }
    },
    [errors]
  )

  const handleDescriptionChange = useCallback(
    e => {
      setDescription(e.target.value)

      if (errors.description !== undefined) {
        setErrors({ ...errors, description: undefined })
      }
    },
    [errors]
  )

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
          'registries/' + initialData.registryId + '/items',
          'post',
          data
        )

        dispatch({
          type: 'registryItems/add',
          payload: {
            registryId: initialData.registryId,
            item: response.item
          }
        })

        handleClose()
      } catch (error) {
        switch (error.type) {
          case 'incomplete-registration':
            dispatch({
              type: 'toast/show',
              payload: {
                type: 'error',
                message: error.data,
                navigation: { title: 'Register', target: '/register' }
              }
            })
            return

          case 'field-error':
            setErrors(error.data)
            return

          case 'general':
            dispatch({
              type: 'toast/show',
              payload: { type: 'error', message: error.data }
            })
            return

          default:
            dispatch({
              type: 'toast/show',
              payload: { type: 'error', message: 'Something went wrong' }
            })
            return
        }
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
                id="name"
                label="Product name"
                value={name}
                color={initialData?.color}
                onChange={handleNameChange}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                error={errors.price !== undefined}
                helperText={errors.price}
                id="price"
                label="Price"
                value={price}
                color={initialData?.color}
                onChange={handlePriceChange}
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
                id="name"
                label="Description"
                value={description}
                color={initialData?.color}
                onChange={handleDescriptionChange}
                multiline
                maxRows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                error={errors.link !== undefined}
                helperText={errors.link}
                id="name"
                label="Link"
                value={link}
                color={initialData?.color}
                onChange={handleLinkChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color={initialData?.color}>
            Cancel
          </Button>
          <Button type="submit" color={initialData?.color}>
            Add product
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default memo(CreateRegistryItemModal)
