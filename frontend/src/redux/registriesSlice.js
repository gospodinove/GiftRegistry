import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: [],
  ownerByRegistryId: {}
}

export const registriesSlice = createSlice({
  name: 'registries',
  initialState,
  reducers: {
    addRegistryData: (state, action) => {
      state.data = [...state.data, ...action.payload]
    },
    updateRegistryData: (state, action) => {
      state.data = [
        ...state.data.filter(r => r.id !== action.payload.id),
        action.payload
      ]
    },
    addRegistryOwner: (state, action) => {
      state.ownerByRegistryId[action.payload.registryId] = action.payload.owner
    },
    resetRegistriesSlice: () => initialState
  }
})

export const {
  addRegistryData,
  updateRegistryData,
  addRegistryOwner,
  resetRegistriesSlice
} = registriesSlice.actions
