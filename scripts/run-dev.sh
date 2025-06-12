#!/bin/bash

cleanup() {
  echo "Shutting down docker services..."

  # Stop Running Containers
  (cd "${PROJECT_ROOT}" && \
  # Start Containers
  npx dotenvx run -f .env.development -- docker compose \
  -f "./docker/compose/docker-compose.dev.yaml" \
  down --remove-orphans
)
}
trap cleanup EXIT

# Start containers db and minio services
echo "Staring development containers, Please Wait..."
(cd "${PROJECT_ROOT}" && \
  # Start Containers
  npx dotenvx run -f .env.development -- docker compose \
  -f "./docker/compose/docker-compose.dev.yaml" \
  up -d
)

# Retrieve the absolute path of the script and project root so this can be run anywhere
SCRIPT_DIR="$(cd $(dirname $BASH_SOURCE) && pwd)"
PROJECT_ROOT="$(dirname $SCRIPT_DIR)"
DB_MIGRATED_MARKER_NAME=".test-db-migrated"

# Start frontend and backend
(cd "${PROJECT_ROOT}"/server && npm run migrate:dev -- deploy)
if [ $? -eq 1 ]; then
  echo "Failed to migrate development database"
  exit 1
fi

# Delete test db migration marker files (so the test script runs them again when trying to run them)
rm -f "${SCRIPT_DIR}/marker/${DB_MIGRATED_MARKER_NAME}"

npx concurrently "cd server && npm run dev" "cd client && npm run dev"
