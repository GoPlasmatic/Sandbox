# Sandbox

## Quick Start

### Using Docker

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

See the [website README](./website/README.md) for local development instructions.