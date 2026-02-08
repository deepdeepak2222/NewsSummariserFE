#!/bin/bash

# Update API URL in ConfigMap based on access method
# Usage: ./update-api-url.sh [port-forward|nodeport]

set -e

ACCESS_METHOD=${1:-port-forward}

echo "🔧 Updating API URL configuration..."

if [ "$ACCESS_METHOD" = "port-forward" ]; then
    echo "📍 Setting API URL for port-forwarding (localhost:8000)..."
    kubectl create configmap newssummariser-fe-config \
      --from-literal=config.js="window.__API_URL__='http://localhost:8000';" \
      --dry-run=client -o yaml | kubectl apply -f -
    echo "✅ Updated to use: http://localhost:8000"
elif [ "$ACCESS_METHOD" = "nodeport" ]; then
    MINIKUBE_IP=$(minikube ip)
    echo "📍 Setting API URL for NodePort (${MINIKUBE_IP}:30081)..."
    kubectl create configmap newssummariser-fe-config \
      --from-literal=config.js="window.__API_URL__='http://${MINIKUBE_IP}:30081';" \
      --dry-run=client -o yaml | kubectl apply -f -
    echo "✅ Updated to use: http://${MINIKUBE_IP}:30081"
else
    echo "❌ Invalid access method. Use 'port-forward' or 'nodeport'"
    exit 1
fi

echo ""
echo "🔄 Restarting frontend pods..."
kubectl rollout restart deployment/newssummariser-fe
kubectl rollout status deployment/newssummariser-fe --timeout=60s

echo ""
echo "✅ Done! Refresh your browser to see the changes."

