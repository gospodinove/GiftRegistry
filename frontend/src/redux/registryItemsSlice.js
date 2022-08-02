import { createSlice } from '@reduxjs/toolkit'

// list id => array of items
const initialState = {}

export const registryItemsSlice = createSlice({
  name: 'registryItems',
  initialState,
  reducers: {
    add: (state, action) => {
      state[action.payload.listId] = action.payload.items
    },
    clear: () => initialState
  }
})
