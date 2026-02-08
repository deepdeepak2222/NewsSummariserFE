# News Summarizer Frontend

Modern React frontend for the News Summarizer application. Built with Vite, React, and designed to be fully responsive across all devices.

## Features

- 📱 **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- 🌐 **Multi-language Support**: Hindi and English
- 🔊 **Text-to-Speech**: Built-in narration using Web Speech API
- ⚡ **Fast**: Built with Vite for optimal performance
- 🎯 **Accessible**: WCAG compliant with proper focus management

## Prerequisites

- **Option 1**: Node.js 18+ and npm (for local development)
- **Option 2**: Docker (for building without local Node.js)
- Kubernetes/minikube (for deployment)

## Installation

### If you have Node.js installed:

```bash
npm install
```

### If you DON'T have Node.js installed:

You can build using Docker without installing Node.js locally:

```bash
# Build with Docker
./build-with-docker.sh

# Or use the regular build script (requires Node.js)
./build-and-push.sh
```

See `INSTALL_NODE.md` for Node.js installation options.

## Local Development

### With Node.js

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Docker Build (No Local Node.js Required)

### Build Docker Image

```bash
# Build with default API URL
./build-with-docker.sh

# Build with custom API URL
./build-with-docker.sh latest http://your-api-url:8000
```

### Run Container Locally

```bash
docker run -p 3000:80 newssummariser-fe:latest
```

Access at `http://localhost:3000`

## Kubernetes Deployment (Minikube)

### Build and Push Image

```bash
# Build image (with Docker, no Node.js needed)
./build-with-docker.sh

# Tag for your registry (replace with your registry)
docker tag newssummariser-fe:latest deepdeepak2222/newssummariser-fe:latest

# Push to registry
docker push deepdeepak2222/newssummariser-fe:latest
```

### Deploy to Minikube

```bash
# Deploy (automatically configures API URL)
./deploy-minikube.sh
```

### Access the Application

- **NodePort**: `http://$(minikube ip):30082`
- **Ingress**: `http://news.local` (add to `/etc/hosts`)

### Check Status

```bash
kubectl get pods -l app=newssummariser-fe
kubectl get svc newssummariser-fe-service
```

## Project Structure

```
NewsSummariserFE/
├── src/
│   ├── components/      # React components
│   │   ├── Header.jsx
│   │   ├── NewsForm.jsx
│   │   ├── NewsSummary.jsx
│   │   └── ArticlesList.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── App.css
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── k8s/                 # Kubernetes configs
├── public/              # Static assets
├── Dockerfile
├── nginx.conf
├── vite.config.js
├── build-with-docker.sh # Build without Node.js
└── package.json
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### npm not found

If you don't have Node.js installed:
1. Install Node.js (see `INSTALL_NODE.md`)
2. Or use Docker build: `./build-with-docker.sh`

### Frontend can't connect to backend

1. Check API URL configuration in ConfigMap
2. Verify backend is running: `kubectl get pods -l app=newssummariser`
3. Check CORS settings in backend

### Build errors

- Ensure you're using Node.js 18+ (if building locally)
- Or use Docker build instead
- Check Docker daemon is running

## License

MIT
