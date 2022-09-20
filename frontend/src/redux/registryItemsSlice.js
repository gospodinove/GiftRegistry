import { createSlice } from '@reduxjs/toolkit'

// registry id => array of items
const initialState = { items: {}, userItems: [] }

export const registryItemsSlice = createSlice({
  name: 'registryItems',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items[action.payload.registryId] = action.payload.items
    },
    addItems: (state, action) => {
      state.items[action.payload.registryId] = [
        ...state.items[action.payload.registryId],
        action.payload.item
      ]
    },
    setUserItems: (state, action) => {
      state.userItems = action.payload
    },
    update: (state, action) => {
      state.items[action.payload.registryId] = [
        ...state.items[action.payload.registryId].filter(
          item => item.id !== action.payload.item.id
        ),
        action.payload.item
      ]
    },
    remove: (state, action) => {
      state.items[action.payload.registryId] = [
        ...state.items[action.payload.registryId].filter(
          item => item.id !== action.payload.id
        )
      ]
    },
    clear: () => initialState
  }
})
