#!/bin/bash

# Port forward both frontend and backend for easy local development
# Usage: ./port-forward-both.sh

echo "🚀 Starting port forwarding for frontend and backend..."
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping port forwarding..."
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start frontend port forward in background
kubectl port-forward svc/newssummariser-fe-service 3000:80 > /tmp/frontend-pf.log 2>&1 &
FRONTEND_PID=$!

# Start backend port forward in background
kubectl port-forward svc/newssummariser-service 8000:8000 > /tmp/backend-pf.log 2>&1 &
BACKEND_PID=$!

echo "✅ Port forwarding started"
echo "   Frontend PID: $FRONTEND_PID"
echo "   Backend PID: $BACKEND_PID"
echo ""
echo "📋 Logs:"
echo "   Frontend: tail -f /tmp/frontend-pf.log"
echo "   Backend:  tail -f /tmp/backend-pf.log"
echo ""

# Wait for both processes
wait $FRONTEND_PID $BACKEND_PID

