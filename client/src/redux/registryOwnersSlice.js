import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DATA_STATUS } from '../constants/types'
import { api } from '../utils/api'
import { handleErrors } from '../utils/redux'

const initialState = {
  // registry id => owner
  data: {},
  status: DATA_STATUS.idle,
  errors: undefined
}

export const registryOwnersSlice = createSlice({
  name: 'registryOwners',
  initialState,
  reducers: {
    resetRegistryOwnersSlice: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOwner.pending, state => {
        state.status = DATA_STATUS.loading
      })
      .addCase(fetchOwner.fulfilled, (state, action) => {
        state.status = DATA_STATUS.succeeded
        state.data[action.payload.registryId] = action.payload.owner
      })
      .addCase(fetchOwner.rejected, state => {
        state.status = DATA_STATUS.failed
      })
  }
})

export const { resetRegistryOwnersSlice } = registryOwnersSlice.actions

export const fetchOwner = createAsyncThunk(
  'registryOwners/fetch',
  async (id, thunkAPI) => {
    try {
      const response = await api('registries/' + id + '/owner')
      return { registryId: id, owner: response.owner }
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

// SELECTORS
export const isFetchingOwner = state =>
  state.registryOwners.status === DATA_STATUS.loading

export const ownerByRegistryId = (state, registryId) =>
  state.registryOwners.data[registryId]
