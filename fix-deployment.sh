#!/bin/bash

# Quick fix script to update deployment with ConfigMap mount

set -e

echo "🔧 Fixing frontend deployment..."

# Get minikube IP
MINIKUBE_IP=$(minikube ip)
echo "📍 Minikube IP: ${MINIKUBE_IP}"

# Ensure ConfigMap exists
echo "📝 Ensuring ConfigMap exists..."
kubectl create configmap newssummariser-fe-config \
  --from-literal=config.js="window.__API_URL__='http://${MINIKUBE_IP}:30081';" \
  --dry-run=client -o yaml | kubectl apply -f -

# Apply deployment with ConfigMap
echo "📦 Applying deployment with ConfigMap mount..."
kubectl apply -f k8s/deployment-with-configmap.yaml

# Wait for rollout
echo "⏳ Waiting for rollout..."
kubectl rollout status deployment/newssummariser-fe --timeout=120s

echo ""
echo "✅ Fixed! Check status:"
echo "   kubectl get pods -l app=newssummariser-fe"
echo ""
echo "🌐 Access at: http://${MINIKUBE_IP}:30082"

