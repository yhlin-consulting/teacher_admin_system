# Teacher Admin System

A robust NodeJS API built with **NestJS**, **TypeORM**, and **MySQL**. This system provides teachers with administrative tools to manage student registrations, identify common students between classes, and filter recipients for notifications based on suspension status and mentions.

## Getting Started

### 1. Prerequisites
Ensure you have the following installed:
* **Docker** & **Docker Compose**
* **Node.js** (v18 or v22 recommended)
* **VS Code** (Recommended for DevContainer and linting support)

### 2. Environment Configuration
Create a `.env` file in the project root directory. This file is used by both the NestJS application and Docker Compose to manage sensitive credentials securely:

```env
MYSQL_DATABASE=mydb
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=appuser
MYSQL_PASSWORD=apppassword
MYSQL_ROOT_PASSWORD=secretpassword
```

## Installation
```
# Install project dependencies
npm install
```

## Run the Application
```
# Start MySQL via Docker-Compose
./builder.sh run

# Development mode (with auto-reload)
npm run start:dev

# Production mode
npm run build
npm run start
```

## API Documentation
Once the server is running, you can access the interactive Swagger UI to explore and test the endpoints (Register, Common Students, Suspend, and Retrieve for Notifications):

`http://localhost:3000/api`

## Development Environment

### VS Code & DevContainers
This project includes a .devcontainer configuration to ensure a consistent environment across different machines.

Extensions included: Prettier, ESLint, Microsoft Container/Docker Tools.

Features: Includes `docker-in-docker` for managing database containers from within the DevContainer.

Format on Save: Pre-configured in `.vscode/settings.json` to use Prettier and ESLint auto-fix.

### Manual Formatting & Linting
```
# Run Prettier to format code
npm run format

# Run ESLint to check for code quality issues
npm run lint
```

## Testing

The system includes comprehensive Unit and E2E (End-to-End) tests to ensure all user stories meet requirements. E2E tests are performed against a live MySQL instance to verify database constraints and relationships.

### Test Commands

| Command | Description |
| :--- | :--- |
| `npm run test` | Run unit tests across the entire project. |
| `npm run test:watch` | Run tests in watch mode for an active development workflow. |
| `npm run test:e2e` | Run End-to-End tests against the actual MySQL database. |
| `npm run test:cov` | Generate a test coverage report to ensure logic is fully exercised. |

### E2E Test Coverage
The E2E suite verifies the following functional requirements (User Stories):
1. **Student Registration:** Linking multiple students to a specific teacher.
2. **Common Students:** Retrieving students shared by a list of teachers.
3. **Suspension:** Marking specific students as suspended to prevent notifications.
4. **Notification Filtering:** Retrieving recipients by checking teacher registration and `@mentions`, while strictly excluding suspended students.

> **Pro Tip:** To ensure a clean state between test runs, the E2E suite uses a `beforeEach` hook to truncate tables. Use `npm run test:e2e -- --runInBand` if you need to execute tests sequentially.

## Project Structure

```
admin_app
├── src/
│   ├── students/          # Domain logic (Entities, Controllers, Services, DTOs)
│   ├── common/            # Shared Middleware (Logging), Filters, and Pipes
│   ├── app.module.ts      # Root module & Async Database configuration
│   └── main.ts            # Entry point, Swagger config, and Global Pipes
├── test/                  # E2E test suites (Supertest)
├── .devcontainer/         # Isolated development environment settings
├── .vscode/               # Editor settings (Format on Save, ESLint config)
├── builder.sh             # Helper script for common commands
└── docker-compose.yml     # Infrastructure (MySQL 8.0)
```