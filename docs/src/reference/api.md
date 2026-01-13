# API Reference

Complete API documentation for Reframe's REST endpoints.

## Base URL

```
http://localhost:3000
```

## Endpoints

### Generate Sample Message

Generate a sample SWIFT MT or ISO 20022 message.

```
POST /api/generate
```

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message_type` | string | Yes | Message type (e.g., "MT103", "pacs.008") |
| `scenario` | string | Yes | Scenario ID (e.g., "standard", "high_value") |
| `debug` | boolean | No | Include debug information |

**Example Request**

```json
{
  "message_type": "MT103",
  "scenario": "standard",
  "debug": false
}
```

**Example Response**

```json
{
  "success": true,
  "message_type": "MT103",
  "scenario": "standard",
  "message": "{1:F01BNPAFRPPXXX0000000000}..."
}
```

---

### Validate Message

Validate a SWIFT MT or ISO 20022 message.

```
POST /api/validate
```

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | The message to validate |
| `options.canonical` | boolean | No | Generate canonical JSON (default: true) |
| `options.business_validation` | boolean | No | Apply business rules (default: true) |
| `options.fail_fast` | boolean | No | Stop on first error (default: false) |
| `debug` | boolean | No | Include debug information |

**Example Request**

```json
{
  "message": "{1:F01BNPAFRPPXXX0000000000}{2:I103DEUTDEFFXXXXN}...",
  "options": {
    "canonical": true,
    "business_validation": true
  }
}
```

**Example Response**

```json
{
  "success": true,
  "message_type": "MT103",
  "errors": [],
  "canonical_json": {
    "header": { ... },
    "body": { ... }
  }
}
```

---

### Transform Message

Transform a message between SWIFT MT and ISO 20022 formats.

```
POST /api/transform
```

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | The message to transform |
| `validation` | boolean | No | Validate before transformation (default: true) |
| `debug` | boolean | No | Include debug information |

**Example Request**

```json
{
  "message": "{1:F01BNPAFRPPXXX0000000000}...",
  "validation": true
}
```

**Example Response**

```json
{
  "success": true,
  "source_type": "MT103",
  "target_type": "pacs.008",
  "transformed_message": "<?xml version=\"1.0\"?>...",
  "validation_results": { ... }
}
```

---

### Hot-Reload Workflows

Reload transformation workflows without restarting the service.

```
POST /admin/reload-workflows
```

**Example Response**

```json
{
  "success": true,
  "message": "Workflows reloaded successfully"
}
```

---

### Health Check

Check service health.

```
GET /health
```

**Example Response**

```json
{
  "status": "healthy",
  "version": "3.1.3"
}
```

## Error Response Format

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "errors": [
    {
      "error_type": "validation_error",
      "code": "INVALID_FORMAT",
      "message": "Description of the error",
      "field": "field_name",
      "location": "Path or location",
      "details": { ... }
    }
  ]
}
```

## Error Codes

See [Error Codes Reference](./error-codes.md) for the complete list of error codes.
