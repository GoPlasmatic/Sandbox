# Transformation

Transform messages between SWIFT MT and ISO 20022 formats with bidirectional support.

## Overview

Reframe supports bidirectional transformation:
- **Forward**: SWIFT MT → ISO 20022 (MX)
- **Reverse**: ISO 20022 (MX) → SWIFT MT

The transformation service automatically detects the input format and applies the appropriate transformation rules.

## Supported Directions

- **[MT to ISO 20022](./mt-to-iso20022.md)** - Convert legacy SWIFT MT to modern ISO 20022 XML
- **[ISO 20022 to MT](./iso20022-to-mt.md)** - Convert ISO 20022 XML back to SWIFT MT

## API Endpoint

```
POST /api/transform
```

The endpoint auto-detects the input format and transformation direction.

### Request

```json
{
  "message": "<your message here>",
  "validation": true
}
```

### Response

```json
{
  "success": true,
  "source_type": "MT103",
  "target_type": "pacs.008",
  "transformed_message": "<?xml version=\"1.0\"?>...",
  "validation_results": { ... }
}
```

## Key Features

- **Auto-Detection**: Automatically determines message format and direction
- **SR2025 Compliance**: Full compliance with SWIFT Release 2025 standards
- **CBPR+ Support**: Enhanced Cross-Border Payments and Reporting Plus capabilities
- **Pre-Validation**: Optional validation before transformation
- **53+ Scenarios**: Comprehensive coverage of transformation use cases

## Try It

<div class="reframe-playground" data-tab="transform"></div>
