# Sandbox

Reframe API documentation and interactive playground built with mdbook.

## Quick Start

### Using Docker

Build and run with Docker Compose:
```bash
docker-compose up --build
```

The documentation will be available at http://localhost:80

For detailed Docker configuration instructions, see [DOCKER_CONFIGURATION.md](./DOCKER_CONFIGURATION.md)

### Local Development

1. Install mdbook (if not installed):
```bash
cargo install mdbook
```

2. Start development server:
```bash
cd docs
mdbook serve
```

The documentation will be available at http://localhost:3000

3. Build for production:
```bash
cd docs
mdbook build
```