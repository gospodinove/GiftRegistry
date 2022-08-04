import { createSlice } from '@reduxjs/toolkit'

const initialState = []

export const registriesSlice = createSlice({
  name: 'registries',
  initialState,
  reducers: {
    add: (state, action) => [...state, ...action.payload],
    update: (state, action) => [
      ...state.filter(r => r.id !== action.payload.id),
      action.payload
    ],
    clear: () => initialState
  }
})
