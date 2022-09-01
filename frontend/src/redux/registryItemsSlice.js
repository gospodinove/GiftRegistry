import { createSlice } from '@reduxjs/toolkit'

// registry id => array of items
const initialState = {}

export const registryItemsSlice = createSlice({
  name: 'registryItems',
  initialState,
  reducers: {
    setRegistryItems: (state, action) => {
      state[action.payload.registryId] = action.payload.items
    },
    addRegistryItem: (state, action) => {
      state[action.payload.registryId] = [
        ...state[action.payload.registryId],
        action.payload.item
      ]
    },
    updateRegistryItem: (state, action) => {
      state[action.payload.registryId] = [
        ...state[action.payload.registryId].filter(
          item => item.id !== action.payload.item.id
        ),
        action.payload.item
      ]
    },
    resetRegistryItemsSlice: () => initialState
  }
})

export const {
  setRegistryItems,
  addRegistryItem,
  updateRegistryItem,
  resetRegistryItemsSlice
} = registryItemsSlice.actions
