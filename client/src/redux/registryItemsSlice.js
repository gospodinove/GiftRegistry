import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DATA_STATUS } from '../constants'
import { api } from '../utils/api'
import { handleErrors } from '../utils/redux'
import { removeRegistry } from './registriesSlice'
import { removeUserItem } from './userItemsSlice'

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
    removeItemsForRegistryId: (state, action) => {
      state.data[action.payload.registryId] = undefined
    },
    resetFetchStatus: state => {
      state.fetchStatus = DATA_STATUS.idle
    },
    resetRegistryItemsSlice: () => initialState
  },
  extraReducers: builder => {
    builder
      // removed registry => remove its items
      .addCase(removeRegistry.fulfilled, (state, action) => {
        state.data[action.payload.id] = undefined
      })
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
          ...(state.data[action.payload.registryId] ?? []).filter(
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
      // REMOVE ONE
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

export const {
  removeItemsForRegistryId,
  resetFetchStatus,
  resetRegistryItemsSlice
} = registryItemsSlice.actions

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

      if (response.item.takenBy === null) {
        thunkAPI.dispatch(removeUserItem({ id: itemId }))
      }

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

export const removeRegistryItemsWithRegistryId = createAsyncThunk(
  'registryItems/removeWithRegistryId',
  async (registryId, thunkAPI) => {
    try {
      await api('registry/' + registryId + '/items', 'delete')
      return { registryId }
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

// SELECTORS
export const itemsByRegistryId = (state, registryId) =>
  state.registryItems.data[registryId]

export const areItemsFetched = (state, registryId) =>
  state.registryItems.data[registryId] !== undefined ||
  (state.registryItems.fetchStatus !== DATA_STATUS.idle &&
    state.registryItems.fetchStatus !== DATA_STATUS.loading)

export const isFetchingRegistryItems = state =>
  state.registryItems.fetchStatus === DATA_STATUS.loading

export const isCreatingRegistryItem = state =>
  state.registryItems.createStatus === DATA_STATUS.loading

export const isUpdatingRegistryItem = state =>
  state.registryItems.updateStatus === DATA_STATUS.loading

export const isRemovingRegistryItem = state =>
  state.registryItems.removeStatus === DATA_STATUS.loading

export const isRegistryItemUpdated = state =>
  state.registryItems.updateStatus === DATA_STATUS.succeeded

export const isRegistryItemCreated = state =>
  state.registryItems.createStatus === DATA_STATUS.succeeded

export const isRegistryItemRemoved = state =>
  state.registryItems.removeStatus === DATA_STATUS.succeeded
