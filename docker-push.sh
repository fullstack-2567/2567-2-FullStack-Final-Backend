#!/bin/bash

# Check if version argument is provided
if [ -z "$1" ]; then
  echo "Error: Please provide a version tag (e.g., ./docker-push.sh v2)"
  exit 1
fi

# Set the version tag from the argument
VERSION=$1

# Push the tagged Docker image to the registry
docker push registry.nipa.cloud/kmitl-registry/2567-2-fullstack-final-backend:$VERSION

# Output the result
echo "Docker image 'registry.nipa.cloud/kmitl-registry/2567-2-fullstack-final-backend:$VERSION' has been pushed successfully."