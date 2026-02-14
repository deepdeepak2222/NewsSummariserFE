import { useState, useEffect } from 'react'
import './Header.css'

const Header = ({ apiStatus }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      return saved === 'true'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
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
          <button
            onClick={toggleDarkMode}
            className="theme-toggle"
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
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

