import { createSlice } from '@reduxjs/toolkit'

const initialState = { open: false, message: '', type: undefined }

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    show: (state, action) => {
      state.open = true
      state.message = action.payload.message
      state.type = action.payload.type
    },
    hide: () => initialState
  }
})
