export const clearError = (errors, setErrors) => {
  const formFieldType = Object.keys(errors)[0]
  setErrors({ ...errors, [formFieldType]: undefined })
}
