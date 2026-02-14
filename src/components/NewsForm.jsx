import { useState, useEffect } from 'react'
import './NewsForm.css'
import { getSearchHistory, removeSearchFromHistory, saveSearch } from '../utils/searchHistory'

const NewsForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    query: '',
    location: '',
    maxArticles: 10,
    language: 'Hindi',
    when: '1d', // Date filter: '1d' (last 24h), '7d' (last week), 'all' (all time)
  })
  const [showHistory, setShowHistory] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])

  useEffect(() => {
    setSearchHistory(getSearchHistory())
  }, [])

  const handleLoadFromHistory = (historyItem) => {
    setFormData({
      query: historyItem.query,
      location: historyItem.location || '',
      maxArticles: historyItem.maxArticles || 10,
      language: historyItem.language || 'Hindi',
      when: historyItem.when || '1d',
    })
    setShowHistory(false)
    // Auto-submit
    onSubmit({
      query: historyItem.query,
      location: historyItem.location || '',
      maxArticles: historyItem.maxArticles || 10,
      language: historyItem.language || 'Hindi',
      when: historyItem.when || '1d',
    })
  }

  const handleDeleteHistory = (e, id) => {
    e.stopPropagation()
    setSearchHistory(removeSearchFromHistory(id))
  }

  const formatHistoryDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxArticles' ? parseInt(value) : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.query.trim()) {
      return
    }
    // Save to history before submitting
    saveSearch(formData)
    setSearchHistory(getSearchHistory())
    onSubmit(formData)
  }

  return (
    <div className="news-form-container">
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">🔍 Enter Your News Query</h2>
          {searchHistory.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="history-toggle"
              title="Show search history"
            >
              {showHistory ? '📖 Hide History' : '📚 Show History'}
            </button>
          )}
        </div>

        {showHistory && searchHistory.length > 0 && (
          <div className="search-history">
            <h3 className="history-title">Recent Searches</h3>
            <div className="history-list">
              {searchHistory.map((item) => (
                <div
                  key={item.id}
                  className="history-item"
                  onClick={() => handleLoadFromHistory(item)}
                >
                  <div className="history-content">
                    <div className="history-query">{item.query}</div>
                    <div className="history-meta">
                      {item.location && <span className="history-location">📍 {item.location}</span>}
                      <span className="history-language">🌐 {item.language}</span>
                      <span className="history-time">{formatHistoryDate(item.timestamp)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="history-delete"
                    onClick={(e) => handleDeleteHistory(e, item.id)}
                    title="Delete from history"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="news-form">
          <div className="form-group">
            <label htmlFor="query" className="form-label">
              What news would you like to see?
            </label>
            <textarea
              id="query"
              name="query"
              value={formData.query}
              onChange={handleChange}
              placeholder="e.g., elections, floods, development, sports..."
              className="form-textarea"
              rows="4"
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location" className="form-label">
                📍 Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, London, Tokyo..."
                className="form-input"
                disabled={loading}
              />
              <small className="form-help">
                Enter any location worldwide (city, state, or country)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="maxArticles" className="form-label">
                📊 Max Articles
              </label>
              <input
                type="range"
                id="maxArticles"
                name="maxArticles"
                value={formData.maxArticles}
                onChange={handleChange}
                min="1"
                max="10"
                className="form-range"
                disabled={loading}
              />
              <div className="range-value">{formData.maxArticles}</div>
            </div>

            <div className="form-group">
              <label htmlFor="language" className="form-label">
                🌐 Language
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="when" className="form-label">
                📅 Time Range
              </label>
              <select
                id="when"
                name="when"
                value={formData.when}
                onChange={handleChange}
                className="form-select"
                disabled={loading}
              >
                <option value="1d">Last 24 Hours</option>
                <option value="7d">Last Week</option>
                <option value="all">All Time</option>
              </select>
              <small className="form-help">
                {formData.when === '1d' && 'Latest news from last 24 hours'}
                {formData.when === '7d' && 'News from last 7 days'}
                {formData.when === 'all' && 'All available news'}
              </small>
            </div>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading || !formData.query.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Fetching news...
              </>
            ) : (
              <>
                🚀 Get Summary
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewsForm

