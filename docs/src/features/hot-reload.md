# Hot Reload: Update Rules Without Restart

Update SWIFT MT and ISO 20022 transformation rules in production without downtime or service interruption.

## Overview

Hot reloading allows you to:
- Update rules in production without downtime
- Test new mappings without restart
- Roll back changes quickly

## Triggering a Reload

```bash
curl -X POST http://localhost:3000/admin/reload-workflows
```

**Success Response:**
```json
{
  "status": "success",
  "message": "Workflows reloaded successfully",
  "package": {
    "id": "swift-cbpr-mt-mx",
    "version": "2.1.2",
    "workflows_loaded": 594
  },
  "timing_ms": 125
}
```

**Error Response:**
```json
{
  "status": "error",
  "error": {
    "code": "COMPILATION_ERROR",
    "details": "Invalid JSONLogic in MT103/document-mapping.json"
  }
}
```

## Behavior

| Phase | Behavior |
|-------|----------|
| **During reload** | Existing requests continue; new requests may briefly queue |
| **After reload** | All new requests use updated rules |
| **On error** | Current rules remain active; error returned |

## Development Workflow

Mount your package directory and iterate without restarts:

```yaml
# docker-compose.yml
services:
  reframe:
    image: plasmatic/reframe:latest
    volumes:
      - ./my-package:/packages/custom
```

```bash
# Edit → Reload → Test cycle
vim my-package/transform/outgoing/MT103/document-mapping.json
curl -X POST http://localhost:3000/admin/reload-workflows
curl -X POST http://localhost:3000/api/transform -d '...'
```

## CI/CD Integration

```yaml
# GitHub Actions example
deploy-rules:
  steps:
    - run: scp -r rules/* server:/packages/swift-cbpr/
    - run: curl -X POST https://api.example.com/admin/reload-workflows
    - run: curl https://api.example.com/health
```

## Best Practices

1. **Pre-validate**: Test on staging before production reload
2. **Keep backups**: `cp -r /packages/swift-cbpr /packages/swift-cbpr.backup`
3. **Version packages**: Increment version in `reframe-package.json` on changes
4. **Monitor health**: Check `/health` endpoint after reload

## Monitoring

The health endpoint shows package info:

```json
{
  "status": "healthy",
  "package": {
    "id": "swift-cbpr-mt-mx",
    "version": "2.1.2",
    "loaded_at": "2025-01-15T10:30:00Z"
  }
}
```

---

## Related Pages

- **[Admin API Reference](../api-reference/admin-api.md)** - Complete admin API documentation
- **[Packages and Rules](../concepts/packages-and-rules.md)** - How transformation rules are organized
- **[Configuration Reference](../deployment/configuration.md)** - Environment variables and settings
- **[Monitoring](../deployment/monitoring.md)** - Health checks and observability
