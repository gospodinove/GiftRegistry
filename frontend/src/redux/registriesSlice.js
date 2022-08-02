import { createSlice } from '@reduxjs/toolkit'

const initialState = []

export const registriesSlice = createSlice({
  name: 'registries',
  initialState,
  reducers: {
    add: (state, action) => [...state, ...action.payload],
    clear: () => initialState
  }
})
