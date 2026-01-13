# Docker Setup

Quick start with Docker:

```bash
# Pull and run Reframe
docker run -d -p 3000:3000 --name reframe ghcr.io/goplasmatic/reframe:latest

# Verify it's running
curl http://localhost:3000/health
```

For Docker Compose, custom packages, resource limits, networking, and production deployment:

**[Complete Docker Guide →](../deployment/docker.md)**
