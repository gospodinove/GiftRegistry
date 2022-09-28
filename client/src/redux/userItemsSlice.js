import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DATA_STATUS } from '../constants'
import { api } from '../utils/api'
import { handleErrors } from '../utils/redux'

const initialState = {
  data: [],
  status: DATA_STATUS.idle,
  errors: undefined
}

export const userItemsSlice = createSlice({
  name: 'userItems',
  initialState,
  reducers: {
    resetUserItemsSlice: () => initialState,
    removeUserItem: (state, action) => {
      state.data = state.data.filter(item => item.id !== action.payload.id)
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserItems.pending, state => {
        state.status = DATA_STATUS.loading
      })
      .addCase(fetchUserItems.fulfilled, (state, action) => {
        state.status = DATA_STATUS.succeeded
        state.data = action.payload.items
      })
      .addCase(fetchUserItems.rejected, (state, action) => {
        state.status = DATA_STATUS.failed
        state.errors = action.payload
      })
  }
})

export const { resetUserItemsSlice, removeUserItem } = userItemsSlice.actions

export const fetchUserItems = createAsyncThunk(
  'userItems/fetch',
  async (userId, thunkAPI) => {
    try {
      const response = await api('registryItems/takenBy/' + userId)
      return { items: response.items }
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

// SELECTORS
export const isFetchingUserItems = state =>
  state.userItems.status === DATA_STATUS.loading
