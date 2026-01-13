# Validation

Validate SWIFT MT and ISO 20022 messages against standards and CBPR+ requirements.

## Overview

The validation service checks messages for:
- **Format Compliance**: Structure, field formats, and character sets
- **Schema Validation**: XSD compliance for ISO 20022 messages
- **Business Rules**: CBPR+ specific requirements and constraints
- **Network Rules**: SWIFT Network Validation Rules (NVRs) for MT messages

## Supported Formats

- **[SWIFT MT Messages](./swift-mt.md)** - Validate MT103, MT202, and other MT formats
- **[ISO 20022 Messages](./iso20022.md)** - Validate pacs, pain, camt, and other MX formats

## API Endpoint

```
POST /api/validate
```

The endpoint auto-detects whether the input is SWIFT MT or ISO 20022 format.

### Request

```json
{
  "message": "<your message here>",
  "options": {
    "canonical": true,
    "business_validation": true,
    "fail_fast": false
  }
}
```

### Response

```json
{
  "success": true,
  "message_type": "MT103",
  "errors": [],
  "canonical_json": { ... }
}
```

## Try It

<div class="reframe-playground" data-tab="validate"></div>
