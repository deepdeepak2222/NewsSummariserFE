import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import NewsForm from './components/NewsForm'
import NewsSummary from './components/NewsSummary'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import { AuthProvider, useAuth } from './context/AuthContext'
import { fetchSummary, checkHealth } from './services/api'
import { getApiUrl } from './config'
import { saveSearch } from './utils/searchHistory'

function AppContent() {
  const [loading, setLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState('checking')
  const [newsData, setNewsData] = useState(null)
  const [error, setError] = useState(null)
  const [showRegister, setShowRegister] = useState(null)  // null = hidden, true = register, false = login
  
  const { isAuthenticated, loading: authLoading, user } = useAuth()
  
  // Get API URL dynamically (not at module level)
  const API_URL = getApiUrl()

  // Define checkApiHealth before useEffect uses it
  const checkApiHealth = async () => {
    try {
      console.log('[App] Checking health at:', API_URL)
      const healthy = await checkHealth(API_URL)
      console.log('[App] Health check result:', healthy)
      setApiStatus(healthy ? 'connected' : 'error')
    } catch (err) {
      console.error('[App] Health check error:', err)
      setApiStatus('error')
    }
  }

  // IMPORTANT: All hooks must be called before any conditional returns
  useEffect(() => {
    // Check API health on mount
    console.log('[App] Using API URL:', API_URL)
    checkApiHealth()
  }, [])
  
  // Show loading screen only during initial auth check
  if (authLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }
  
  // Users can use basic features without login - no need to force auth screen

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    setNewsData(null)

    try {
      const data = await fetchSummary(API_URL, formData)
      setNewsData(data)
      setApiStatus('connected')
      
      // Save to search history
      saveSearch({
        query: formData.query,
        location: formData.location,
        maxArticles: formData.maxArticles,
        language: formData.language,
        when: formData.when || '1d'
      })
    } catch (err) {
      setError(err.message || 'An error occurred while fetching news')
      setApiStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Header apiStatus={apiStatus} user={user} />
      <main className="main-content">
        <div className="container">
          {/* Show login prompt for unauthenticated users */}
          {!isAuthenticated && (
            <div className="auth-prompt">
              <div className="auth-prompt-content">
                <h3>✨ Get Premium Features</h3>
                <p>Sign up to unlock personalized dashboard, saved summaries, news alerts, and more!</p>
                <div className="auth-prompt-buttons">
                  <button
                    onClick={() => setShowRegister(true)}
                    className="auth-prompt-button primary"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => setShowRegister(false)}
                    className="auth-prompt-button secondary"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          )}

          <NewsForm onSubmit={handleSubmit} loading={loading} />
          
          {error && (
            <div className="error-message" role="alert">
              <span className="error-icon">❌</span>
              <div>
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          {newsData && (
            <>
              <NewsSummary data={newsData} />
              {/* Articles are now shown within NewsSummary component */}
            </>
          )}
        </div>
      </main>

      {/* Auth Modal - Show when user clicks Sign Up or Login */}
      {showRegister !== null && (
        <div className="auth-modal-overlay" onClick={() => setShowRegister(null)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            {showRegister ? (
              <Register 
                onSwitchToLogin={() => setShowRegister(false)}
                onClose={() => setShowRegister(null)}
              />
            ) : (
              <Login 
                onSwitchToRegister={() => setShowRegister(true)}
                onClose={() => setShowRegister(null)}
              />
            )}
          </div>
        </div>
      )}

      <footer className="footer">
        <p>News Summarizer | Powered by OpenAI & Google News</p>
        {!isAuthenticated && (
          <p className="footer-note">
            <small>💡 Basic features available without login. Sign up for premium features!</small>
          </p>
        )}
      </footer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

