import { createSlice } from '@reduxjs/toolkit'

// list id => array of items
const initialState = {}

export const listItemsSlice = createSlice({
  name: 'listItems',
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
