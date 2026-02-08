import { useState } from 'react'
import './ArticlesList.css'

const ArticlesList = ({ articles, language }) => {
  const [expandedArticles, setExpandedArticles] = useState(new Set())

  const toggleArticle = (index) => {
    const newExpanded = new Set(expandedArticles)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedArticles(newExpanded)
  }

  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <div className="articles-container">
      <div className="articles-header">
        <h2 className="articles-title">
          {language === 'Hindi' ? '📄 व्यक्तिगत लेख' : '📄 Individual Articles'}
        </h2>
        <span className="articles-count">
          {articles.length} {language === 'Hindi' ? 'लेख' : 'articles'}
        </span>
      </div>

      <div className="articles-list">
        {articles.map((article, index) => {
          const isExpanded = expandedArticles.has(index)
          const title = article.title || 'No Title'
          const summary = article.summary || 'No summary available'
          const link = article.link || '#'

          return (
            <div key={index} className="article-card">
              <div className="article-header">
                <h3 className="article-title">{title}</h3>
                <button
                  onClick={() => toggleArticle(index)}
                  className="expand-button"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? '▼' : '▶'}
                </button>
              </div>

              {isExpanded && (
                <div className="article-content">
                  <div className="article-summary">
                    <strong>
                      {language === 'Hindi' ? 'सारांश:' : 'Summary:'}
                    </strong>
                    <p>{summary}</p>
                  </div>
                  {link && link !== '#' && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="article-link"
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
    </div>
  )
}

export default ArticlesList

