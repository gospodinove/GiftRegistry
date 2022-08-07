import React, { useCallback } from 'react'
import Box from '@mui/material/Box'
import CircleIcon from '@mui/icons-material/Circle'
// import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import CameraRoundedIcon from '@mui/icons-material/CameraRounded'
import { IconButton } from '@mui/material'
import { styles } from './ColorSelector.styles'
// import { HuePicker } from 'react-color'
// import Button from './CustomButton'

const colors = ['primary', 'warning', 'error', 'success', 'secondary']

function ColorSelector({ onChange }) {
  const [color, setColor] = React.useState('primary')
  // const [sliderColor, setSliderColor] = React.useState(0)

  const handleColorClick = useCallback(
    e => {
      const newColor = e.currentTarget.getAttribute('data-color')
      setColor(newColor)
      onChange(newColor)
    },
    [onChange]
  )

  // const handleChangeColor = useCallback(
  //   e => {
  //     setSliderColor(e.hex)
  //     console.log(color)
  //   },
  //   [color]
  // )

  return (
    <>
      <Box sx={styles.colorBox}>
        {colors.map(c => (
          <IconButton
            aria-label="circle"
            data-color={c}
            focusable="true"
            color={c}
            key={c}
            onClick={handleColorClick}
          >
            {color !== c ? <CircleIcon /> : <CameraRoundedIcon />}
          </IconButton>
        ))}
        {/* <IconButton>
          <AddCircleOutlineOutlinedIcon />
        </IconButton> */}
      </Box>
      {/* <Box pt="10px" pb="10px">
        <HuePicker
          onChange={handleChangeColor}
          color={sliderColor}
          width="100%"
        />
      </Box> */}
    </>
  )
}

export default ColorSelector
