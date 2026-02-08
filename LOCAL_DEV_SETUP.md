# Local Development Setup

## Quick Fix for API Error

When running `npm run dev` locally, create a `.env` file:

```bash
cd NewsSummariserFE
echo "VITE_API_URL=http://localhost:8000" > .env
```

Then restart your dev server:

```bash
# Stop current dev server (Ctrl+C)
npm run dev
```

## Verify Setup

1. **Backend is running** (port-forwarded):
   ```bash
   kubectl port-forward svc/newssummariser-service 8000:8000
   ```

2. **Frontend is running**:
   ```bash
   npm run dev
   ```

3. **Check browser console**:
   - Open browser DevTools (F12)
   - Look for `[API Config]` logs to see which URL is being used
   - Should show: `[API Config] Using build-time env var: http://localhost:8000`

4. **Test backend directly**:
   ```bash
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"healthy"}`

## Troubleshooting

### Still seeing API Error?

1. **Check browser console** for errors
2. **Verify backend is accessible**:
   ```bash
   curl http://localhost:8000/health
   ```
3. **Check CORS** - Backend should allow `http://localhost:3000`
4. **Restart dev server** after creating `.env` file

### Backend not accessible?

Make sure backend port-forward is running:
```bash
kubectl port-forward svc/newssummariser-service 8000:8000
```

Keep this terminal open while developing.

