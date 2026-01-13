# Validate API

Validate SWIFT MT and ISO 20022 messages.

## Endpoint

```
POST /api/validate
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
  "business_validation": "boolean (optional, default: false)",
  "canonical_json": "boolean (optional, default: false)",
  "fail_fast": "boolean (optional, default: false)"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | The message to validate |
| `business_validation` | boolean | No | Apply CBPR+ business rules |
| `canonical_json` | boolean | No | Return parsed message structure |
| `fail_fast` | boolean | No | Stop on first validation error |

## Response

### Valid Message (200 OK)

```json
{
  "status": "valid",
  "message_type": "MT103",
  "format": "swift_mt",
  "validation": {
    "format": "passed",
    "schema": "passed",
    "business": "passed"
  },
  "timing_ms": 0.5
}
```

### With Canonical JSON (200 OK)

```json
{
  "status": "valid",
  "message_type": "MT103",
  "format": "swift_mt",
  "validation": {
    "format": "passed",
    "schema": "passed"
  },
  "canonical": {
    "basic_header": {
      "app_id": "F",
      "service_id": "01",
      "lt_address": "BNPAFRPPXXX"
    },
    "application_header": {
      "io_identifier": "I",
      "message_type": "103",
      "receiver_address": "DEUTDEFFXXX"
    },
    "user_header": {
      "121": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
    },
    "fields": {
      "20": {"transaction_reference": "REF123456"},
      "23B": {"bank_operation_code": "CRED"},
      "32A": {
        "date": "250115",
        "currency": "USD",
        "amount": "50000,00"
      },
      "50K": {
        "account": "12345678",
        "name": "ACME CORP"
      },
      "59": {
        "account": "98765432",
        "name": "GLOBAL LTD"
      },
      "71A": {"details_of_charges": "SHA"}
    }
  }
}
```

### Invalid Message (200 OK with errors)

```json
{
  "status": "invalid",
  "message_type": "MT103",
  "format": "swift_mt",
  "validation": {
    "format": "passed",
    "schema": "failed",
    "business": "skipped"
  },
  "errors": [
    {
      "code": "MISSING_TAG",
      "field": "32A",
      "message": "Tag 32A (Value Date/Currency/Amount) is required",
      "severity": "error"
    },
    {
      "code": "INVALID_FORMAT",
      "field": "50K",
      "message": "Account must start with /",
      "severity": "error"
    }
  ]
}
```

### Parse Error (400 Bad Request)

```json
{
  "status": "error",
  "error": {
    "code": "PARSE_ERROR",
    "message": "Cannot parse message",
    "details": {
      "position": 45,
      "expected": "Block 4 start",
      "found": "Invalid character"
    }
  }
}
```

## Validation Levels

### Format Validation

Basic structural checks:

**SWIFT MT**:
- Block delimiters `{1:`, `{2:`, etc.
- Field separators
- Block sequence

**ISO 20022**:
- Well-formed XML
- Valid namespaces
- Basic structure

### Schema Validation

Message specification checks:

**SWIFT MT**:
- Required tags present
- Tag formats correct
- Field lengths within limits
- Valid code values

**ISO 20022**:
- XSD schema compliance
- Required elements present
- Data types correct
- Enumeration values valid

### Business Validation

CBPR+ business rules (when enabled):

- BIC format (8 or 11 characters)
- IBAN checksum validation
- Amount positive and formatted
- Date formats (YYMMDD or YYYY-MM-DD)
- Service level codes (G001-G004)
- Charge bearer codes (SHAR, DEBT, CRED)
- UETR format (UUID v4)

## Error Codes

| Code | Description |
|------|-------------|
| `PARSE_ERROR` | Cannot parse message structure |
| `BLOCK_STRUCTURE` | Invalid MT block structure |
| `MISSING_TAG` | Required tag missing |
| `INVALID_FORMAT` | Field format incorrect |
| `INVALID_LENGTH` | Field length exceeded |
| `INVALID_BIC` | Invalid BIC code |
| `INVALID_IBAN` | Invalid IBAN |
| `INVALID_AMOUNT` | Amount format error |
| `INVALID_DATE` | Date format error |
| `INVALID_CODE` | Invalid code value |
| `SCHEMA_VIOLATION` | XML schema error |
| `BUSINESS_RULE` | Business rule violation |

## Examples

### Basic Validation

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "message": "{1:F01BNPAFRPPXXX0000000000}{2:I103DEUTDEFFXXXXN}{4:\n:20:REF123\n:23B:CRED\n:32A:250115USD50000,00\n:50K:/1234\nSENDER\n:59:/5678\nRECEIVER\n:71A:SHA\n-}"
  }'
```

### With Business Validation

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "message": "...",
    "business_validation": true
  }'
```

### With Canonical JSON

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "message": "...",
    "canonical_json": true
  }'
```

### Validate ISO 20022

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "message": "<?xml version=\"1.0\"?><Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:pacs.008.001.12\">...</Document>",
    "business_validation": true
  }'
```

---

**[API Overview →](./overview.md)**

**[Try in Playground →](../playground/validator.md)**
