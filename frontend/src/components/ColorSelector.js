import { useState, memo, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import { styles } from './ColorSelector.styles'
import { HuePicker } from 'react-color'
import Button from './Button'
import { COLORS } from '../constants'

function ColorSelector({ onChange, initialColor }) {
  const [color, setColor] = useState(COLORS.APP[0])
  const [sliderColor, setSliderColor] = useState(COLORS.SLIDER_INITIAL)
  const [isSliderVisible, setIsSliderVisible] = useState(false)

  useEffect(() => {
    if (!initialColor) {
      return
    }
    if (COLORS.APP.includes(initialColor)) {
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
    setColor(isSliderVisible ? COLORS.APP[0] : sliderColor)
    onChange(isSliderVisible ? COLORS.APP[0] : sliderColor)
  }, [setIsSliderVisible, isSliderVisible, onChange, sliderColor])

  return (
    <>
      <Box sx={styles.colorBox}>
        {COLORS.APP.map(c => (
          <Button
            icon-mode="icon-only"
            data-color={c}
            color={c}
            key={c}
            onClick={handleAppColorButtonClick}
            icon={color !== c ? 'circle' : 'camera-rounded'}
          />
        ))}
        <Button
          icon-mode="icon-only"
          color={COLORS.LIGHTGRAY}
          onClick={toggleSlider}
          icon={isSliderVisible ? 'add-outlined' : 'add-filled'}
        />
      </Box>
      {isSliderVisible ? (
        <Box pt="10px" pb="10px">
          <HuePicker
            onChange={handleSliderColorChange}
            color={sliderColor}
            width="100%"
          />
        </Box>
      ) : null}
    </>
  )
}

export default memo(ColorSelector)
