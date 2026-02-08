import { useState } from 'react'
import './NewsForm.css'

const NewsForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    query: '',
    location: '',
    maxArticles: 10,
    language: 'Hindi',
  })

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
    onSubmit(formData)
  }

  return (
    <div className="news-form-container">
      <div className="form-card">
        <h2 className="form-title">🔍 Enter Your News Query</h2>
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

