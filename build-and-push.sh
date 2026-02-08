#!/bin/bash

# Build and push Docker image for frontend
# Usage: ./build-and-push.sh [tag] [api-url]

set -e

IMAGE_NAME="newssummariser-fe"
REGISTRY="deepdeepak2222"
TAG=${1:-latest}
API_URL=${2:-http://newssummariser-service:8000}
FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}:${TAG}"

echo "Building Docker image: ${FULL_IMAGE_NAME}"
echo "API URL: ${API_URL}"

# Build the image with API URL
docker build --build-arg VITE_API_URL="${API_URL}" -t ${IMAGE_NAME}:${TAG} .

# Tag for registry
docker tag ${IMAGE_NAME}:${TAG} ${FULL_IMAGE_NAME}

echo "Pushing to registry: ${FULL_IMAGE_NAME}"
docker push ${FULL_IMAGE_NAME}

echo "✅ Successfully built and pushed ${FULL_IMAGE_NAME}"
echo ""
echo "To deploy to minikube:"
echo "  kubectl set image deployment/newssummariser-fe frontend=${FULL_IMAGE_NAME} -n default"
echo "  kubectl rollout restart deployment/newssummariser-fe"
echo ""
echo "Note: For NodePort access, you may need to rebuild with:"
echo "  ./build-and-push.sh latest http://\$(minikube ip):30081"

