# Kubernetes Deployment Guide

This directory contains Kubernetes configuration files for deploying the News Summarizer frontend and backend to minikube.

## Prerequisites

- Minikube installed and running
- kubectl configured to use minikube
- Docker images built and pushed to your registry

## Quick Start

### 1. Start Minikube

```bash
minikube start
```

### 2. Deploy Backend

```bash
cd ../../NewsSummariser/k8s
kubectl apply -f deployment.yaml
kubectl apply -f service-minikube.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
```

### 3. Deploy Frontend

```bash
cd ../../NewsSummariserFE/k8s
kubectl apply -f deployment.yaml
kubectl apply -f service-minikube.yaml
```

### 4. (Optional) Deploy Ingress

If you have an ingress controller installed:

```bash
# For separate ingress
kubectl apply -f ingress.yaml

# Or for combined ingress (recommended)
kubectl apply -f ingress-combined.yaml
```

## Access the Application

### Using NodePort

- **Frontend**: `http://$(minikube ip):30082`
- **Backend API**: `http://$(minikube ip):30081`

### Using Ingress

1. Add to `/etc/hosts`:
   ```
   $(minikube ip) news.local
   ```

2. Access at: `http://news.local`

## Environment Variables

The frontend deployment uses `VITE_API_URL` environment variable. Update it in `deployment.yaml` based on your setup:

- **For NodePort**: `http://$(minikube ip):30081`
- **For Ingress**: `http://news.local/api`
- **For Service DNS**: `http://newssummariser-service:8000` (internal)

## Troubleshooting

### Check Pod Status

```bash
kubectl get pods -l app=newssummariser-fe
kubectl get pods -l app=newssummariser
```

### View Logs

```bash
kubectl logs -l app=newssummariser-fe
kubectl logs -l app=newssummariser
```

### Check Services

```bash
kubectl get svc
```

### Port Forward (for testing)

```bash
# Frontend
kubectl port-forward svc/newssummariser-fe-service 3000:80

# Backend
kubectl port-forward svc/newssummariser-service 8000:8000
```

## Updating Deployments

After pushing new images:

```bash
kubectl rollout restart deployment/newssummariser-fe
kubectl rollout restart deployment/newssummariser
```

## Cleanup

```bash
# Delete frontend
kubectl delete -f k8s/deployment.yaml
kubectl delete -f k8s/service-minikube.yaml

# Delete backend (from NewsSummariser/k8s)
kubectl delete -f deployment.yaml
kubectl delete -f service-minikube.yaml
```

