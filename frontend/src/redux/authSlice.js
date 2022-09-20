import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DATA_STATUS } from '../constants'
import { api } from '../utils/api'
import { isEmptyObject } from '../utils/objects'
import { handleErrors } from '../utils/redux'
import { resetRegistriesSlice } from './registriesSlice'
import { resetRegistryItemsSlice } from './registryItemsSlice'
import { resetRegistryOwnersSlice } from './registryOwnersSlice'
import { showToast } from './toastSlice'

const initialState = {
  user: undefined,
  // STATUS
  userSessionStatus: DATA_STATUS.idle,
  loginStatus: DATA_STATUS.idle,
  registerStatus: DATA_STATUS.idle,
  completeRegistrationStatus: DATA_STATUS.idle,
  // ERRORS
  loginErrors: undefined,
  registerErrors: undefined,
  completeRegistrationErrors: undefined
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    resetAuthSlice: () => initialState
  },
  extraReducers: builder => {
    builder
      // USER SESSION
      .addCase(fetchUserSession.pending, (state, _) => {
        state.userSessionStatus = DATA_STATUS.loading
      })
      .addCase(fetchUserSession.fulfilled, (state, action) => {
        state.userSessionStatus = DATA_STATUS.succeeded
        state.user = action.payload
      })
      .addCase(fetchUserSession.rejected, (state, action) => {
        state.userSessionStatus = DATA_STATUS.failed
        state.error = action.payload
      })
      // REGISTER
      .addCase(register.pending, state => {
        state.registerStatus = DATA_STATUS.loading
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registerStatus = DATA_STATUS.succeeded
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.registerStatus = DATA_STATUS.failed
        state.registerErrors = action.payload
      })
      // COMPLETE REGISTRATION
      .addCase(completeRegistration.pending, state => {
        state.completeRegistrationStatus = DATA_STATUS.loading
      })
      .addCase(completeRegistration.fulfilled, (state, action) => {
        state.completeRegistrationStatus = DATA_STATUS.succeeded
        state.user = action.payload
      })
      .addCase(completeRegistration.rejected, (state, action) => {
        state.completeRegistrationStatus = DATA_STATUS.failed
        state.completeRegistrationErrors = action.payload
      })
      // LOGIN
      .addCase(login.pending, state => {
        state.loginStatus = DATA_STATUS.loading
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginStatus = DATA_STATUS.succeeded
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = DATA_STATUS.failed
        state.loginErrors = action.payload
      })
      // LOGIN VIA TOKEN
      .addCase(loginViaToken.pending, () => {})
      .addCase(loginViaToken.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(loginViaToken.rejected, () => {})
  }
})

export const { setUser, resetAuthSlice } = authSlice.actions

export const fetchUserSession = createAsyncThunk(
  'auth/fetchUserSession',
  async (_, thunkAPI) => {
    try {
      const user = await api('auth/session-user')

      if (user && !isEmptyObject(user)) {
        return user
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (data, thunkAPI) => {
    try {
      const response = await api('auth/register', 'post', data)
      return response.user
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

export const completeRegistration = createAsyncThunk(
  'auth/completeRegistration',
  async ({ userId, data }, thunkAPI) => {
    try {
      const response = await api('users/' + userId, 'put', data)
      return response.user
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await api('auth/login', 'POST', credentials)
      return response.user
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

export const loginViaToken = createAsyncThunk(
  'auth/loginViaToken',
  async (token, thunkAPI) => {
    try {
      const response = await api('auth/token', 'post', { token })
      return response.user
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await api('auth/logout')

    thunkAPI.dispatch(resetAuthSlice())
    thunkAPI.dispatch(resetRegistriesSlice())
    thunkAPI.dispatch(resetRegistryItemsSlice())
    thunkAPI.dispatch(resetRegistryOwnersSlice())

    thunkAPI.dispatch(showToast({ type: 'success', message: 'Logged out!' }))
  } catch (error) {
    return handleErrors(error, thunkAPI)
  }
})

// SELECTORS
export const isFetchingUserSession = state =>
  state.auth.userSessionStatus === DATA_STATUS.loading

export const hasUser = state => state.auth.user !== undefined && state.auth.user

export const isLggingIn = state =>
  state.auth.loginStatus === DATA_STATUS.loading

export const isRegistering = state =>
  state.auth.registerStatus === DATA_STATUS.loading

export const isCompletingRegistration = state =>
  state.auth.completeRegistrationStatus === DATA_STATUS.loading
