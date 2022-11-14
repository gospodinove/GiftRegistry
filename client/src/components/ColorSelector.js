import { useState, memo, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import { styles } from './ColorSelector.styles'
import { HuePicker } from 'react-color'
import Button from './Button'
import { COLORS } from '../constants/colors'

function ColorSelector({ onChange, initialColor }) {
  const [color, setColor] = useState(COLORS.app[0])
  const [sliderColor, setSliderColor] = useState(COLORS.sliderInitial)
  const [isSliderVisible, setIsSliderVisible] = useState(false)

  useEffect(() => {
    if (!initialColor) {
      return
    }
    if (COLORS.app.includes(initialColor)) {
      setColor(initialColor)
    } else {
      setColor()
      setIsSliderVisible(true)
      setSliderColor(initialColor)
    }
  }, [initialColor])

  const handleAppColorButtonClick = useCallback(
    e => {
      const newColor = e.currentTarget.getAttribute('data-color')
      setColor(newColor)
      onChange(newColor)
      setIsSliderVisible(false)
    },
    [onChange]
  )

  const handleSliderColorChange = useCallback(
    e => {
      setSliderColor(e.hex)
      onChange(e.hex)
    },
    [onChange]
  )

  const toggleSlider = useCallback(() => {
    setColor()
    setIsSliderVisible(!isSliderVisible)
    setColor(isSliderVisible ? COLORS.app[0] : sliderColor)
    onChange(isSliderVisible ? COLORS.app[0] : sliderColor)
  }, [setIsSliderVisible, isSliderVisible, onChange, sliderColor])

  return (
    <>
      <Box sx={styles.colorBox}>
        {COLORS.app.map(c => (
          <Button
            icon-mode="icon-only"
            data-color={c}
            color={c}
            key={c}
            icon={color !== c ? 'circle' : 'camera-rounded'}
            onClick={handleAppColorButtonClick}
          />
        ))}
        <Button
          icon-mode="icon-only"
          color={COLORS.lightgray}
          icon={isSliderVisible ? 'add-outlined' : 'add-filled'}
          onClick={toggleSlider}
        />
      </Box>
      {isSliderVisible && (
        <Box pt="10px" pb="10px">
          <HuePicker
            color={sliderColor}
            width="100%"
            onChange={handleSliderColorChange}
          />
        </Box>
      )}
    </>
  )
}

export default memo(ColorSelector)
