/**
 * Authentication API service
 */
import axios from 'axios'
import { getApiUrl } from '../config'

const API_URL = getApiUrl()

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.username - Username
 * @param {string} userData.password - Password
 * @param {string} userData.full_name - Full name (optional)
 * @returns {Promise<Object>} User object
 */
export const register = async (userData) => {
  try {
    // Ensure userData is a proper object
    if (!userData || typeof userData !== 'object') {
      throw new Error('Invalid user data provided')
    }
    
    // Log for debugging (remove in production)
    console.log('[Auth Service] Registering with data:', userData)
    
    const response = await axios.post(
      `${API_URL}/api/auth/register`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    )
    return response.data
  } catch (error) {
    if (error.response) {
      const errorDetail = error.response.data?.detail
      let errorMessage = 'Registration failed'
      
      if (typeof errorDetail === 'string') {
        errorMessage = errorDetail
      } else if (Array.isArray(errorDetail)) {
        // Handle validation errors array
        errorMessage = errorDetail.map(err => err.msg || JSON.stringify(err)).join(', ')
      } else if (errorDetail && typeof errorDetail === 'object') {
        errorMessage = JSON.stringify(errorDetail)
      } else {
        errorMessage = `Registration failed: ${error.response.status}`
      }
      
      throw new Error(errorMessage)
    } else if (error.request) {
      throw new Error('Cannot connect to API server. Please check your connection.')
    } else {
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
}

/**
 * Login user
 * @param {string} username - Username or email
 * @param {string} password - Password
 * @returns {Promise<Object>} Token object with access_token
 */
export const login = async (username, password) => {
  try {
    // OAuth2PasswordRequestForm expects form data
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000,
      }
    )
    
    // Store token
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
    }
    
    return response.data
  } catch (error) {
    if (error.response) {
      const errorDetail = error.response.data?.detail
      let errorMessage = 'Login failed'
      
      if (typeof errorDetail === 'string') {
        errorMessage = errorDetail
      } else if (Array.isArray(errorDetail)) {
        // Handle validation errors array
        errorMessage = errorDetail.map(err => err.msg || JSON.stringify(err)).join(', ')
      } else if (errorDetail && typeof errorDetail === 'object') {
        errorMessage = JSON.stringify(errorDetail)
      } else {
        errorMessage = `Login failed: ${error.response.status}`
      }
      
      throw new Error(errorMessage)
    } else if (error.request) {
      throw new Error('Cannot connect to API server. Please check your connection.')
    } else {
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
}

/**
 * Logout user (remove token)
 */
export const logout = () => {
  localStorage.removeItem('access_token')
}

/**
 * Get current user information
 * @returns {Promise<Object>} User object
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('No token found')
    }

    const response = await axios.get(
      `${API_URL}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    )
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired or invalid
      logout()
      throw new Error('Session expired. Please login again.')
    }
    if (error.response) {
      throw new Error(
        error.response.data?.detail || `Failed to get user info: ${error.response.status}`
      )
    } else if (error.request) {
      throw new Error('Cannot connect to API server.')
    } else {
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token')
}

/**
 * Get auth token
 * @returns {string|null} Auth token or null
 */
export const getToken = () => {
  return localStorage.getItem('access_token')
}

