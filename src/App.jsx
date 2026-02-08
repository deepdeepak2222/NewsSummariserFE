import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import NewsForm from './components/NewsForm'
import NewsSummary from './components/NewsSummary'
import ArticlesList from './components/ArticlesList'
import { fetchSummary, checkHealth } from './services/api'
import { getApiUrl } from './config'

function App() {
  const [loading, setLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState('checking')
  const [newsData, setNewsData] = useState(null)
  const [error, setError] = useState(null)
  
  // Get API URL dynamically (not at module level)
  const API_URL = getApiUrl()

  useEffect(() => {
    // Check API health on mount
    console.log('[App] Using API URL:', API_URL)
    checkApiHealth()
  }, [])

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

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    setNewsData(null)

    try {
      const data = await fetchSummary(API_URL, formData)
      setNewsData(data)
      setApiStatus('connected')
    } catch (err) {
      setError(err.message || 'An error occurred while fetching news')
      setApiStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Header apiStatus={apiStatus} />
      <main className="main-content">
        <div className="container">
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
              {newsData.articles && newsData.articles.length > 0 && (
                <ArticlesList articles={newsData.articles} language={newsData.language} />
              )}
            </>
          )}
        </div>
      </main>
      <footer className="footer">
        <p>News Summarizer | Powered by OpenAI & Google News</p>
      </footer>
    </div>
  )
}

export default App

