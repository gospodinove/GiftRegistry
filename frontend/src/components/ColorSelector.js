import React, { useCallback } from 'react'
import Box from '@mui/material/Box'
import CircleIcon from '@mui/icons-material/Circle'
import AdjustIcon from '@mui/icons-material/Adjust'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { IconButton } from '@mui/material'
import { HuePicker } from 'react-color'

const colors = ['info', 'warning', 'error', 'success']

function ColorSelector({ onChange }) {
  const [color, setColor] = React.useState('info')
  const [sliderColor, setSliderColor] = React.useState(0)

  console.log(color)

  const handleColorClick = useCallback(
    e => {
      const newColor = e.currentTarget.getAttribute('data-color')
      setColor(newColor)
      onChange(newColor)
    },
    [onChange]
  )

  const handleChangeColor = useCallback(
    e => {
      setSliderColor(e.hex)
      console.log(color)
    },
    [color]
  )

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {colors.map(c => (
          <IconButton
            aria-label="circle"
            data-color={c}
            focusable="true"
            color={c}
            key={c}
            onClick={handleColorClick}
          >
            {color !== c ? <CircleIcon /> : <AdjustIcon />}
          </IconButton>
        ))}
        <IconButton>
          <AddCircleOutlineOutlinedIcon />
        </IconButton>
      </Box>
      <Box pt="10px" pb="10px">
        <HuePicker
          onChange={handleChangeColor}
          color={sliderColor}
          width="100%"
        />
      </Box>
    </>
  )
}

export default ColorSelector
