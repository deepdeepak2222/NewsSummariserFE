import { useState } from 'react'
import './NewsSummary.css'

const NewsSummary = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [audioLoading, setAudioLoading] = useState(false)
  const [audioError, setAudioError] = useState(null)

  const language = data.language || 'Hindi'

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
      </div>
    </div>
  )
}

export default NewsSummary

