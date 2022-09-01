import { createSlice } from '@reduxjs/toolkit'

export const MODAL_NAMES = {
  populateRegistryItem: 'populateRegistryItem',
  shareRegistry: 'shareRegistry',
  populateRegistry: 'populateRegistry'
}

// modal name => data
const initialState = {}

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showModal: (state, action) => {
      state[action.payload.name] = { data: action.payload.data }
    },
    hideModal: (state, action) => {
      state[action.payload.name] = undefined
    },
    resetModalsSlice: () => initialState
  }
})

export const { showModal, hideModal, resetModalsSlice } = modalsSlice.actions
