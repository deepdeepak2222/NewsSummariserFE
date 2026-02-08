#!/bin/bash

# Build React frontend using Docker (no local Node.js required)
# Usage: ./build-with-docker.sh [tag] [api-url]

set -e

IMAGE_NAME="newssummariser-fe"
REGISTRY="deepdeepak2222"
TAG=${1:-latest}
API_URL=${2:-http://newssummariser-service:8000}

echo "🐳 Building React frontend with Docker..."
echo "API URL: ${API_URL}"

# Build the image
docker build --build-arg VITE_API_URL="${API_URL}" -t ${IMAGE_NAME}:${TAG} .

echo "✅ Build complete!"
echo ""
echo "To test locally:"
echo "  docker run -p 3000:80 ${IMAGE_NAME}:${TAG}"
echo ""
echo "To push to registry:"
echo "  docker tag ${IMAGE_NAME}:${TAG} ${REGISTRY}/${IMAGE_NAME}:${TAG}"
echo "  docker push ${REGISTRY}/${IMAGE_NAME}:${TAG}"

