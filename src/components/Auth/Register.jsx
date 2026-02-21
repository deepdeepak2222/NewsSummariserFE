import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './Auth.css'

const Register = ({ onSwitchToLogin, onClose = null }) => {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null) // Clear error on input change
  }

  const validateForm = () => {
    if (!formData.phone || formData.phone.trim().length < 10) {
      setError('Phone number is required and must be at least 10 digits')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long')
      return false
    }
    // Email validation (if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Prepare user data - ensure empty strings become null for optional fields
      const emailValue = formData.email.trim() || null
      const fullNameValue = formData.full_name.trim() || null
      
      await register(
        formData.username.trim(),
        emailValue,
        formData.password,
        formData.phone.trim(),
        fullNameValue
      )
      
      // Close modal after successful registration and auto-login
      if (onClose) {
        onClose()
      }
    } catch (err) {
      // Extract error message properly
      let errorMessage = 'Registration failed. Please try again.'
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
          <h2 className="auth-title">✨ Create Account</h2>
          {onClose && (
            <button onClick={onClose} className="auth-close" aria-label="Close">
              ✕
            </button>
          )}
        </div>
        <p className="auth-subtitle">Sign up to get personalized news summaries</p>

        {error && (
          <div className="auth-error" role="alert">
            <span className="error-icon">❌</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              placeholder="+1234567890 or 1234567890"
              required
              disabled={loading}
              autoComplete="tel"
            />
            <small className="form-help">Required for account verification</small>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="your.email@example.com (optional)"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Choose a username (min 3 characters)"
              required
              disabled={loading}
              autoComplete="username"
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="full_name" className="form-label">
              Full Name (Optional)
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="form-input"
              placeholder="Your full name"
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="At least 8 characters"
              required
              disabled={loading}
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Re-enter your password"
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={
              loading ||
              !formData.phone ||
              !formData.username ||
              !formData.password ||
              !formData.confirmPassword
            }
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="auth-link"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

