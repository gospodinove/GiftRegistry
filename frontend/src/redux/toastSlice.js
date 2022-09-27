import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  open: false,
  message: '',
  type: undefined,
  navigation: undefined
}

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.open = true
      state.message = action.payload.message
      state.type = action.payload.type
      state.navigation = action.payload.navigation
    },
    hideToast: () => initialState
  }
})

export const { showToast, hideToast } = toastSlice.actions
