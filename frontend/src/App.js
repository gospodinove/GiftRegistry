import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Page from './pages/Page'
import Register from './pages/Register'
import { api } from './utils/api'
import { isEmptyObject } from './utils/objects'

function App() {
  const dispatch = useDispatch()

  const checkLoggedIn = useCallback(async () => {
    try {
      const user = await api('auth/session-user')

      if (user && !isEmptyObject(user)) {
        dispatch({ type: 'auth/setUser', payload: user })
      }
    } catch {}
  }, [dispatch])

  useEffect(() => {
    checkLoggedIn()
  }, [checkLoggedIn])

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Page />} />

        {/* Auth */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="404" element={<NotFound />} />

        <Route path="*" element={<Navigate to="/404" />} />
      </Route>
    </Routes>
  )
}

export default App
