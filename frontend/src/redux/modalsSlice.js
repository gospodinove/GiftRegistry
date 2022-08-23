import { createSlice } from '@reduxjs/toolkit'

// modal name => data
const initialState = {}

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    show: (state, action) => {
      state[action.payload.name] = { data: action.payload.data }
    },
    hide: (state, action) => {
      state[action.payload.name] = undefined
    },
    clear: () => initialState
  }
})
