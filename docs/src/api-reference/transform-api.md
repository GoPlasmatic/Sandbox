# Transform API

Transform messages between SWIFT MT and ISO 20022 formats.

## Endpoint

```
POST /api/transform
```

## Request

### Headers

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

### Body

```json
{
  "message": "string (required)",
  "validation": "boolean (optional, default: false)",
  "debug": "boolean (optional, default: false)",
  "metadata": "object (optional)"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | The message to transform (MT or ISO 20022) |
| `validation` | boolean | No | Validate before and after transformation |
| `debug` | boolean | No | Include debug information in response |
| `metadata` | object | No | User-provided metadata to include in response |

## Response

### Success (200 OK)

```json
{
  "status": "success",
  "direction": "outgoing",
  "source_type": "MT103",
  "target_type": "pacs.008.001.12",
  "message": "<transformed message>",
  "timing_ms": 1.2,
  "metadata": {
    "package": "swift-cbpr-mt-mx",
    "version": "2.1.2"
  }
}
```

### With Debug (200 OK)

```json
{
  "status": "success",
  "direction": "outgoing",
  "source_type": "MT103",
  "target_type": "pacs.008.001.12",
  "message": "<transformed message>",
  "timing_ms": 1.2,
  "debug": {
    "workflows_executed": [
      {"id": "parse-mt", "priority": 1, "timing_ms": 0.2},
      {"id": "mt103-bah-mapping", "priority": 3, "timing_ms": 0.3},
      {"id": "mt103-document-mapping", "priority": 5, "timing_ms": 0.5},
      {"id": "combine-xml", "priority": 10, "timing_ms": 0.2}
    ],
    "parsed_input": {...},
    "intermediate_values": {...}
  }
}
```

### Validation Error (400 Bad Request)

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "errors": [
      {
        "code": "MISSING_TAG",
        "field": "32A",
        "message": "Tag 32A is required"
      }
    ]
  }
}
```

### Transformation Error (400 Bad Request)

```json
{
  "status": "error",
  "error": {
    "code": "TRANSFORMATION_ERROR",
    "message": "Failed to transform message",
    "details": {
      "workflow": "mt103-document-mapping",
      "task": "map-amount",
      "reason": "Missing source field"
    }
  }
}
```

## Auto-Detection

The API automatically detects:

| Input Pattern | Detection |
|---------------|-----------|
| Starts with `{1:` | SWIFT MT format |
| XML with ISO 20022 namespace | ISO 20022 format |
| Block 2 message type | Specific MT type (103, 202, etc.) |
| MsgDefIdr element | Specific ISO 20022 type |

## Examples

### MT103 to pacs.008

```bash
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{
    "message": "{1:F01BNPAFRPPXXX0000000000}{2:I103DEUTDEFFXXXXN}{3:{121:f47ac10b-58cc-4372-a567-0e02b2c3d479}}{4:\n:20:REF123456\n:23B:CRED\n:32A:250115USD50000,00\n:50K:/12345678\nACME CORP\n:59:/98765432\nGLOBAL LTD\n:71A:SHA\n-}"
  }'
```

### pacs.008 to MT103

```bash
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{
    "message": "<?xml version=\"1.0\"?><Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:pacs.008.001.12\">...</Document>"
  }'
```

### With Validation

```bash
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{
    "message": "{1:F01BNPAFRPPXXX...}",
    "validation": true
  }'
```

### With Debug

```bash
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{
    "message": "{1:F01BNPAFRPPXXX...}",
    "debug": true
  }'
```

### With Metadata

```bash
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{
    "message": "{1:F01BNPAFRPPXXX...}",
    "metadata": {
      "request_id": "req-12345",
      "source_system": "payment-gateway"
    }
  }'
```

## Supported Transformations

For the complete list of supported message transformations, see **[Message Catalog →](../cbpr-plus/message-catalog.md)**

---

**[API Overview →](./overview.md)**

**[Try in Playground →](../playground/transformer.md)**
