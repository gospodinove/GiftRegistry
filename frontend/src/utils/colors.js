export const getHexByColorName = color => {
  switch (color) {
    case 'primary':
      return '#42a5f5'
    case 'secondary':
      return '#ab47bc'
    case 'warning':
      return '#f57c00'
    case 'error':
      return '#E32F2F'
    case 'success':
      return '#388e3c'
    default:
      return 'white'
  }
}

export const hexToRGB = (hex, alpha) => {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16)

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')'
  }
}
