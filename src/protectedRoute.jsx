import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userStore } from '@/utils/zustand.js'

const ProtectedRoute = ({ children }) => {
  const storeToken = userStore((state) => state.token)

  const navigate = useNavigate()

  useEffect(() => {
    const token = storeToken || localStorage.getItem('ttToken') // Adjust according to your token storage

    // Function to check if the token is valid
    const isTokenValid = (token) => {
      if (!token) return false
      // // Example: Check token expiry (assuming JWT token)
      // const payload = JSON.parse(atob(token.split('.')[1]));
      // const expiryDate = payload.exp * 1000;
      // if (Date.now() >= expiryDate) {
      //     return false;
      // }
      if (token.length > 0) {
        return true
      }

      return true
    }

    if (!isTokenValid(token)) {
      navigate('/auth/sign-in') // Redirect to login page if token is invalid
    }
  }, [navigate])

  // Render children only if the token is valid
  return <>{children}</>
}

export default ProtectedRoute
