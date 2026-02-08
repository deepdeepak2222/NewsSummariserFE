#!/bin/bash

# Port forward script for easy access to frontend
# Usage: ./port-forward.sh [port]

PORT=${1:-3000}

echo "🚀 Starting port forwarding..."
echo "📍 Forwarding frontend service to port ${PORT}"
echo ""
echo "🌐 Access the UI at: http://localhost:${PORT}"
echo ""
echo "Press Ctrl+C to stop"
echo ""

kubectl port-forward svc/newssummariser-fe-service ${PORT}:80

