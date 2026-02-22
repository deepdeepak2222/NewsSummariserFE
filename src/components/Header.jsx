import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './Header.css'

const Header = ({ apiStatus, user }) => {
  const { logout } = useAuth()
  const [theme, setTheme] = useState(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'connected':
        return '✅'
      case 'error':
        return '❌'
      default:
        return '🔄'
    }
  }

  const getStatusText = () => {
    switch (apiStatus) {
      case 'connected':
        return 'API Connected'
      case 'error':
        return 'API Error'
      default:
        return 'Checking...'
    }
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <span className="header-icon">📰</span>
          <h1>News Summarizer</h1>
        </div>
        <div className="header-actions">
          {user ? (
            <div className="user-info">
              <span className="user-name">👤 {user.username}</span>
              <span className="user-badge">Premium</span>
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  logout()
                }} 
                className="logout-button" 
                title="Logout"
              >
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Logout</span>
              </button>
            </div>
          ) : (
            <div className="guest-badge">
              <span>Guest User</span>
            </div>
          )}
          <button onClick={toggleTheme} className="theme-toggle-button" aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className={`api-status ${apiStatus}`}>
            <span className="status-icon">{getStatusIcon()}</span>
            <span className="status-text">{getStatusText()}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
