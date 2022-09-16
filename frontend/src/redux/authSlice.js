import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DATA_STATUS } from '../constants'
import { api } from '../utils/api'
import { isEmptyObject } from '../utils/objects'

const initialState = {
  user: undefined,
  status: DATA_STATUS.idle
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setUserSessionFetching: state => {
      state.status = DATA_STATUS.loading
    },
    setUserSessionFetched: state => {
      state.status = DATA_STATUS.succeeded
    },
    resetAuthSlice: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserSession.pending, (state, _) => {
        state.status = DATA_STATUS.loading
      })
      .addCase(fetchUserSession.fulfilled, (state, _) => {
        state.status = DATA_STATUS.succeeded
      })
      .addCase(fetchUserSession.rejected, (state, action) => {
        state.status = DATA_STATUS.failed
        state.error = action.payload
      })
  }
})

export const { setUser, resetAuthSlice } = authSlice.actions

export const fetchUserSession = createAsyncThunk(
  'auth/fetchUserSession',
  async (_, thunkAPI) => {
    try {
      const user = await api('auth/session-user')

      if (user && !isEmptyObject(user)) {
        thunkAPI.dispatch(setUser(user))
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
