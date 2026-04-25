#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Define the path to the compose file
COMPOSE_FILE="docker-compose.yml"

case "$1" in
  run)
    echo "🚀 Starting containers..."
    docker-compose -f $COMPOSE_FILE up -d
    ;;
  down)
    echo "🛑 Stopping containers..."
    docker-compose -f $COMPOSE_FILE down
    ;;
  down-db)
    echo "🛑 Stopping containers and remove db volums..."
    docker-compose -f $COMPOSE_FILE down -v
    ;;
  logs)
    echo "📋 Showing logs..."
    docker-compose -f $COMPOSE_FILE logs -f
    ;;
  db-shell)
    echo "🐚 Connecting to database shell..."
    echo "To exit the shell, enter exit; or quit; (Remember to enter the semi-colon)"
    echo "Alternatively, enter Ctrl + D"
    # Note: Use the service name defined in your compose file (e.g., 'db')
    docker-compose -f $COMPOSE_FILE exec db mysql -u root -p
    ;;
  status)
    echo "🔍 Checking container status..."
    docker-compose -f $COMPOSE_FILE ps
    ;;
  *)
    echo "Usage: ./builder.sh {run|down|logs|db-shell|status}"
    exit 1
    ;;
esac