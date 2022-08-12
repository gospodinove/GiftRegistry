import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
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
import { appColors } from '../../constants'

const registryTypes = [
  'Birthday',
  'Wedding',
  'Graduation/Prom',
  'Christmas',
  'Custom'
]

function CreateRegistryModal({ open, onClose }) {
  const dispatch = useDispatch()

  const [color, setColor] = React.useState(appColors[0])
  const [type, setType] = React.useState('Birthday')
  const [name, setName] = React.useState('')
  const [errors, setErrors] = React.useState({})
  const [customType, setCustomType] = React.useState('Custom')

  const handleClose = useCallback(() => {
    onClose()

    setTimeout(() => {
      setName('')
      setType('Birthday')
      setColor(appColors[0])
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

  const onSubmit = useCallback(
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

        dispatch({ type: 'registries/add', payload: [response.registry] })

        handleClose()
      } catch {
        dispatch({
          type: 'toast/show',
          payload: { type: 'error', message: 'Could not create registry' }
        })
      }
    },
    [name, type, customType, color, dispatch, handleClose]
  )

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={onSubmit}>
        <DialogTitle>New registry</DialogTitle>

        <DialogContent>
          <ColorSelector onChange={handleColorChange} />
          <TextField
            select
            margin="normal"
            id="type"
            label="Type"
            value={type}
            onChange={handleTypeChange}
            fullWidth
            variant="outlined"
            color={color}
          >
            {registryTypes.map(option => (
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
              margin="normal"
              id="custom-type"
              label="Type name"
              value={customType}
              onChange={handleCustomTypeChange}
              fullWidth
              variant="outlined"
              color={color}
            />
          ) : null}
          <TextField
            error={errors.name !== undefined}
            helperText={errors.name}
            autoFocus
            required
            margin="normal"
            id="name"
            label="Name"
            value={name}
            onChange={handleNameChange}
            fullWidth
            variant="outlined"
            color={color}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color={color}>
            Cancel
          </Button>

          <Button type="submit" color={color}>
            Create Registry
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default React.memo(CreateRegistryModal)
