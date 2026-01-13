# Docker Configuration Guide

## Overview

This Docker setup builds and serves the mdbook documentation site using nginx.

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d --build
```

The documentation will be available at `http://localhost:80`

### Using Docker Directly

```bash
# Build the image
docker build -t reframe-docs .

# Run the container
docker run -p 80:80 reframe-docs
```

## Configuration

### Changing the Port

To run on a different port, modify the `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Maps host port 8080 to container port 80
```

Or with Docker directly:

```bash
docker run -p 8080:80 reframe-docs
```

### API URL Configuration

The interactive playground widgets connect to the Reframe API. By default, they connect to `http://localhost:3000`.

Users can change this in the browser using the API URL input field in the playground.

To set a different default API URL, edit `docs/theme/reframe-playground.js`:

```javascript
const DEFAULT_API_URL = 'https://your-api-server.com';
```

Then rebuild the Docker image.

## Rebuilding

If you make changes to the documentation, rebuild the image:

```bash
# With docker-compose
docker-compose down
docker-compose up --build

# Or force a fresh build
docker-compose build --no-cache
docker-compose up
```

## Health Check

The container includes a health check that verifies nginx is serving content:

```bash
# Check container health
docker ps
# Look for "(healthy)" in the STATUS column
```

## Production Deployment

For production deployments:

1. Build the image:
   ```bash
   docker build -t reframe-docs:latest .
   ```

2. Push to your registry:
   ```bash
   docker tag reframe-docs:latest your-registry/reframe-docs:latest
   docker push your-registry/reframe-docs:latest
   ```

3. Deploy on your VM:
   ```bash
   docker pull your-registry/reframe-docs:latest
   docker run -d -p 80:80 --restart unless-stopped your-registry/reframe-docs:latest
   ```

## Troubleshooting

### Container Not Starting

Check the logs:
```bash
docker-compose logs
# or
docker logs <container_id>
```

### Build Failures

If mdbook installation fails, try building with no cache:
```bash
docker-compose build --no-cache
```

### nginx Configuration Issues

The nginx config is embedded in the Dockerfile. To customize it, create a separate `nginx.conf` file and copy it in the Dockerfile:

```dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf
```
