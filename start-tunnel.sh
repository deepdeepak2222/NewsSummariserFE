#!/bin/bash

# Start minikube tunnel in background
# Usage: ./start-tunnel.sh

echo "🚇 Starting minikube tunnel..."
echo "This will run in the background"
echo ""

# Check if tunnel is already running
if pgrep -f "minikube tunnel" > /dev/null; then
    echo "⚠️  Minikube tunnel is already running"
    echo "To stop it, run: pkill -f 'minikube tunnel'"
    exit 1
fi

# Start tunnel in background
nohup minikube tunnel > /tmp/minikube-tunnel.log 2>&1 &
TUNNEL_PID=$!

echo "✅ Tunnel started (PID: ${TUNNEL_PID})"
echo ""
echo "📋 Access URLs:"
MINIKUBE_IP=$(minikube ip)
echo "   Frontend: http://${MINIKUBE_IP}:30082"
echo "   Backend:  http://${MINIKUBE_IP}:30081"
echo ""
echo "📝 Logs: tail -f /tmp/minikube-tunnel.log"
echo "🛑 Stop: pkill -f 'minikube tunnel'"
echo ""

