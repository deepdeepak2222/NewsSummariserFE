# Fix API Error - Backend Connection

The "API Error" appears because the frontend cannot connect to the backend API. Here's how to fix it:

## Option 1: Deploy Backend to Minikube (Recommended)

If you haven't deployed the backend yet:

```bash
cd ../NewsSummariser
./k8s/deploy-minikube.sh YOUR_OPENAI_API_KEY
```

Then update the frontend ConfigMap to use the correct backend URL:

```bash
cd ../NewsSummariserFE
MINIKUBE_IP=$(minikube ip)
kubectl create configmap newssummariser-fe-config \
  --from-literal=config.js="window.__API_URL__='http://${MINIKUBE_IP}:30081';" \
  --dry-run=client -o yaml | kubectl apply -f -

# Restart frontend pods to pick up new config
kubectl rollout restart deployment/newssummariser-fe
```

## Option 2: Port Forward Backend (Quick Fix)

If backend is deployed but you're accessing frontend via port-forward:

```bash
# Terminal 1: Frontend port forward (already running)
kubectl port-forward svc/newssummariser-fe-service 3000:80

# Terminal 2: Backend port forward (NEW - run this)
kubectl port-forward svc/newssummariser-service 8000:8000
```

The frontend will automatically detect `localhost:3000` and use `localhost:8000` for the backend.

## Option 3: Run Backend Locally

If you want to run backend locally:

```bash
cd NewsSummariser
python api.py
```

The frontend (on localhost:3000) will automatically connect to backend on localhost:8000.

## Verify Backend is Running

```bash
# Check backend pods
kubectl get pods -l app=newssummariser

# Test backend health
curl http://localhost:8000/health
# Or if using minikube tunnel:
MINIKUBE_IP=$(minikube ip)
curl http://${MINIKUBE_IP}:30081/health
```

## Update Frontend Config (If Needed)

If you need to manually set the API URL, update the ConfigMap:

```bash
# For localhost (port forwarding)
kubectl create configmap newssummariser-fe-config \
  --from-literal=config.js="window.__API_URL__='http://localhost:8000';" \
  --dry-run=client -o yaml | kubectl apply -f -

# For minikube NodePort
MINIKUBE_IP=$(minikube ip)
kubectl create configmap newssummariser-fe-config \
  --from-literal=config.js="window.__API_URL__='http://${MINIKUBE_IP}:30081';" \
  --dry-run=client -o yaml | kubectl apply -f -

# Restart pods
kubectl rollout restart deployment/newssummariser-fe
```

## Quick Test

After setting up backend, refresh the frontend page. The "API Error" should change to "✅ API Connected".

