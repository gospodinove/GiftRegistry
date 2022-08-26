import { memo, useState, useCallback, useEffect, useMemo } from 'react'
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
import { Typography } from '@mui/material'
import { styles } from './PopulateRegistryModal.styles'

function PopulateRegistryModal({ open, onClose }) {
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)

  const initialData = useSelector(state => state.modals.createRegistry?.data)

  const isModalInUpdateMode = useMemo(
    () => initialData !== undefined,
    [initialData]
  )

  const [color, setColor] = useState(COLORS.APP[0])
  const [type, setType] = useState('Birthday')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState({})
  const [customType, setCustomType] = useState('Custom')

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

      setIsLoading(true)
      setErrors({})

      const data = {
        type: type === 'Custom' ? customType : type,
        name,
        color
      }

      try {
        const result = await api(
          isModalInUpdateMode ? 'registries/' + initialData.id : 'registries',
          isModalInUpdateMode ? 'put' : 'post',
          data
        )
        dispatch({
          type: isModalInUpdateMode ? 'registries/update' : 'registries/add',
          payload: isModalInUpdateMode ? result.registry : [result.registry]
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
            break

          case 'field-error':
            setErrors(error.data)
            break

          case 'general':
            dispatch({
              type: 'toast/show',
              payload: { type: 'error', message: error.data }
            })
            break

          default:
            dispatch({
              type: 'toast/show',
              payload: { type: 'error', message: 'Something went wrong' }
            })
            break
        }
      } finally {
        setIsLoading(false)
      }
    },
    [
      type,
      customType,
      name,
      color,
      isModalInUpdateMode,
      handleClose,
      dispatch,
      initialData
    ]
  )

  const typographyStyles = useMemo(() => styles(color), [color])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? (
            <>
              <Typography component="span" variant="h6">
                New product to{' '}
              </Typography>
              <Typography component="span" variant="h6" sx={typographyStyles}>
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
          {type === 'Custom' ? (
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
          ) : null}
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
