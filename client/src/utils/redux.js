import { ERROR_TYPES } from '../constants'
import { showToast } from '../redux/toastSlice'

export const handleErrors = (error, thunkAPI) => {
  if (error === undefined) {
    thunkAPI.dispatch(
      showToast({ type: 'error', message: 'Something went wrong' })
    )
    return thunkAPI.rejectWithValue()
  }

  switch (error.type) {
    case ERROR_TYPES.unauthorized:
      thunkAPI.dispatch(showToast({ type: 'error', message: error.data }))
      return thunkAPI.rejectWithValue()

    case ERROR_TYPES.incompleteRegistration:
      thunkAPI.dispatch(
        showToast({
          type: 'error',
          message: error.data,
          navigation: { title: 'Register', target: '/register' }
        })
      )
      return thunkAPI.rejectWithValue()

    case ERROR_TYPES.fieldErrors:
      return thunkAPI.rejectWithValue(error.data)

    case ERROR_TYPES.general:
      thunkAPI.dispatch(showToast({ type: 'error', message: error.data }))
      return thunkAPI.rejectWithValue()

    default:
      thunkAPI.dispatch(
        showToast({ type: 'error', message: 'Something went wrong' })
      )
      return thunkAPI.rejectWithValue()
  }
}
