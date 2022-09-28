import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Register from './pages/Register'
import ProtectedRoute from './components/navigation/ProtectedRoute'
import { fetchUserSession } from './redux/authSlice'
import Profile from './pages/Profile'
import InviteLogin from './pages/InviteLogin'

function App() {
  const dispatch = useDispatch()

  const user = useSelector(state => state.auth.user)

  const checkUserSession = useCallback(
    async () => dispatch(fetchUserSession()),
    [dispatch]
  )

  useEffect(() => {
    checkUserSession()
  }, [checkUserSession])

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="registry/:registryId" element={<Home />} />

        <Route path="invite" element={<InviteLogin />} />

        <Route
          path="profile"
          element={
            <ProtectedRoute
              condition={user !== undefined && user.isRegistrationComplete}
              fallbackRoute="/login"
            >
              <Profile />
            </ProtectedRoute>
          }
        />

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
