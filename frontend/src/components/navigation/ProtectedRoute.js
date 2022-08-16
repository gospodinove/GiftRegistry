import React, { memo } from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ condition, fallbackRoute, ...props }) =>
  condition ? props.children : <Navigate to={fallbackRoute} />

export default memo(ProtectedRoute)
