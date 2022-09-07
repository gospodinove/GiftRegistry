import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: [],
  ownerByRegistryId: {}
}

export const registriesSlice = createSlice({
  name: 'registries',
  initialState,
  reducers: {
    add: (state, action) => {
      state.data = [...state.data, ...action.payload]
    },
    update: (state, action) => {
      state.data = [
        ...state.data.filter(r => r.id !== action.payload.id),
        action.payload
      ]
    },
    remove: (state, action) => {
      state.data = state.data.filter(r => r.id !== action.payload.id)
    },
    addOwner: (state, action) => {
      state.ownerByRegistryId[action.payload.registryId] = action.payload.owner
    },
    removeOwner: (state, action) => {
      state.ownerByRegistryId[action.payload.registryId] = undefined
    },
    clear: () => initialState
  }
})
