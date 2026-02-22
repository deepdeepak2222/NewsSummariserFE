import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Auth.css'

const Login = ({ onSwitchToRegister, onClose = null }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null) // Clear error on input change
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(formData.username, formData.password)
      
      // Close modal after successful login
      if (onClose) {
        onClose()
      }
    } catch (err) {
      // Extract error message properly
      let errorMessage = 'Login failed. Please try again.'
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      } else if (err?.message) {
        errorMessage = err.message
      } else if (err?.detail) {
        errorMessage = err.detail
      } else if (typeof err === 'object') {
        errorMessage = JSON.stringify(err)
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-header">
          <h2 className="auth-title">🔐 Login</h2>
          {onClose && (
            <button onClick={onClose} className="auth-close" aria-label="Close">
              ✕
            </button>
          )}
        </div>
        <p className="auth-subtitle">Welcome back! Please login to continue.</p>

        {error && (
          <div className="auth-error" role="alert">
            <span className="error-icon">❌</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username, Email, or Phone
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your username, email, or phone"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading || !formData.username || !formData.password}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="auth-link"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

