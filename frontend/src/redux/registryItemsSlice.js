import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DATA_STATUS } from '../constants'
import { api } from '../utils/api'
import { handleErrors } from '../utils/redux'

const initialState = {
  // registry id => array of items
  data: {},
  // STATUS
  fetchStatus: DATA_STATUS.idle,
  createStatus: DATA_STATUS.idle,
  updateStatus: DATA_STATUS.idle,
  // ERRORS
  createErrors: undefined,
  udpateErrors: undefined
}

export const registryItemsSlice = createSlice({
  name: 'registryItems',
  initialState,
  reducers: {
    resetRegistryItemsSlice: () => initialState
  },
  extraReducers: builder => {
    builder
      // FETCH
      .addCase(fetchRegistryItems.pending, state => {
        state.fetchStatus = DATA_STATUS.loading
      })
      .addCase(fetchRegistryItems.fulfilled, (state, action) => {
        state.fetchStatus = DATA_STATUS.succeeded
        state.data[action.payload.registryId] = action.payload.items
      })
      .addCase(fetchRegistryItems.rejected, state => {
        state.fetchStatus = DATA_STATUS.failed
      })
      // TOGGLE
      .addCase(toggleRegistryItem.pending, () => {})
      .addCase(toggleRegistryItem.fulfilled, (state, action) => {
        state.data[action.payload.registryId] = [
          ...state.data[action.payload.registryId].filter(
            item => item.id !== action.payload.item.id
          ),
          action.payload.item
        ]
      })
      .addCase(toggleRegistryItem.rejected, () => {})
      // CREATE
      .addCase(createRegistryItem.pending, state => {
        state.createStatus = DATA_STATUS.loading
      })
      .addCase(createRegistryItem.fulfilled, (state, action) => {
        state.createStatus = DATA_STATUS.succeeded
        state.data[action.payload.registryId] = [
          ...state.data[action.payload.registryId],
          action.payload.item
        ]
      })
      .addCase(createRegistryItem.rejected, (state, action) => {
        state.createStatus = DATA_STATUS.failed
        state.createErrors = action.payload
      })
      // UPDATE
      .addCase(updateRegistryItem.pending, state => {
        state.updateStatus = DATA_STATUS.loading
      })
      .addCase(updateRegistryItem.fulfilled, (state, action) => {
        state.updateStatus = DATA_STATUS.succeeded
        state.data[action.payload.registryId] = [
          ...state.data[action.payload.registryId].filter(
            item => item.id !== action.payload.item.id
          ),
          action.payload.item
        ]
      })
      .addCase(updateRegistryItem.rejected, (state, action) => {
        state.updateStatus = DATA_STATUS.failed
        state.udpateErrors = action.payload
      })
  }
})

export const { resetRegistryItemsSlice } = registryItemsSlice.actions

export const fetchRegistryItems = createAsyncThunk(
  'registryItems/fetch',
  async (registryId, thunkAPI) => {
    try {
      const response = await api('registries/' + registryId + '/items')
      return { registryId, items: response.items }
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

export const toggleRegistryItem = createAsyncThunk(
  'registryItems/toggle',
  async ({ registryId, itemId }, thunkAPI) => {
    try {
      const response = await api(
        'registryItems/' + itemId + '/toggleTaken',
        'patch'
      )
      return { registryId, item: response.item }
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

export const createRegistryItem = createAsyncThunk(
  'registryItems/create',
  async ({ registryId, data }, thunkAPI) => {
    try {
      const response = await api(
        'registries/' + registryId + '/items',
        'post',
        data
      )
      return { registryId, item: response.item }
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

export const updateRegistryItem = createAsyncThunk(
  'registryItems/update',
  async ({ registryId, itemId, data }, thunkAPI) => {
    try {
      const response = await api('registryItems/' + itemId, 'put', data)
      return { registryId, item: response.item }
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)
