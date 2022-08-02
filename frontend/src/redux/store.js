import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authSlice } from './authSlice'
import { registryItemsSlice } from './registryItemsSlice'
import { registriesSlice } from './registriesSlice'
import { modalsSlice } from './modalsSlice'
import { toastSlice } from './toastSlice'

export const slices = {
  auth: authSlice,
  lists: registriesSlice,
  toast: toastSlice,
  listItems: registryItemsSlice,
  modals: modalsSlice
}

const reducers = Object.values(slices).reduce((acc, slice) => {
  acc[slice.name] = slice.reducer
  return acc
}, {})

export const reducer = combineReducers(reducers)

const store = configureStore({ reducer })

export default store
