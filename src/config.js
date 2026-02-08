// API configuration
// In production, this will be set at build time via VITE_API_URL environment variable
// For runtime configuration, check window.__API_URL__ (can be injected via nginx)

// Get API URL from build-time env var or runtime config
const getBuildTimeApiUrl = () => {
  // Vite environment variables are available at build time
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl) {
    return envUrl
  }
  return 'http://localhost:8000'
}

// Check for runtime API URL (injected by nginx or other means)
const getRuntimeApiUrl = () => {
  // Check if API URL is injected via window object (e.g., by nginx)
  if (typeof window !== 'undefined' && window.__API_URL__) {
    return window.__API_URL__
  }
  return null
}

// Determine if we're running in Kubernetes
const isKubernetes = () => {
  if (typeof window === 'undefined') return false
  const hostname = window.location.hostname
  return hostname !== 'localhost' && 
         hostname !== '127.0.0.1' && 
         !hostname.includes('.local')
}

// Get the final API URL
export const getApiUrl = () => {
  // Priority 1: Runtime config (if available) - for Kubernetes ConfigMap
  const runtimeUrl = getRuntimeApiUrl()
  if (runtimeUrl) {
    console.log('[API Config] Using runtime config:', runtimeUrl)
    return runtimeUrl
  }
  
  // Priority 2: Build-time env var (from .env file)
  const buildTimeUrl = getBuildTimeApiUrl()
  if (buildTimeUrl) {
    console.log('[API Config] Using build-time env var:', buildTimeUrl)
    return buildTimeUrl
  }
  
  // Priority 3: Auto-detect based on environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    const protocol = window.location.protocol
    
    // If accessing via localhost (local dev or port forwarding), use localhost:8000 for backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const detectedUrl = 'http://localhost:8000'
      console.log('[API Config] Auto-detected localhost, using:', detectedUrl)
      return detectedUrl
    }
    
    // If using ingress with /api path
    if (window.location.pathname.startsWith('/api')) {
      const ingressUrl = `${window.location.origin}/api`
      console.log('[API Config] Using ingress path:', ingressUrl)
      return ingressUrl
    }
    
    // In Kubernetes, try to use service DNS or construct from host
    if (isKubernetes()) {
      // For minikube NodePort access, try to detect from current URL
      // If frontend is on port 30082, backend should be on 30081
      const currentPort = window.location.port
      if (currentPort === '30082') {
        const nodePortUrl = `${protocol}//${hostname}:30081`
        console.log('[API Config] Using NodePort:', nodePortUrl)
        return nodePortUrl
      }
      // Otherwise try service DNS (for internal communication)
      const serviceUrl = 'http://newssummariser-service:8000'
      console.log('[API Config] Using Kubernetes service DNS:', serviceUrl)
      return serviceUrl
    }
  }
  
  // Default: local development
  const defaultUrl = 'http://localhost:8000'
  console.log('[API Config] Using default:', defaultUrl)
  return defaultUrl
}

export const API_URL = getApiUrl()

