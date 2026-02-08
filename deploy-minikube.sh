#!/bin/bash

# Deploy frontend to minikube
# Usage: ./deploy-minikube.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="${SCRIPT_DIR}/k8s"

echo "🚀 Deploying News Summarizer Frontend to Minikube..."

# Check if minikube is running
if ! minikube status > /dev/null 2>&1; then
    echo "❌ Minikube is not running. Please start it first:"
    echo "   minikube start"
    exit 1
fi

# Get minikube IP for API URL configuration
MINIKUBE_IP=$(minikube ip)
echo "📍 Minikube IP: ${MINIKUBE_IP}"

# Update ConfigMap with minikube IP
echo "📝 Creating/updating ConfigMap with API URL..."
cat > /tmp/fe-configmap.yaml <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: newssummariser-fe-config
  labels:
    app: newssummariser-fe
data:
  config.js: |
    (function() {
      // API URL for NodePort access
      window.__API_URL__ = 'http://${MINIKUBE_IP}:30081';
    })();
EOF
kubectl apply -f /tmp/fe-configmap.yaml
rm /tmp/fe-configmap.yaml

# Apply Kubernetes manifests
echo "📦 Applying Kubernetes manifests..."
# Use deployment with ConfigMap if it exists, otherwise use regular deployment
if [ -f "${K8S_DIR}/deployment-with-configmap.yaml" ]; then
    kubectl apply -f ${K8S_DIR}/deployment-with-configmap.yaml
else
    kubectl apply -f ${K8S_DIR}/deployment.yaml
fi
kubectl apply -f ${K8S_DIR}/service-minikube.yaml

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl rollout status deployment/newssummariser-fe --timeout=120s

# Get service info
echo ""
echo "✅ Deployment successful!"
echo ""
echo "📋 Service Information:"
kubectl get svc newssummariser-fe-service

echo ""
echo "🌐 Access the application:"
echo ""
echo "Option 1: Use minikube tunnel (run in separate terminal):"
echo "   minikube tunnel"
echo "   Then access: http://${MINIKUBE_IP}:30082"
echo ""
echo "Option 2: Use port forwarding (easier):"
echo "   kubectl port-forward svc/newssummariser-fe-service 3000:80"
echo "   Then access: http://localhost:3000"
echo ""
echo "Option 3: Use helper script:"
echo "   ./port-forward.sh"
echo ""
echo "💡 The frontend is configured to use the backend API at: http://${MINIKUBE_IP}:30081"
echo ""
echo "📊 Check status:"
echo "   kubectl get pods -l app=newssummariser-fe"
echo "   kubectl logs -l app=newssummariser-fe"
echo ""
echo "📖 See ACCESS_UI.md for more details"

