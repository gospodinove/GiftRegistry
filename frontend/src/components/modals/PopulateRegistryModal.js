import { memo, useState, useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../Button'
import TextField from '../TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import ColorSelector from '../ColorSelector'
import { COLORS, REGISTRY_TYPES } from '../../constants'
import { Typography } from '@mui/material'
import { styles } from './PopulateRegistryModal.styles'
import {
  createRegistry,
  isCreatingRegistry,
  isRegistryCreated,
  isRegistryUpdated,
  isUpdatingRegistry,
  updateRegistry
} from '../../redux/registriesSlice'
import { modalInitialDataForName, MODAL_NAMES } from '../../redux/modalsSlice'

function PopulateRegistryModal({ open, onClose }) {
  const dispatch = useDispatch()

  const initialData = useSelector(state =>
    modalInitialDataForName(state, MODAL_NAMES.populateRegistry)
  )

  const isModalInUpdateMode = useMemo(
    () => initialData !== undefined,
    [initialData]
  )

  const reduxErrors = useSelector(state =>
    isModalInUpdateMode
      ? state.registries.updateErrors
      : state.registries.createErrors
  )

  const isLoading = useSelector(state =>
    isModalInUpdateMode ? isUpdatingRegistry(state) : isCreatingRegistry(state)
  )

  const shouldCloseModal = useSelector(state =>
    isModalInUpdateMode ? isRegistryUpdated(state) : isRegistryCreated(state)
  )

  const [color, setColor] = useState(COLORS.APP[0])
  const [type, setType] = useState('Birthday')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState({})
  const [customType, setCustomType] = useState('Custom')

  useEffect(() => {
    setErrors(reduxErrors ?? {})
  }, [reduxErrors])

  useEffect(() => {
    if (isModalInUpdateMode) {
      setName(initialData.name)
      setColor(initialData.color)

      if (REGISTRY_TYPES.includes(initialData.type)) {
        setType(initialData.type)
      } else {
        setType('Custom')
        setCustomType(initialData.type)
      }
    }
  }, [initialData, isModalInUpdateMode])

  const handleClose = useCallback(() => {
    onClose()

    setTimeout(() => {
      setName('')
      setType('Birthday')
      setColor(COLORS.APP[0])
    }, 100)
  }, [onClose])

  useEffect(() => {
    if (shouldCloseModal) {
      handleClose()
    }
  }, [handleClose, shouldCloseModal])

  const handleColorChange = useCallback(color => {
    setColor(color)
  }, [])

  const handleTypeChange = useCallback(
    e => {
      setType(e.target.value)

      setCustomType('Custom')

      setErrors({ ...errors, type: undefined })
    },
    [errors]
  )

  const handleCustomTypeChange = useCallback(
    e => {
      setCustomType(e.target.value)

      if (errors.type !== undefined) {
        setErrors({ ...errors, type: undefined })
      }
    },
    [errors]
  )

  const handleNameChange = useCallback(
    e => {
      setName(e.target.value)

      if (errors.name !== undefined) {
        setErrors({ ...errors, name: undefined })
      }
    },
    [errors]
  )

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()

      setErrors({})

      const data = {
        type: type === 'Custom' ? customType : type,
        name,
        color
      }

      if (isModalInUpdateMode) {
        dispatch(updateRegistry({ id: initialData.id, data }))
      } else {
        dispatch(createRegistry(data))
      }
    },
    [type, customType, name, color, isModalInUpdateMode, dispatch, initialData]
  )

  const componentStyles = useMemo(() => styles(color), [color])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? (
            <>
              <Typography component="span" variant="h6">
                Edit{' '}
              </Typography>
              <Typography
                component="span"
                variant="h6"
                sx={componentStyles.registryName}
              >
                {initialData?.name}
              </Typography>
            </>
          ) : (
            'New registry'
          )}
        </DialogTitle>

        <DialogContent>
          <ColorSelector
            initialColor={initialData?.color}
            onChange={handleColorChange}
          />
          <TextField
            select
            id="type"
            label="Type"
            value={type}
            color={color}
            onChange={handleTypeChange}
          >
            {REGISTRY_TYPES.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          {type === 'Custom' && (
            <TextField
              error={errors.type !== undefined}
              helperText={errors.type}
              autoFocus
              required
              id="custom-type"
              label="Type name"
              value={customType}
              color={color}
              onChange={handleCustomTypeChange}
            />
          )}
          <TextField
            error={errors.name !== undefined}
            helperText={errors.name}
            autoFocus
            required
            id="name"
            label="Name"
            value={name}
            color={color}
            onChange={handleNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button color={color} onClick={handleClose}>
            Cancel
          </Button>

          <Button type="submit" color={color} loading={isLoading}>
            {initialData ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default memo(PopulateRegistryModal)
