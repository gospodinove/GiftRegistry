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
  removeStatus: DATA_STATUS.idle,
  // ERRORS
  createErrors: undefined,
  udpateErrors: undefined,
  removeErrors: undefined
}

export const registryItemsSlice = createSlice({
  name: 'registryItems',
  initialState,
  reducers: {
    resetFetchStatus: state => {
      state.fetchStatus = DATA_STATUS.idle
    },
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
      // REMOVE
      .addCase(removeRegistryItem.pending, state => {
        state.removeStatus = DATA_STATUS.loading
      })
      .addCase(removeRegistryItem.fulfilled, (state, action) => {
        state.removeStatus = DATA_STATUS.succeeded
        state.data[action.payload.registryId] = [
          ...state.data[action.payload.registryId].filter(
            item => item.id !== action.payload.itemId
          )
        ]
      })
      .addCase(removeRegistryItem.rejected, (state, action) => {
        state.removeStatus = DATA_STATUS.failed
        state.removeErrors = action.payload
      })
  }
})

export const { resetFetchStatus, resetRegistryItemsSlice } =
  registryItemsSlice.actions

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

export const removeRegistryItem = createAsyncThunk(
  'registryItems/remove',
  async ({ registryId, itemId }, thunkAPI) => {
    try {
      await api('registryItems/' + itemId, 'delete')
      return { registryId, itemId }
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

// SELECTORS
export const itemsSortedByDate = (state, registryId) => {
  const items = state.registryItems.data[registryId]

  if (!items) {
    return undefined
  }

  return [...items].sort(
    (itemOne, itemTwo) => new Date(itemTwo.date) - new Date(itemOne.date)
  )
}

export const areItemsFetched = (state, registryId) =>
  state.registryItems.data[registryId] !== undefined ||
  (state.registryItems.fetchStatus !== DATA_STATUS.idle &&
    state.registryItems.fetchStatus !== DATA_STATUS.loading)

export const isFetchingItems = state =>
  state.registryItems.fetchStatus === DATA_STATUS.loading

export const isCreatingItem = state =>
  state.registryItems.createStatus === DATA_STATUS.loading

export const isUpdatingItem = state =>
  state.registryItems.updateStatus === DATA_STATUS.loading

export const isRemovingItem = state =>
  state.registryItems.removeStatus === DATA_STATUS.loading

export const isItemUpdated = state =>
  state.registryItems.updateStatus === DATA_STATUS.succeeded

export const isItemCreated = state =>
  state.registryItems.createStatus === DATA_STATUS.succeeded
