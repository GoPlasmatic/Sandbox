# Admin API

Administrative endpoints for managing Reframe.

## Reload Workflows

Hot reload transformation rules without restarting.

### Endpoint

```
POST /admin/reload-workflows
```

### Request

No request body required.

### Response (Success)

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

### Response (Error)

```json
{
  "status": "error",
  "message": "Failed to reload workflows",
  "error": {
    "code": "COMPILATION_ERROR",
    "details": "Invalid JSONLogic in MT103/document-mapping.json at line 45"
  }
}
```

### Example

```bash
curl -X POST http://localhost:3000/admin/reload-workflows
```

---

## Health Check

Check service health and engine status.

### Endpoint

```
GET /health
```

### Response (Healthy)

```json
{
  "status": "healthy",
  "engines": {
    "transform": "ready",
    "generation": "ready",
    "validation": "ready"
  },
  "package": {
    "id": "swift-cbpr-mt-mx",
    "version": "2.1.2",
    "loaded_at": "2025-01-15T10:30:00Z"
  },
  "uptime_seconds": 86400
}
```

### Response (Unhealthy)

```json
{
  "status": "unhealthy",
  "engines": {
    "transform": "error",
    "generation": "ready",
    "validation": "ready"
  },
  "error": "Transform engine failed to initialize"
}
```

### Example

```bash
curl http://localhost:3000/health
```

---

## List Packages

List loaded transformation packages.

### Endpoint

```
GET /packages
```

### Response

```json
{
  "packages": [
    {
      "id": "swift-cbpr-mt-mx",
      "name": "SWIFT CBPR+ MT <-> MX Transformations",
      "version": "2.1.2",
      "engine_version": "3.1.4",
      "loaded_at": "2025-01-15T10:30:00Z",
      "workflows": {
        "transform": 594,
        "validate": 12,
        "generate": 8
      },
      "scenarios": {
        "outgoing": 23,
        "incoming": 32
      }
    }
  ]
}
```

### Example

```bash
curl http://localhost:3000/packages
```

---

## OpenAPI Documentation

Interactive API documentation.

### Endpoint

```
GET /swagger-ui
```

Opens the Swagger UI interface in a web browser.

### Example

```bash
# Open in browser
open http://localhost:3000/swagger-ui
```

---

## Configuration Endpoints

### Get Current Configuration

```
GET /admin/config
```

Returns the current runtime configuration (excludes sensitive data).

```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 3000,
    "workers": 4
  },
  "logging": {
    "level": "info",
    "format": "compact"
  },
  "packages": [
    {
      "path": "/packages/swift-cbpr",
      "enabled": true
    }
  ]
}
```

### Example

```bash
curl http://localhost:3000/admin/config
```

---

## Metrics Endpoint

Prometheus-compatible metrics (if enabled).

### Endpoint

```
GET /metrics
```

### Response

```
# HELP reframe_requests_total Total number of requests
# TYPE reframe_requests_total counter
reframe_requests_total{endpoint="/api/transform",status="success"} 12345
reframe_requests_total{endpoint="/api/validate",status="success"} 8901

# HELP reframe_request_duration_seconds Request duration
# TYPE reframe_request_duration_seconds histogram
reframe_request_duration_seconds_bucket{endpoint="/api/transform",le="0.001"} 10234
reframe_request_duration_seconds_bucket{endpoint="/api/transform",le="0.01"} 12100

# HELP reframe_messages_transformed_total Total messages transformed
# TYPE reframe_messages_transformed_total counter
reframe_messages_transformed_total{direction="outgoing",type="MT103"} 5678
reframe_messages_transformed_total{direction="incoming",type="pacs.008"} 4321
```

### Example

```bash
curl http://localhost:3000/metrics
```

---

## Security Considerations

### Admin Endpoints

Admin endpoints should be protected in production:

- Use a reverse proxy to restrict access
- Implement IP whitelisting
- Add authentication if needed

### Example: nginx Protection

```nginx
location /admin/ {
    allow 10.0.0.0/8;
    deny all;
    proxy_pass http://reframe:3000;
}
```

### Example: Authentication Header

```bash
# If authentication is configured
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/admin/reload-workflows
```

---

**[API Overview →](./overview.md)**

**[Hot Reload Guide →](../features/hot-reload.md)**
