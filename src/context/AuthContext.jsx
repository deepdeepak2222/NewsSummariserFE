/**
 * Authentication Context for managing auth state
 */
import { createContext, useContext, useState, useEffect } from 'react'
import { 
  getCurrentUser, 
  logout as logoutApi, 
  isAuthenticated,
  login as loginApi,
  register as registerApi
} from '../services/auth'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    // Check if user is authenticated on mount
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      if (isAuthenticated()) {
        const userData = await getCurrentUser()
        setUser(userData)
        setIsAuth(true)
      } else {
        setUser(null)
        setIsAuth(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setIsAuth(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username_or_email, password) => {
    try {
      await loginApi(username_or_email, password)
      // Get user data after login
      const userData = await getCurrentUser()
      setUser(userData)
      setIsAuth(true)
      return userData
    } catch (error) {
      throw error
    }
  }

  const register = async (username, email, password, phone, full_name = null) => {
    try {
      // Register user - build userData object, excluding null/undefined/empty optional fields
      const userData = {
        username: String(username).trim(),
        password: String(password),
        phone: String(phone).trim(),
      }
      
      // Only include optional fields if they have non-empty values
      if (email && String(email).trim()) {
        userData.email = String(email).trim()
      }
      if (full_name && String(full_name).trim()) {
        userData.full_name = String(full_name).trim()
      }
      
      // Validate required fields
      if (!userData.username || !userData.password || !userData.phone) {
        throw new Error('Username, password, and phone are required')
      }
      
      await registerApi(userData)
      // Auto-login after registration
      await loginApi(username, password)
      // Get user data after login
      const userDataFull = await getCurrentUser()
      setUser(userDataFull)
      setIsAuth(true)
      return userDataFull
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    logoutApi()
    setUser(null)
    setIsAuth(false)
  }

  const value = {
    user,
    loading,
    isAuthenticated: isAuth,
    login,
    register,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

