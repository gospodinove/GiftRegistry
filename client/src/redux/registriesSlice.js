import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DATA_STATUS } from '../constants/types'
import { api } from '../utils/api'
import { handleErrors } from '../utils/redux'
import { removeItemsForRegistryId } from './registryItemsSlice'
import { showToast } from './toastSlice'

const initialState = {
  data: [],
  // STATUS
  fetchStatus: DATA_STATUS.idle,
  createStatus: DATA_STATUS.idle,
  updateStatus: DATA_STATUS.idle,
  removeStatus: DATA_STATUS.idle,
  shareStatus: DATA_STATUS.idle,
  // ERRORS
  createErrors: undefined,
  updateErrors: undefined,
  shareErrors: undefined
}

export const registriesSlice = createSlice({
  name: 'registries',
  initialState,
  reducers: {
    resetRegistryRemoveStatus: state => {
      state.removeStatus = DATA_STATUS.idle
    },
    resetRegistriesSlice: () => initialState
  },
  extraReducers: builder => {
    builder
      // FETCH
      .addCase(fetchRegistries.pending, state => {
        state.fetchStatus = DATA_STATUS.loading
      })
      .addCase(fetchRegistries.fulfilled, (state, action) => {
        state.fetchStatus = DATA_STATUS.succeeded
        state.data = action.payload
      })
      .addCase(fetchRegistries.rejected, state => {
        state.fetchStatus = DATA_STATUS.failed
      })
      // CREATE
      .addCase(createRegistry.pending, state => {
        state.createStatus = DATA_STATUS.loading
      })
      .addCase(createRegistry.fulfilled, (state, action) => {
        state.createStatus = DATA_STATUS.succeeded
        state.data = [...state.data, action.payload]
      })
      .addCase(createRegistry.rejected, (state, action) => {
        state.createStatus = DATA_STATUS.failed
        state.createErrors = action.payload
      })
      // UPDATE
      .addCase(updateRegistry.pending, state => {
        state.updateStatus = DATA_STATUS.loading
      })
      .addCase(updateRegistry.fulfilled, (state, action) => {
        state.updateStatus = DATA_STATUS.succeeded
        state.data = [
          ...state.data.filter(r => r.id !== action.payload.id),
          action.payload
        ]
      })
      .addCase(updateRegistry.rejected, (state, action) => {
        state.updateStatus = DATA_STATUS.failed
        state.updateErrors = action.payload
      })
      // REMOVE
      .addCase(removeRegistry.pending, state => {
        state.removeStatus = DATA_STATUS.loading
      })
      .addCase(removeRegistry.fulfilled, (state, action) => {
        state.removeStatus = DATA_STATUS.succeeded
        state.data = [...state.data.filter(r => r.id !== action.payload.id)]
      })
      .addCase(removeRegistry.rejected, (state, action) => {
        state.removeStatus = DATA_STATUS.failed
      })
      // SHARE
      .addCase(shareViaEmail.pending, state => {
        state.shareStatus = DATA_STATUS.loading
      })
      .addCase(shareViaEmail.fulfilled, (state, action) => {
        state.shareStatus = DATA_STATUS.succeeded
        state.data = [
          ...state.data.filter(r => r.id !== action.payload.id),
          action.payload
        ]
      })
      .addCase(shareViaEmail.rejected, (state, action) => {
        state.shareStatus = DATA_STATUS.failed
        state.shareErrors = action.payload
      })
      // SHARE VIA LINK
      .addCase(togglePublicRegistry.pending, () => {})
      .addCase(togglePublicRegistry.fulfilled, (state, action) => {
        state.data = [
          ...state.data.filter(r => r.id !== action.payload.id),
          action.payload
        ]
      })
      .addCase(togglePublicRegistry.rejected, () => {})
  }
})

export const { resetRegistryRemoveStatus, resetRegistriesSlice } =
  registriesSlice.actions

export const fetchRegistries = createAsyncThunk(
  'registries/fetch',
  async (_, thunkAPI) => {
    try {
      const response = await api('registries')
      return response.registries
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

export const createRegistry = createAsyncThunk(
  'registries/create',
  async (data, thunkAPI) => {
    try {
      const response = await api('registries', 'post', data)
      return response.registry
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

export const updateRegistry = createAsyncThunk(
  'registries/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api('registries/' + id, 'put', data)
      return response.registry
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

export const togglePublicRegistry = createAsyncThunk(
  'registries/togglePublic',
  async (id, thunkAPI) => {
    try {
      const registry = thunkAPI
        .getState()
        .registries.data.find(r => r.id === id)

      const response = await api('registries/' + id, 'put', {
        ...registry,
        public: !registry.public
      })

      thunkAPI.dispatch(
        showToast({ type: 'success', message: 'Link copied to clipboard' })
      )

      return response.registry
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

export const removeRegistry = createAsyncThunk(
  'registries/remove',
  async (id, thunkAPI) => {
    try {
      await api('registries/' + id, 'delete')
      thunkAPI.dispatch(removeItemsForRegistryId({ registryId: id }))
      return { id }
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

export const shareViaEmail = createAsyncThunk(
  'registries/shareViaEmail',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api('registries/' + id + '/share', 'patch', data)
      return response.registry
    } catch (error) {
      return handleErrors(error, thunkAPI)
    }
  }
)

// SELECTORS
export const allRegistries = state => state.registries.data

export const registryDataById = (state, registryId) =>
  state.registries.data.find(registry => registry.id === registryId)

export const shouldFetchRegistries = state =>
  state.registries.fetchStatus === DATA_STATUS.idle

export const isFetchingRegistry = state =>
  state.registries.fetchStatus === DATA_STATUS.loading

export const isCreatingRegistry = state =>
  state.registries.createStatus === DATA_STATUS.loading

export const isUpdatingRegistry = state =>
  state.registries.updateStatus === DATA_STATUS.loading

export const isRemovingRegistry = state =>
  state.registries.removeStatus === DATA_STATUS.loading

export const isSharingRegistry = state =>
  state.registries.shareStatus === DATA_STATUS.loading

export const isRegistryCreated = state =>
  state.registries.createStatus === DATA_STATUS.succeeded

export const isRegistryUpdated = state =>
  state.registries.updateStatus === DATA_STATUS.succeeded

export const isRegistryRemoved = state =>
  state.registries.removeStatus === DATA_STATUS.succeeded

export const isRegistryShared = state =>
  state.registries.shareStatus === DATA_STATUS.succeeded
