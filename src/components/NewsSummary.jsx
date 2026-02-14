import { useState } from 'react'
import './NewsSummary.css'

const NewsSummary = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [audioLoading, setAudioLoading] = useState(false)
  const [audioError, setAudioError] = useState(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showArticles, setShowArticles] = useState(false)
  const [expandedArticles, setExpandedArticles] = useState(new Set())

  const language = data.language || 'English'
  const articles = data.articles || []

  const handleNarrate = async () => {
    if (audioUrl) {
      setIsPlaying(!isPlaying)
      return
    }

    setAudioLoading(true)
    setAudioError(null)

    try {
      // Use Web Speech API for text-to-speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.summary)
        utterance.lang = language === 'Hindi' ? 'hi-IN' : 'en-US'
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 1

        utterance.onend = () => {
          setIsPlaying(false)
          setAudioLoading(false)
        }

        utterance.onerror = (event) => {
          setAudioError('Failed to generate audio')
          setAudioLoading(false)
          setIsPlaying(false)
        }

        speechSynthesis.speak(utterance)
        setIsPlaying(true)
        setAudioLoading(false)
      } else {
        // Fallback: Use Google TTS API or show message
        setAudioError('Text-to-speech not supported in this browser')
        setAudioLoading(false)
      }
    } catch (error) {
      setAudioError('Failed to generate audio')
      setAudioLoading(false)
    }
  }

  const stopNarration = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(data.summary)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = data.summary
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const toggleArticle = (index) => {
    const newExpanded = new Set(expandedArticles)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedArticles(newExpanded)
  }

  return (
    <div className="summary-container">
      <div className="summary-card">
        <div className="summary-header">
          <h2 className="summary-title">
            {language === 'Hindi' ? '📰 समाचार सारांश' : '📰 News Summary'}
          </h2>
          <div className="summary-metrics">
            <div className="metric">
              <span className="metric-label">
                {language === 'Hindi' ? 'लेख' : 'Articles'}
              </span>
              <span className="metric-value">{data.articles_found}</span>
            </div>
          </div>
        </div>

        <div className="query-info">
          <span className="query-label">
            {language === 'Hindi' ? 'क्वेरी:' : 'Query:'}
          </span>
          <span className="query-text">{data.query}</span>
        </div>

        <div className="summary-content">
          <div className="summary-text">{data.summary}</div>
        </div>

        <div className="summary-actions">
          <button
            onClick={handleCopySummary}
            className="copy-button"
            title={language === 'Hindi' ? 'सारांश कॉपी करें' : 'Copy Summary'}
          >
            {copySuccess ? (
              <>
                ✅ {language === 'Hindi' ? 'कॉपी हो गया!' : 'Copied!'}
              </>
            ) : (
              <>
                📋 {language === 'Hindi' ? 'कॉपी करें' : 'Copy'}
              </>
            )}
          </button>
          <button
            onClick={isPlaying ? stopNarration : handleNarrate}
            className="narrate-button"
            disabled={audioLoading}
          >
            {audioLoading ? (
              <>
                <span className="spinner-small"></span>
                {language === 'Hindi' ? 'तैयार हो रहा है...' : 'Generating...'}
              </>
            ) : isPlaying ? (
              <>
                ⏸️ {language === 'Hindi' ? 'रोकें' : 'Stop'}
              </>
            ) : (
              <>
                🔊 {language === 'Hindi' ? 'सारांश सुनें' : 'Narrate Summary'}
              </>
            )}
          </button>
        </div>

        {audioError && (
          <div className="audio-error">
            <span>⚠️</span> {audioError}
          </div>
        )}

        {/* Articles Section */}
        {articles && articles.length > 0 && (
          <div className="articles-section">
            <button
              onClick={() => setShowArticles(!showArticles)}
              className="articles-toggle"
            >
              <span>
                {showArticles ? '▼' : '▶'} {language === 'Hindi' ? 'समाचार लेख देखें' : 'View News Articles'}
              </span>
              <span className="articles-badge">{articles.length}</span>
            </button>

            {showArticles && (
              <div className="articles-list">
                {articles.map((article, index) => {
                  const isExpanded = expandedArticles.has(index)
                  const title = article.title || 'No Title'
                  const summary = article.summary || 'No summary available'
                  const link = article.link || '#'

                  return (
                    <div key={index} className="article-item">
                      <div className="article-item-header">
                        <div className="article-item-title-wrapper">
                          <h4 className="article-item-title">
                            {index + 1}. {title}
                          </h4>
                          {article.source && (
                            <span className="article-source-badge">{article.source}</span>
                          )}
                        </div>
                        <button
                          onClick={() => toggleArticle(index)}
                          className="article-expand-btn"
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="article-item-content">
                          {article.published_formatted && (
                            <div className="article-item-date">
                              📅 {language === 'Hindi' ? 'प्रकाशित:' : 'Published:'} {article.published_formatted}
                            </div>
                          )}
                          {summary && (
                            <div className="article-item-summary">
                              <strong>{language === 'Hindi' ? 'सारांश:' : 'Summary:'}</strong>
                              <p>{summary}</p>
                            </div>
                          )}
                          {link && link !== '#' && (
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="article-item-link"
                            >
                              🔗 {language === 'Hindi' ? 'पूरा लेख पढ़ें' : 'Read Full Article'}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsSummary

