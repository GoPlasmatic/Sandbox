# Sandbox

## Quick Start
This guide provides the fastest way to get the Sandbox application up and running.

### Using Docker

Follow these steps to build and run the application using Docker Compose.
1. Set your API URL in a `.env` file:
```bash
cp .env.example .env
# Edit .env and set REFRAME_API_URL to your API server
```

2. Build and run with Docker Compose:
```bash
docker-compose up --build
```

The application will be available at http://localhost:3000

For detailed Docker configuration instructions, see [DOCKER_CONFIGURATION.md](./DOCKER_CONFIGURATION.md)

### Local Development

For instructions on setting up the project for local development, see the [website README](./website/README.md).
