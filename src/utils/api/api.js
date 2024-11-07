import axios from 'axios'

const baseUrl = 'http://84.46.247.18/'

const axiosInstance = axios.create({
  baseURL: baseUrl, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optionally, you can set up interceptors for requests and responses here

// Add a request interceptor (e.g., to add auth tokens)
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the config before the request is sent, e.g., attach tokens
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    // config.headers.Language = `ru`
    // config.headers.Origin = `http://localhost:3001`

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor (e.g., to handle errors globally)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    return Promise.reject(error)
  }
)

export default axiosInstance
