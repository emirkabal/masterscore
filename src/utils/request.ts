export const generateHeaders = (headers?: Record<string, string>) => {
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
  return !!localStorage.getItem("token")
}
