// import React, { useCallback } from 'react'
// import MuiButton from '@mui/material/Button'

// function Button({ color, ...props }) {
//   const styles = useCallback(
//     variant => {
//       switch (variant) {
//         case 'text':
//           break
//         case 'contained':
//           return {
//             backgroundColor: color,
//             '&:hover': {
//               backgroundColor: color,
//               filter: 'brightness(85%)'
//             }
//           }
//         case 'outlined':
//           break
//         default:
//           break
//       }
//     },
//     [color]
//   )

//   return (
//     <MuiButton sx={styles(props.variant)} {...props}>
//       {props.children}
//     </MuiButton>
//   )
// }

// export default Button
