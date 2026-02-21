import axios from 'axios'

export const checkHealth = async (apiUrl) => {
  try {
    console.log('[API] Checking health at:', `${apiUrl}/health`)
    const response = await axios.get(`${apiUrl}/health`, {
      timeout: 5000, // Increased timeout
    })
    console.log('[API] Health check response:', response.status, response.data)
    return response.status === 200
  } catch (error) {
    console.error('[API] Health check failed:', error.message)
    if (error.response) {
      console.error('[API] Response status:', error.response.status)
      console.error('[API] Response data:', error.response.data)
    } else if (error.request) {
      console.error('[API] No response received. Request:', error.request)
    }
    return false
  }
}

export const fetchSummary = async (apiUrl, formData) => {
  try {
    const response = await axios.post(
      `${apiUrl}/summarize`,
      {
        query: formData.query,
        location: formData.location || '',
        max_articles: formData.maxArticles || null, // null = unlimited (fetch all in time range)
        language: formData.language || 'Hindi',
        when: formData.when || '1d', // Add time filter parameter
      },
      {
        timeout: 60000, // 60 seconds timeout
      }
    )
    return response.data
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      throw new Error(
        error.response.data?.detail || `Server error: ${error.response.status}`
      )
    } else if (error.request) {
      // Request made but no response
      throw new Error(
        'Cannot connect to API server. Please make sure the API is running.'
      )
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
}

export const fetchArticles = async (apiUrl, query, location = '', maxArticles = 10) => {
  try {
    const response = await axios.get(`${apiUrl}/articles`, {
      params: {
        query,
        location,
        max_articles: maxArticles,
      },
      timeout: 30000,
    })
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.detail || `Server error: ${error.response.status}`
      )
    } else if (error.request) {
      throw new Error('Cannot connect to API server.')
    } else {
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
}

