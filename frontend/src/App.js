import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Register from './pages/Register'
import { api } from './utils/api'
import { isEmptyObject } from './utils/objects'
import ProtectedRoute from './components/navigation/ProtectedRoute'

function App() {
  const dispatch = useDispatch()

  const user = useSelector(state => state.auth.user)

  const checkLoggedIn = useCallback(async () => {
    dispatch({ type: 'auth/setUserSessionFetching' })

    try {
      const user = await api('auth/session-user')

      if (user && !isEmptyObject(user)) {
        dispatch({ type: 'auth/setUser', payload: user })
      }
    } catch {
    } finally {
      dispatch({ type: 'auth/setUserSessionFetched' })
    }
  }, [dispatch])

  useEffect(() => {
    checkLoggedIn()
  }, [checkLoggedIn])

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="invite/:token" element={<Home />} />

        {/* Auth */}
        <Route
          path="login"
          element={
            <ProtectedRoute condition={user === undefined} fallbackRoute="/">
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="register"
          element={
            <ProtectedRoute
              condition={user === undefined || !user.isRegistrationComplete}
              fallbackRoute="/"
            >
              <Register />
            </ProtectedRoute>
          }
        />

        <Route path="404" element={<NotFound />} />

        <Route path="*" element={<Navigate to="/404" />} />
      </Route>
    </Routes>
  )
}

export default App
