const isGetMethod = method => method === 'get' || method === 'GET'

export const api = async (endPoint, method = 'GET', data) => {
  const url =
    '/api/' +
    endPoint +
    (isGetMethod(method) && data !== undefined
      ? '?' + new URLSearchParams(data)
      : '')

  const response = await fetch(url, {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json'
    },
    body: method !== 'GET' ? JSON.stringify(data) : undefined,
    credentials: 'include'
  })

  if (!response.ok) {
    throw await response.json()
  }

  // response.json() throws when the reponse does not hold any data
  try {
    return await response.json()
  } catch {
    return
  }
}
