import './Header.css'

const Header = ({ apiStatus }) => {
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
        <div className={`api-status ${apiStatus}`}>
          <span className="status-icon">{getStatusIcon()}</span>
          <span className="status-text">{getStatusText()}</span>
        </div>
      </div>
    </header>
  )
}

export default Header

