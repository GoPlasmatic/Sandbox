# Docker Deployment

Deploy Reframe using Docker containers.

## Quick Start

```bash
docker run -d -p 3000:3000 --name reframe ghcr.io/goplasmatic/reframe:latest
```

## Image Tags

| Tag | Description |
|-----|-------------|
| `latest` | Latest stable release |
| `x.y.z` | Specific version (e.g., `3.1.8`) |
| `dev` | Development build |

## Docker Compose

### Basic Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  reframe:
    image: ghcr.io/goplasmatic/reframe:latest
    container_name: reframe
    ports:
      - "3000:3000"
    environment:
      - RUST_LOG=info
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### With Custom Package

```yaml
version: '3.8'

services:
  reframe:
    image: ghcr.io/goplasmatic/reframe:latest
    ports:
      - "3000:3000"
    volumes:
      - ./my-package:/packages/custom
    environment:
      - REFRAME_PACKAGE_PATH=/packages
      - RUST_LOG=info
```

### Production Setup

```yaml
version: '3.8'

services:
  reframe:
    image: ghcr.io/goplasmatic/reframe:3.1.8
    ports:
      - "3000:3000"
    environment:
      - RUST_LOG=info
      - TOKIO_WORKER_THREADS=8
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '2'
        reservations:
          memory: 256M
          cpus: '0.5'
      replicas: 3
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    restart: unless-stopped
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REFRAME_HOST` | `0.0.0.0` | Bind address |
| `REFRAME_PORT` | `3000` | Server port |
| `REFRAME_PACKAGE_PATH` | `/packages` | Package directory |
| `TOKIO_WORKER_THREADS` | CPU count | Worker threads |
| `RUST_LOG` | `info` | Log level |
| `RUST_LOG_FORMAT` | `compact` | Log format |

## Volume Mounts

### Custom Package

```bash
docker run -v /path/to/package:/packages/custom \
  -e REFRAME_PACKAGE_PATH=/packages \
  ghcr.io/goplasmatic/reframe:latest
```

### Configuration File

```bash
docker run -v /path/to/reframe.config.json:/app/reframe.config.json \
  ghcr.io/goplasmatic/reframe:latest
```

## Networking

### Expose to Host

```bash
docker run -p 3000:3000 ghcr.io/goplasmatic/reframe:latest
```

### Internal Network Only

```yaml
services:
  reframe:
    image: ghcr.io/goplasmatic/reframe:latest
    expose:
      - "3000"
    networks:
      - internal
```

### With Reverse Proxy

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - reframe

  reframe:
    image: ghcr.io/goplasmatic/reframe:latest
    expose:
      - "3000"
```

## Health Checks

```bash
# Check health
curl http://localhost:3000/health

# Docker health status
docker inspect --format='{{.State.Health.Status}}' reframe
```

## Logging

```bash
# View logs
docker logs reframe

# Follow logs
docker logs -f reframe

# Last 100 lines
docker logs --tail 100 reframe
```

## Operations

### Start/Stop

```bash
docker start reframe
docker stop reframe
docker restart reframe
```

### Update

```bash
docker pull ghcr.io/goplasmatic/reframe:latest
docker stop reframe
docker rm reframe
docker run -d -p 3000:3000 --name reframe ghcr.io/goplasmatic/reframe:latest
```

### Hot Reload

Update transformation rules without restarting. See **[Hot Reload Guide →](../features/hot-reload.md)**

## Production Checklist

- [ ] Use specific version tag, not `latest`
- [ ] Set appropriate resource limits
- [ ] Configure health checks
- [ ] Use reverse proxy for TLS
- [ ] Set up log aggregation
- [ ] Configure monitoring and alerting

---

**[Kubernetes Deployment →](./kubernetes.md)**

**[Configuration Reference →](./configuration.md)**
