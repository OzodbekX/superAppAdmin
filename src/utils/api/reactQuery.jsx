import axios from 'axios'

const baseUrl = 'https://api.github.com'

const apiClient = axios.create({
  baseURL: baseUrl, // Replace with your API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
// Generic API function
export const apiRequest = async ({ url, method, data = null, params = null, token = null }) => {
  try {
    const response = await apiClient({
      url,
      method,
      data,
      params,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    })
    return response.data
  } catch (error) {
    // Handle errors appropriately in a real app
    console.error('API request error:', error)
    throw error
  }
}
