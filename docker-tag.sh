#!/bin/bash

# Check if version argument is provided
if [ -z "$1" ]; then
  echo "Error: Please provide a version tag (e.g., ./docker-tag.sh v2)"
  exit 1
fi

# Set the version tag from the argument
VERSION=$1

# Tag the Docker image with the specified version
docker tag 2567-2-fullstack-final-backend:$VERSION registry.nipa.cloud/kmitl-registry/2567-2-fullstack-final-backend:$VERSION

# Output the result
echo "Docker image '2567-2-fullstack-final-backend:$VERSION' has been tagged as 'registry.nipa.cloud/kmitl-registry/2567-2-fullstack-final-backend:$VERSION'"