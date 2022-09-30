import { Box } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '../hooks/useQuery'

import { isLoginWithTokenCompleted, loginViaToken } from '../redux/authSlice'

export default function InviteLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const query = useQuery()

  const shouldNavigateAfterLoginWithToken = useSelector(
    isLoginWithTokenCompleted
  )

  const token = useMemo(() => query.get('token'), [query])

  const redirect = useMemo(() => query.get('redirect'), [query])

  useEffect(() => {
    if (shouldNavigateAfterLoginWithToken) {
      navigate(redirect ? '/registry/' + redirect : '/')
    }
  }, [navigate, redirect, shouldNavigateAfterLoginWithToken])

  useEffect(() => {
    if (token) {
      dispatch(loginViaToken(token))
    }
  }, [dispatch, token])

  return (
    <Box
      component="div"
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      Logging you in...
    </Box>
  )
}
