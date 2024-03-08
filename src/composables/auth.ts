export const generateHeaders = (headers?: Record<string, string>) => {
  if (!process.client) return {}

  if (!headers) {
    headers = {}
  }
  const token = localStorage.getItem("token")
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  return headers
}

export const hasToken = () => {
  if (!process.client) return false
  return !!localStorage.getItem("token")
}
