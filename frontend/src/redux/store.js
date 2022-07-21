import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { authSlice } from './authSlice'
import { listsSlice } from './listsSlice'

export const slices = {
  auth: authSlice,
  lists: listsSlice
}

const reducers = Object.values(slices).reduce((acc, slice) => {
  acc[slice.name] = slice.reducer
  return acc
}, {})

export const reducer = combineReducers(reducers)

const store = configureStore({ reducer })

export default store
