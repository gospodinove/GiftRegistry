import { memo, useState, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../Button'
import TextField from '../TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import { Grid, InputAdornment, Typography } from '@mui/material'
import { styles } from './PopulateRegistryItemModal.styles'
import {
  createRegistryItem,
  isCreatingRegistryItem,
  isRegistryItemCreated,
  isRegistryItemUpdated,
  isUpdatingRegistryItem,
  updateRegistryItem
} from '../../redux/registryItemsSlice'
import { modalInitialDataForName, MODAL_NAMES } from '../../redux/modalsSlice'

export const POPULATE_REGISTRY_ITEM_MODAL_VARIANT = {
  update: 'update',
  create: 'create'
}

function PopulateRegistryItemModal({ open, onClose }) {
  const dispatch = useDispatch()

  const initialData = useSelector(state =>
    modalInitialDataForName(state, MODAL_NAMES.populateRegistryItem)
  )

  const isUpdateVariant =
    initialData?.variant === POPULATE_REGISTRY_ITEM_MODAL_VARIANT.update

  const isLoading = useSelector(state =>
    isUpdateVariant
      ? isUpdatingRegistryItem(state)
      : isCreatingRegistryItem(state)
  )

  const reduxErrors = useSelector(state =>
    isUpdateVariant
      ? state.registryItems.updateErrors
      : state.registryItems.createErrors
  )

  const shouldCloseModal = useSelector(state =>
    isUpdateVariant
      ? isRegistryItemUpdated(state)
      : isRegistryItemCreated(state)
  )

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData && isUpdateVariant) {
      setName(initialData?.item.name)
      setPrice(initialData?.item.price ?? '')
      setDescription(initialData?.item.description ?? '')
      setLink(initialData?.item.link ?? '')
    }
  }, [initialData, isUpdateVariant])

  useEffect(() => {
    if (reduxErrors !== undefined) {
      setErrors(reduxErrors)
    }
  }, [reduxErrors])

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

  useEffect(() => {
    if (shouldCloseModal) {
      handleClose()
    }
  }, [shouldCloseModal, handleClose])

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

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()

      setErrors({})

      const data = {
        name,
        price,
        description,
        link
      }

      if (isUpdateVariant) {
        dispatch(
          updateRegistryItem({
            registryId: initialData.registryId,
            itemId: initialData.item.id,
            data
          })
        )
      } else {
        dispatch(
          createRegistryItem({
            registryId: initialData.registryId,
            data
          })
        )
      }

      handleClose()
    },
    [
      name,
      price,
      link,
      description,
      dispatch,
      handleClose,
      initialData?.registryId,
      initialData?.item?.id,
      isUpdateVariant
    ]
  )

  const componentStyles = useMemo(
    () => styles(initialData?.color),
    [initialData?.color]
  )

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>
          {isUpdateVariant ? (
            <>
              <Typography component="span" variant="h6">
                Edit{' '}
              </Typography>

              <Typography
                component="span"
                variant="h6"
                sx={componentStyles.highlightedName}
              >
                {initialData?.item.name}
              </Typography>
            </>
          ) : (
            <>
              <Typography component="span" variant="h6">
                New product to{' '}
              </Typography>
              <Typography
                component="span"
                variant="h6"
                sx={componentStyles.highlightedName}
              >
                {initialData?.registryName}
              </Typography>
            </>
          )}
        </DialogTitle>

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
                    <InputAdornment position="start">лв.</InputAdornment>
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
          <Button type="submit" color={initialData?.color} loading={isLoading}>
            {isUpdateVariant ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default memo(PopulateRegistryItemModal)
