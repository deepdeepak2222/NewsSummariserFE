# Troubleshooting UI Access Issues

## Quick Diagnostics

Run these commands to diagnose the issue:

### 1. Check Pod Status

```bash
kubectl get pods -l app=newssummariser-fe
```

**Expected**: Pods should be in `Running` state. If they're `CrashLoopBackOff` or `Error`, check logs.

### 2. Check Pod Logs

```bash
kubectl logs -l app=newssummariser-fe --tail=50
```

Look for errors like:
- Image pull errors
- Nginx configuration errors
- Port binding issues

### 3. Check Service

```bash
kubectl get svc newssummariser-fe-service
kubectl describe svc newssummariser-fe-service
```

**Expected**: Service should show `NodePort` type with port `80:30082/TCP`

### 4. Check Pod Details

```bash
kubectl describe pod -l app=newssummariser-fe
```

Look for:
- Events showing errors
- Image pull issues
- Resource constraints

### 5. Verify Minikube IP

```bash
minikube ip
```

Make sure you're accessing: `http://$(minikube ip):30082`

### 6. Test from Inside Cluster

```bash
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- curl http://newssummariser-fe-service/health
```

## Common Issues and Solutions

### Issue 1: Pods Not Starting

**Symptoms**: Pods in `CrashLoopBackOff` or `Error` state

**Solution**:
```bash
# Check logs
kubectl logs -l app=newssummariser-fe

# Common causes:
# - Image not found: Rebuild and push image
# - ConfigMap mount error: Check ConfigMap exists
# - Port conflict: Check if port 80 is available
```

### Issue 2: Cannot Access via Browser

**Symptoms**: Browser shows "This site can't be reached" or timeout

**Solutions**:

1. **Verify you're using the correct URL**:
   ```bash
   MINIKUBE_IP=$(minikube ip)
   echo "Access at: http://${MINIKUBE_IP}:30082"
   ```

2. **Check if minikube service is accessible**:
   ```bash
   minikube service newssummariser-fe-service --url
   ```

3. **Try port forwarding**:
   ```bash
   kubectl port-forward svc/newssummariser-fe-service 3000:80
   ```
   Then access at `http://localhost:3000`

4. **Check firewall/network**:
   - Make sure port 30082 is not blocked
   - Try accessing from a different network

### Issue 3: 502 Bad Gateway or 503 Service Unavailable

**Symptoms**: Page loads but shows error

**Solutions**:

1. **Check if pods are ready**:
   ```bash
   kubectl get pods -l app=newssummariser-fe
   ```
   Pods should show `1/1` in READY column

2. **Check readiness probe**:
   ```bash
   kubectl describe pod -l app=newssummariser-fe | grep -A 5 "Readiness"
   ```

3. **Test health endpoint**:
   ```bash
   curl http://$(minikube ip):30082/health
   ```
   Should return "healthy"

### Issue 4: Frontend Shows "API Error"

**Symptoms**: UI loads but shows "API Error" in header

**Solutions**:

1. **Check backend is running**:
   ```bash
   kubectl get pods -l app=newssummariser
   curl http://$(minikube ip):30081/health
   ```

2. **Check API URL in ConfigMap**:
   ```bash
   kubectl get configmap newssummariser-fe-config -o yaml
   ```
   Should have correct backend URL

3. **Update ConfigMap if needed**:
   ```bash
   MINIKUBE_IP=$(minikube ip)
   kubectl create configmap newssummariser-fe-config \
     --from-literal=config.js="window.__API_URL__='http://${MINIKUBE_IP}:30081';" \
     --dry-run=client -o yaml | kubectl apply -f -
   
   # Restart pods to pick up new config
   kubectl rollout restart deployment/newssummariser-fe
   ```

### Issue 5: Image Pull Errors

**Symptoms**: Pods show `ImagePullBackOff` or `ErrImagePull`

**Solutions**:

1. **Check if image exists**:
   ```bash
   docker images | grep newssummariser-fe
   ```

2. **Rebuild and push**:
   ```bash
   cd NewsSummariserFE
   ./build-and-push.sh
   ```

3. **For local testing, use local image**:
   ```bash
   # Load image into minikube
   minikube image load newssummariser-fe:latest
   
   # Update deployment to use local image
   kubectl set image deployment/newssummariser-fe frontend=newssummariser-fe:latest
   ```

### Issue 6: Nginx Configuration Error

**Symptoms**: Pods start but return 502/503

**Solutions**:

1. **Check nginx logs**:
   ```bash
   kubectl exec -it $(kubectl get pod -l app=newssummariser-fe -o jsonpath='{.items[0].metadata.name}') -- nginx -t
   ```

2. **Verify nginx.conf is correct**:
   Check that `nginx.conf` exists and is properly formatted

## Quick Fixes

### Restart Everything

```bash
# Restart frontend
kubectl rollout restart deployment/newssummariser-fe

# Wait for rollout
kubectl rollout status deployment/newssummariser-fe

# Check status
kubectl get pods -l app=newssummariser-fe
```

### Delete and Redeploy

```bash
# Delete frontend
kubectl delete -f k8s/deployment.yaml
kubectl delete -f k8s/service-minikube.yaml

# Redeploy
./deploy-minikube.sh
```

### Use Port Forwarding (Quick Test)

```bash
# Forward frontend port
kubectl port-forward svc/newssummariser-fe-service 3000:80

# In another terminal, test
curl http://localhost:3000/health

# Access in browser
open http://localhost:3000
```

## Still Having Issues?

1. **Check all resources**:
   ```bash
   kubectl get all -l app=newssummariser-fe
   ```

2. **Check events**:
   ```bash
   kubectl get events --sort-by='.lastTimestamp' | tail -20
   ```

3. **Check minikube status**:
   ```bash
   minikube status
   ```

4. **Restart minikube** (last resort):
   ```bash
   minikube stop
   minikube start
   ```

