import { createSlice } from '@reduxjs/toolkit'

export const USER_SESSION_STATE = { FETCHED: 'fetched', FETCHING: 'fetching' }

const initialState = {
  user: undefined,
  userSessionState: undefined
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setUserSessionFetching: state => {
      state.userSessionState = USER_SESSION_STATE.FETCHING
    },
    setUserSessionFetched: state => {
      state.userSessionState = USER_SESSION_STATE.FETCHED
    },
    clear: () => initialState
  }
})
