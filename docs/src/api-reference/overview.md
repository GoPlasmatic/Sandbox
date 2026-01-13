# API Reference

Complete reference for the Reframe open source rules engine REST API.

## Base URL

**Sandbox**: `https://reframeapi.goplasmatic.io`

**Local**: `http://localhost:3000`

## Authentication

The sandbox API requires no authentication (rate limited). For production deployments, configure authentication as needed.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/transform` | Transform messages between formats |
| `POST` | `/api/validate` | Validate MT or ISO 20022 messages |
| `POST` | `/api/generate` | Generate sample messages |
| `POST` | `/admin/reload-workflows` | Hot reload transformation rules |
| `GET` | `/health` | Health check |
| `GET` | `/packages` | List loaded packages |
| `GET` | `/swagger-ui` | Interactive API documentation |
| `POST` | `/graphql` | GraphQL endpoint |

## Common Response Format

### Success Response

```json
{
  "status": "success",
  "message": "...",
  "timing_ms": 1.2,
  "metadata": {
    "package": "swift-cbpr-mt-mx",
    "version": "2.1.2"
  }
}
```

### Error Response

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `PARSE_ERROR` | 400 | Cannot parse input message |
| `VALIDATION_ERROR` | 400 | Message validation failed |
| `TRANSFORMATION_ERROR` | 400 | Transformation failed |
| `UNSUPPORTED_TYPE` | 400 | Message type not supported |
| `INTERNAL_ERROR` | 500 | Internal server error |

## Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` |
| `Accept` | No | `application/json` (default) |

## Rate Limiting

**Sandbox API**:
- 100 requests per minute per IP
- 1000 requests per hour per IP

Rate limit headers in response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705312800
```

## Quick Examples

### Transform a Message

```bash
curl -X POST https://reframeapi.goplasmatic.io/api/transform \
  -H "Content-Type: application/json" \
  -d '{"message": "{1:F01BNPAFRPPXXX...}"}'
```

### Validate a Message

```bash
curl -X POST https://reframeapi.goplasmatic.io/api/validate \
  -H "Content-Type: application/json" \
  -d '{"message": "...", "business_validation": true}'
```

### Generate a Sample

```bash
curl -X POST https://reframeapi.goplasmatic.io/api/generate \
  -H "Content-Type: application/json" \
  -d '{"message_type": "MT103", "scenario": "standard"}'
```

### Check Health

```bash
curl https://reframeapi.goplasmatic.io/health
```

## OpenAPI / Swagger

Interactive API documentation is available at:

- **Sandbox**: `https://reframeapi.goplasmatic.io/swagger-ui`
- **Local**: `http://localhost:3000/swagger-ui`

---

**[Transform API →](./transform-api.md)**

**[Validate API →](./validate-api.md)**

**[Generate API →](./generate-api.md)**
