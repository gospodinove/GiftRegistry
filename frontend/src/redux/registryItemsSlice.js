import { createSlice } from '@reduxjs/toolkit'

// registry id => array of items
const initialState = {}

export const registryItemsSlice = createSlice({
  name: 'registryItems',
  initialState,
  reducers: {
    set: (state, action) => {
      state[action.payload.registryId] = action.payload.items
    },
    add: (state, action) => {
      state[action.payload.registryId] = [
        ...state[action.payload.registryId],
        action.payload.item
      ]
    },
    update: (state, action) => {
      state[action.payload.registryId] = [
        ...state[action.payload.registryId].filter(
          item => item.id !== action.payload.item.id
        ),
        action.payload.item
      ]
    },
    remove: (state, action) => {
      state[action.payload.registryId] = [
        ...state[action.payload.registryId].filter(
          item => item.id !== action.payload.id
        )
      ]
    },
    clear: () => initialState
  }
})
