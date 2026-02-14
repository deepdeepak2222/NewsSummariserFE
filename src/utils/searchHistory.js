// Search history utility functions
const HISTORY_KEY = 'newsSummarizer_searchHistory'
const MAX_HISTORY_ITEMS = 10

export const saveSearch = (searchData) => {
  try {
    const history = getSearchHistory()
    
    // Remove duplicate if exists
    const filteredHistory = history.filter(
      item => !(
        item.query === searchData.query &&
        item.location === searchData.location &&
        item.language === searchData.language
      )
    )
    
    // Add new search at the beginning
    const newHistory = [
      {
        ...searchData,
        timestamp: new Date().toISOString(),
        id: Date.now()
      },
      ...filteredHistory
    ].slice(0, MAX_HISTORY_ITEMS)
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
    return newHistory
  } catch (error) {
    console.error('Error saving search history:', error)
    return []
  }
}

export const getSearchHistory = () => {
  try {
    const history = localStorage.getItem(HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('Error reading search history:', error)
    return []
  }
}

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY)
    return []
  } catch (error) {
    console.error('Error clearing search history:', error)
    return []
  }
}

export const removeSearchFromHistory = (id) => {
  try {
    const history = getSearchHistory()
    const filteredHistory = history.filter(item => item.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory))
    return filteredHistory
  } catch (error) {
    console.error('Error removing search from history:', error)
    return getSearchHistory()
  }
}

