import React, { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { flexbox, textTransform } from '@mui/system'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import { FormHelperText } from '@mui/material'

const ProductForm = props => {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [urlErr, setUrlErr] = useState(false)
  const [nameErr, setNameErr] = useState(false)
  const [urlHelper, setUrlHelper] = useState('')
  const [nameHelper, setNameHelper] = useState('')

  const validate = () => {
    const regex = new RegExp(
      '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?'
    )

    if (!regex.test(url) && url !== '') {
      setUrlErr(true)
      setUrlHelper('Invalid link')
    } else if (url === '') {
      setUrlErr(true)

      setUrlHelper('This field is required')
    } else {
      setUrlErr(false)
      setUrlHelper('')
    }

    if (name == '') {
      setNameErr(true)
      setNameHelper('This field is required')
    } else {
      setNameErr(false)
      setNameHelper('')
    }
  }

  const onNameChange = e => {
    setName(e.target.value)
    setNameErr(false)
    setNameHelper('')
  }

  const onUrlChange = e => {
    setUrl(e.target.value)
    setUrlErr(false)
    setUrlHelper('')
  }

  return (
    <div>
      <Box
        sx={{
          lineHeight: 'normal',
          m: 1,
          fontSize: 'h4.fontSize',
          textAlign: 'center',
          textTransform: 'uppercase',
          alignItems: 'center'
        }}
      >
        New list
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',

          '& > :not(button)': {
            m: 1,
            flex: 1
          }
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          id="outlined-basic"
          label="Product name"
          variant="outlined"
          value={name}
          onChange={onNameChange}
          error={nameErr}
          helperText={nameHelper}
        />
        <TextField
          required
          id="outlined-basic"
          label="Product link"
          variant="outlined"
          type="url"
          value={url}
          onChange={onUrlChange}
          error={urlErr}
          helperText={urlHelper}
        />
        <Button
          variant="outlined"
          sx={{
            m: 1,
            height: '56px',
            width: '20px',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white'
            }
          }}
          onClick={validate}
        >
          Add
        </Button>
      </Box>
    </div>
  )
}

export default ProductForm
