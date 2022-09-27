import { showToast } from '../redux/toastSlice'

export const handleErrors = (error, thunkAPI) => {
  if (error === undefined) {
    thunkAPI.dispatch(
      showToast({ type: 'error', message: 'Something went wrong' })
    )
    return
  }

  switch (error.type) {
    case 'incomplete-registration':
      thunkAPI.dispatch(
        showToast({
          type: 'error',
          message: error.data,
          navigation: { title: 'Register', target: '/register' }
        })
      )
      break

    case 'field-error':
      return thunkAPI.rejectWithValue(error.data)

    case 'general':
      thunkAPI.dispatch(showToast({ type: 'error', message: error.data }))
      break

    default:
      thunkAPI.dispatch(
        showToast({ type: 'error', message: 'Something went wrong' })
      )
      break
  }
}
