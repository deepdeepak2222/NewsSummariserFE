// Runtime configuration for API URL
// This file can be replaced at runtime (e.g., via ConfigMap in Kubernetes)
// or modified by nginx based on environment

// Set API URL based on environment
(function() {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // PRIORITY 1: For local development (localhost), ALWAYS use localhost:8000
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    window.__API_URL__ = 'http://localhost:8000';
    console.log('[Runtime Config] Detected localhost, using:', window.__API_URL__);
    return;
  }
  
  // PRIORITY 2: If accessing via ingress with /api path
  if (window.location.pathname.startsWith('/api')) {
    window.__API_URL__ = window.location.origin + '/api';
    console.log('[Runtime Config] Using ingress path:', window.__API_URL__);
    return;
  }
  
  // PRIORITY 3: For Kubernetes NodePort access, try to detect minikube IP
  // This is a fallback - ConfigMap should override this in K8s
  const currentPort = window.location.port;
  if (currentPort === '30082') {
    // Frontend on 30082, backend should be on 30081
    window.__API_URL__ = protocol + '//' + hostname + ':30081';
    console.log('[Runtime Config] Using NodePort:', window.__API_URL__);
    return;
  }
  
  // Default fallback - should not use Kubernetes service DNS from browser!
  // Use localhost for local dev, or let ConfigMap override in K8s
  window.__API_URL__ = 'http://localhost:8000';
  console.log('[Runtime Config] Using default:', window.__API_URL__);
})();

