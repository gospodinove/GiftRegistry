import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: undefined,
  // Possible values: fetching, fetched
  userSessionState: 'fetching'
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setUserSessionFetching: state => {
      state.userSessionState = 'fetching'
    },
    setUserSessionFetched: state => {
      state.userSessionState = 'fetched'
    },
    clear: () => initialState
  }
})
