const baseUrl = 'http://localhost:8080'

export const api = async (endPoint, method = 'GET', data) => {
  const url = new URL(baseUrl + '/api/' + endPoint)

  if (method === 'GET' && data !== undefined) {
    Object.keys(data).forEach(key => url.searchParams.append(key, data[key]))
  }

  return (
    await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json'
      },
      body: method !== 'GET' ? JSON.stringify(data) : undefined,
      credentials: 'include'
    })
  ).json()
}
