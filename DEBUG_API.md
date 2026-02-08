# Debug API Connection Issues

## Steps to Debug

1. **Open Browser Console** (F12 → Console tab)

2. **Look for these logs:**
   - `[API Config] Using build-time env var: http://localhost:8000`
   - `[App] Using API URL: http://localhost:8000`
   - `[App] Checking health at: http://localhost:8000/health`
   - `[API] Checking health at: http://localhost:8000/health`

3. **Check for errors:**
   - CORS errors
   - Network errors
   - Timeout errors

## Common Issues

### Issue 1: Wrong API URL in console

If you see a different URL (like `http://192.168.49.2:30081`), the .env file isn't being read.

**Fix:**
```bash
# Make sure .env file exists
cat .env

# Should show: VITE_API_URL=http://localhost:8000

# Restart dev server completely
# Stop with Ctrl+C, then:
npm run dev
```

### Issue 2: CORS Error

If you see CORS errors in console, check backend CORS settings.

**Fix:** Backend should allow `http://localhost:3000` (it does by default with `allow_origins=["*"]`)

### Issue 3: Connection Refused

If you see "Connection refused" or "Network Error":

**Check:**
```bash
# Is backend port-forward running?
ps aux | grep "kubectl port-forward"

# Test backend directly
curl http://localhost:8000/health
```

**Fix:**
```bash
# Start backend port-forward in a separate terminal
kubectl port-forward svc/newssummariser-service 8000:8000
```

### Issue 4: Timeout

If health check times out:

**Fix:** Backend might be slow. The timeout is now 5 seconds. Check backend logs:
```bash
kubectl logs -l app=newssummariser --tail=50
```

## Quick Test

Run this in browser console:
```javascript
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

Should return: `{status: "healthy"}`

If this works but the app doesn't, it's a frontend config issue.
If this fails, it's a backend/network issue.

