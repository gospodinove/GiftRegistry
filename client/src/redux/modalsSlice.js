import { createSlice } from '@reduxjs/toolkit'

export const MODAL_NAMES = {
  populateRegistryItem: 'populateRegistryItem',
  shareRegistry: 'shareRegistry',
  populateRegistry: 'populateRegistry',
  removeRegistryConfirmation: 'removeRegistryConfirmation',
  removeRegistryItemConfirmation: 'removeRegistryItemConfirmation'
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

// SELECTORS
export const isModalOpen = (state, name) => state.modals[name] !== undefined

export const modalInitialDataForName = (state, name) => state.modals[name]?.data
