import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * AuthGuard component - protects routes that require authentication
 * Usage: Wrap protected components with <AuthGuard><YourComponent /></AuthGuard>
 */
const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to login if not authenticated
      // For now, we'll handle this in App.jsx
      // navigate('/login')
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will be handled by parent
  }

  return <>{children}</>
}

export default AuthGuard

