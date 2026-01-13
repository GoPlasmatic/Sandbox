# Sample Generation

Generate CBPR+ compliant test messages for SWIFT MT and ISO 20022 formats.

## Overview

The sample generator creates realistic test messages based on predefined scenarios. Each message type has multiple scenarios representing real-world use cases.

## Supported Formats

- **[SWIFT MT Messages](./swift-mt.md)** - Legacy SWIFT message format (MT103, MT202, etc.)
- **[ISO 20022 Messages](./iso20022.md)** - Modern XML-based messages (pacs.008, pain.001, etc.)

## API Endpoint

```
POST /api/generate
```

### Request

```json
{
  "message_type": "MT103",
  "scenario": "standard",
  "debug": false
}
```

### Response

```json
{
  "success": true,
  "message_type": "MT103",
  "scenario": "standard",
  "message": "{1:F01BNPAFRPPXXX0000000000}..."
}
```

## Try It

<div class="reframe-playground" data-tab="generate"></div>
