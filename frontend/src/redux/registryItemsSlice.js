import { createSlice } from '@reduxjs/toolkit'

// list id => array of items
const initialState = {}

export const registryItemsSlice = createSlice({
  name: 'registryItems',
  initialState,
  reducers: {
    set: (state, action) => {
      state[action.payload.listId] = action.payload.items
    },
    add: (state, action) => {
      state[action.payload.listId] = [
        ...state[action.payload.listId],
        action.payload.item
      ]
    },
    clear: () => initialState
  }
})
