import { memo, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../../utils/api'
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

function CreateRegistryModal({ open, onClose }) {
  const dispatch = useDispatch()

  const initialData = useSelector(state => state.modals.createRegistry?.data)

  const [color, setColor] = useState(COLORS.APP[0])
  const [type, setType] = useState('Birthday')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState({})
  const [customType, setCustomType] = useState('Custom')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setColor(initialData.color)

      if (REGISTRY_TYPES.includes(initialData.type)) {
        setType(initialData.type)
      } else {
        setType('Custom')
        setCustomType(initialData.type)
      }
    }
  }, [initialData])

  const handleClose = useCallback(() => {
    onClose()

    setTimeout(() => {
      setName('')
      setType('Birthday')
      setColor(COLORS.APP[0])
    }, 100)
  }, [onClose])

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

      try {
        const response = await api('registries', 'post', data)

        dispatch({ type: 'registries/add', payload: [response.registry] })

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
    [name, type, customType, color, dispatch, handleClose]
  )

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>New registry</DialogTitle>

        <DialogContent>
          <ColorSelector
            onChange={handleColorChange}
            initialColor={initialData?.color}
          />
          <TextField
            select
            id="type"
            label="Type"
            value={type}
            onChange={handleTypeChange}
            color={color}
          >
            {REGISTRY_TYPES.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          {type === 'Custom' ? (
            <TextField
              error={errors.type !== undefined}
              helperText={errors.type}
              autoFocus
              required
              id="custom-type"
              label="Type name"
              value={customType}
              onChange={handleCustomTypeChange}
              color={color}
            />
          ) : null}
          <TextField
            error={errors.name !== undefined}
            helperText={errors.name}
            autoFocus
            required
            id="name"
            label="Name"
            value={name}
            onChange={handleNameChange}
            color={color}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color={color}>
            Cancel
          </Button>

          <Button type="submit" color={color}>
            {initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default memo(CreateRegistryModal)
