import React, { memo, useCallback } from 'react'
import Box from '@mui/material/Box'
import Icon from './Icon'
import { styles } from './ColorSelector.styles'
import { HuePicker } from 'react-color'
import Button from './Button'
import { appColors } from '../constants'

function ColorSelector({ onChange }) {
  const [color, setColor] = React.useState(appColors[0])
  const [sliderColor, setSliderColor] = React.useState('#ff0300')
  const [isSliderVisible, setIsSliderVisible] = React.useState(false)

  const handleColorClick = useCallback(
    e => {
      const newColor = e.currentTarget.getAttribute('data-color')
      setColor(newColor)
      onChange(newColor)
      setIsSliderVisible(false)
    },
    [onChange]
  )

  const handleChangeColor = useCallback(
    e => {
      setSliderColor(e.hex)
      onChange(e.hex)
    },
    [onChange]
  )

  const handleCustomColorClick = useCallback(() => {
    setColor()
    if (isSliderVisible) {
      setIsSliderVisible(false)
      setColor(appColors[0])
      onChange(appColors[0])
    } else {
      setIsSliderVisible(true)
      onChange(sliderColor)
      setColor(sliderColor)
    }
  }, [setIsSliderVisible, isSliderVisible, onChange, sliderColor])

  return (
    <>
      <Box sx={styles.colorBox}>
        {appColors.map(c => (
          <Button
            icon-only="true"
            aria-label="circle"
            data-color={c}
            focusable="true"
            color={c}
            key={c}
            onClick={handleColorClick}
          >
            {color !== c ? (
              <Icon type="circle" />
            ) : (
              <Icon type="camera-rounded" />
            )}
          </Button>
        ))}
        <Button
          icon-only="true"
          color="#a9a9a9"
          onClick={handleCustomColorClick}
        >
          {isSliderVisible ? (
            <Icon type="add-outlined" color={sliderColor} />
          ) : (
            <Icon type="add-filled" />
          )}
        </Button>
      </Box>
      {isSliderVisible ? (
        <Box pt="10px" pb="10px">
          <HuePicker
            onChange={handleChangeColor}
            color={sliderColor}
            width="100%"
          />
        </Box>
      ) : null}
    </>
  )
}

export default memo(ColorSelector)
