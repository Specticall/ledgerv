#!/bin/bash

# Retrieve the absolute path of the script and project root so this can be run anywhere
SCRIPT_DIR="$(cd $(dirname $BASH_SOURCE) && pwd)"
PROJECT_ROOT="$(dirname $SCRIPT_DIR)"

TEST_DB_SERVICE_NAME="db_test"
TEST_DB_STARTED=$(docker ps --format '{{.Names}}' | grep "${TEST_DB_SERVICE_NAME}")

# Marker file is used to test if the database has been migrated or not without having to hit the database API that takes time
DB_MIGRATED_MARKER_NAME=".test-db-migrated"

# 1. Run test containers5
if [ "$TEST_DB_STARTED" != "$TEST_DB_SERVICE_NAME" ]; then
  echo "Staring Test Container, Please Wait..."
  (cd "${PROJECT_ROOT}" && \
    # Stop Previously Running Containers (If they exist)
    npx dotenvx run -f .env.test -- docker compose \
    -f "./docker/compose/docker-compose.test.yaml" \
    down --remove-orphans && \
    # Start Containers
    npx dotenvx run -f .env.test -- docker compose \
    -f "./docker/compose/docker-compose.test.yaml" \
    up -d
  )

  # Hack : assumes if the container needs to be started the database has not been migrated
  rm -f "${SCRIPT_DIR}/marker/${DB_MIGRATED_MARKER_NAME}"
else
  echo "Container already started... Skipping Database Migration"
fi


# 2. Perform test database migration
if [ ! -f "${SCRIPT_DIR}/marker/${DB_MIGRATED_MARKER_NAME}" ]; then
  echo "Migrating Test Database"
  (cd "${PROJECT_ROOT}/server" \
  && npx prisma generate \
  && npm run --silent migrate:test -- deploy --schema='./src/models/main.prisma')

  # 2.5 Create a marker file to know that the database has been migrated for faster tests
  (cd "${SCRIPT_DIR}/marker" && touch ${DB_MIGRATED_MARKER_NAME})
fi

#3. Run the tests
echo "Running tests..."
(cd "${PROJECT_ROOT}/server" && npm run --silent test)
