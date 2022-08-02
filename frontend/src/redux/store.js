import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authSlice } from './authSlice'
import { listItemsSlice } from './listItemsSlice'
import { listsSlice } from './listsSlice'
import { modalsSlice } from './modalsSlice'
import { toastSlice } from './toastSlice'

export const slices = {
  auth: authSlice,
  lists: listsSlice,
  toast: toastSlice,
  listItems: listItemsSlice,
  modals: modalsSlice
}

const reducers = Object.values(slices).reduce((acc, slice) => {
  acc[slice.name] = slice.reducer
  return acc
}, {})

export const reducer = combineReducers(reducers)

const store = configureStore({ reducer })

export default store
