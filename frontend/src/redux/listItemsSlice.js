import { createSlice } from '@reduxjs/toolkit'

// list id => array of items
const initialState = {}

export const listsSlice = createSlice({
  name: 'listItems',
  initialState,
  reducers: {
    add: (state, action) => {
      state[action.payload.listId] = action.payload.items
    },
    clear: () => initialState
  }
})
