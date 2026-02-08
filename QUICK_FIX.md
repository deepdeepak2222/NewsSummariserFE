# Quick Fix Guide - UI Not Accessible

## Step 1: Check Pod Status

Run this command first:

```bash
kubectl get pods -l app=newssummariser-fe
```

**What to look for:**
- ✅ `Running` - Pods are healthy
- ❌ `CrashLoopBackOff` - Pods are crashing (check logs)
- ❌ `ImagePullBackOff` - Can't pull image
- ❌ `Pending` - Pods not starting

## Step 2: Check Logs

```bash
kubectl logs -l app=newssummariser-fe --tail=50
```

Look for errors.

## Step 3: Quick Fixes

### Fix A: Update Deployment with ConfigMap

If pods are running but UI doesn't work, the ConfigMap might not be mounted:

```bash
cd NewsSummariserFE
./fix-deployment.sh
```

### Fix B: Use Port Forwarding (Quick Test)

Test if the app works via port forwarding:

```bash
kubectl port-forward svc/newssummariser-fe-service 3000:80
```

Then open `http://localhost:3000` in your browser.

### Fix C: Check Backend

Make sure backend is running:

```bash
# Check backend pods
kubectl get pods -l app=newssummariser

# Test backend API
MINIKUBE_IP=$(minikube ip)
curl http://${MINIKUBE_IP}:30081/health
```

### Fix D: Restart Deployment

```bash
kubectl rollout restart deployment/newssummariser-fe
kubectl rollout status deployment/newssummariser-fe
```

## Step 4: Verify Access

```bash
MINIKUBE_IP=$(minikube ip)
echo "Frontend: http://${MINIKUBE_IP}:30082"
echo "Backend: http://${MINIKUBE_IP}:30081"

# Test health endpoint
curl http://${MINIKUBE_IP}:30082/health
```

Should return: `healthy`

## Common Issues

### Issue: "This site can't be reached"

**Solution:**
1. Verify minikube IP: `minikube ip`
2. Make sure you're using the correct port: `30082`
3. Try port forwarding instead

### Issue: Pods crashing

**Solution:**
```bash
# Check what's wrong
kubectl describe pod -l app=newssummariser-fe

# Check logs
kubectl logs -l app=newssummariser-fe
```

### Issue: 502 Bad Gateway

**Solution:**
- Pods might not be ready
- Check readiness probe: `kubectl describe pod -l app=newssummariser-fe | grep Readiness`
- Wait a bit longer for pods to become ready

### Issue: UI loads but shows "API Error"

**Solution:**
- Backend might not be running
- Check backend: `kubectl get pods -l app=newssummariser`
- Update ConfigMap with correct API URL

## Still Not Working?

Run full diagnostics:

```bash
# Check everything
kubectl get all -l app=newssummariser-fe

# Check events
kubectl get events --sort-by='.lastTimestamp' | grep newssummariser-fe | tail -10

# Check service
kubectl describe svc newssummariser-fe-service
```

