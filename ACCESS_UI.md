# How to Access the UI in Minikube

## Method 1: Minikube Tunnel (Recommended for NodePort)

Run this in a **separate terminal** and keep it running:

```bash
minikube tunnel
```

**Note**: This command needs to run continuously. Keep the terminal open.

Then access:
- **Frontend**: `http://localhost:30082` or `http://127.0.0.1:30082`
- **Backend API**: `http://localhost:30081` or `http://127.0.0.1:30081`

## Method 2: Port Forwarding (Easier for Development)

This doesn't require a separate tunnel process:

```bash
# Forward frontend port
kubectl port-forward svc/newssummariser-fe-service 3000:80
```

Then access: **http://localhost:3000**

**Note**: This also needs to run continuously. Press `Ctrl+C` to stop.

## Method 3: Minikube Service Command

Opens the service in your default browser:

```bash
minikube service newssummariser-fe-service
```

## Quick Access Scripts

### Start Tunnel (run in background)

```bash
# Start tunnel in background
minikube tunnel > /tmp/minikube-tunnel.log 2>&1 &

# Check if it's running
ps aux | grep "minikube tunnel"

# Stop tunnel
pkill -f "minikube tunnel"
```

### Port Forward Script

Create `port-forward.sh`:

```bash
#!/bin/bash
echo "🚀 Starting port forwarding..."
echo "Access frontend at: http://localhost:3000"
echo "Press Ctrl+C to stop"
kubectl port-forward svc/newssummariser-fe-service 3000:80
```

## Troubleshooting

### Tunnel not working?

1. **Check if tunnel is running**:
   ```bash
   ps aux | grep "minikube tunnel"
   ```

2. **Restart tunnel**:
   ```bash
   pkill -f "minikube tunnel"
   minikube tunnel
   ```

3. **Check service**:
   ```bash
   kubectl get svc newssummariser-fe-service
   ```

### Port forwarding not working?

1. **Check if port is already in use**:
   ```bash
   lsof -i :3000
   ```

2. **Use different port**:
   ```bash
   kubectl port-forward svc/newssummariser-fe-service 8080:80
   ```

3. **Check pod status**:
   ```bash
   kubectl get pods -l app=newssummariser-fe
   ```

## Recommended Setup for Development

For easier development, use **port forwarding** (Method 2) as it's simpler and doesn't require sudo/admin access:

```bash
# Terminal 1: Port forward frontend
kubectl port-forward svc/newssummariser-fe-service 3000:80

# Terminal 2: Port forward backend (if needed)
kubectl port-forward svc/newssummariser-service 8000:8000
```

Then access:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

