import { createSlice } from '@reduxjs/toolkit'

const initialState = []

export const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    add: (state, action) => [...state, action.payload],
    clear: () => initialState
  }
})
