# Message Validation: SWIFT MT and ISO 20022

Validate SWIFT MT and ISO 20022 messages against schemas and business rules with the open source Reframe validation engine.

## Overview

Reframe's open source rules engine validates messages at multiple levels:

1. **Format Validation**: Message structure and syntax
2. **Schema Validation**: Field formats and required elements
3. **Business Validation**: Package-specific business rules
4. **Custom Rules**: User-defined validation rules via JSONLogic

## API Usage

### Basic Validation

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "message": "{1:F01BNPAFRPPXXX...}",
    "business_validation": true
  }'
```

### Response (Valid Message)

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

### Response (Invalid Message)

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
      "code": "FIELD_REQUIRED",
      "field": "32A",
      "message": "Tag 32A (Value Date/Currency/Amount) is required"
    },
    {
      "code": "INVALID_FORMAT",
      "field": "50K",
      "message": "Account number must start with /"
    }
  ]
}
```

## Validation Options

| Option | Default | Description |
|--------|---------|-------------|
| `business_validation` | `false` | Enable CBPR+ business rules |
| `canonical_json` | `false` | Return parsed message as JSON |
| `fail_fast` | `false` | Stop on first error |

### Full Options Example

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "message": "...",
    "business_validation": true,
    "canonical_json": true,
    "fail_fast": false
  }'
```

## Format Detection

Reframe automatically detects the message format:

| Pattern | Detected Format |
|---------|-----------------|
| Starts with `{1:` | SWIFT MT |
| Contains `xmlns="urn:iso:std:iso:20022` | ISO 20022 XML |
| XML with BAH | ISO 20022 with header |

## SWIFT MT Validation

### Block Structure

- Block 1: Basic header format
- Block 2: Application header format
- Block 3: User header (optional)
- Block 4: Text block with tags
- Block 5: Trailer (optional)

### Tag Validation

| Check | Description |
|-------|-------------|
| Tag presence | Required tags present |
| Tag format | Correct format per tag |
| Tag sequence | Tags in valid order |
| Tag length | Within max length |

### Example Errors

```json
{
  "errors": [
    {
      "code": "BLOCK_STRUCTURE",
      "message": "Block 1 is malformed"
    },
    {
      "code": "MISSING_TAG",
      "field": "32A",
      "message": "Required tag 32A is missing"
    },
    {
      "code": "INVALID_BIC",
      "field": "52A",
      "message": "Invalid BIC format in tag 52A"
    }
  ]
}
```

## ISO 20022 Validation

### XML Schema Validation

- Well-formed XML
- Valid against XSD schema
- Correct namespace declarations
- Required elements present

### Business Application Header

- Valid sender/receiver BIC
- Message definition identifier matches document
- Creation date/time format

### Document Validation

| Check | Description |
|-------|-------------|
| Required elements | All mandatory fields present |
| Data types | Correct format (dates, amounts, codes) |
| Enumerations | Valid code values |
| Constraints | Cross-field validations |

### Example Errors

```json
{
  "errors": [
    {
      "code": "SCHEMA_VIOLATION",
      "path": "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt",
      "message": "Currency attribute is required"
    },
    {
      "code": "INVALID_DATE",
      "path": "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmDt",
      "message": "Date must be in YYYY-MM-DD format"
    }
  ]
}
```

## Business Validation

When `business_validation: true`, package-specific rules are applied.

### CBPR+ Package Rules

### Party Identification

- Debtor/Creditor name required
- Valid account formats
- BIC format validation

### Amount Rules

- Positive amounts only
- Currency code validation
- Settlement date validation

### Agent Chain

- Valid BIC codes
- Required agent information
- Consistent agent chain

### UETR Validation

- UUID format check
- Uniqueness (optional with persistence)

## Canonical JSON Output

With `canonical_json: true`, the parsed message structure is returned:

### SWIFT MT Canonical

```json
{
  "canonical": {
    "basic_header": {
      "app_id": "F",
      "service_id": "01",
      "lt_address": "BNPAFRPPXXX"
    },
    "application_header": {
      "message_type": "103",
      "receiver_address": "DEUTDEFFXXX"
    },
    "fields": {
      "20": {"transaction_reference": "REF123456"},
      "32A": {
        "date": "250115",
        "currency": "USD",
        "amount": "50000,00"
      }
    }
  }
}
```

### ISO 20022 Canonical

```json
{
  "canonical": {
    "app_header": {
      "from": "BNPAFRPPXXX",
      "to": "DEUTDEFFXXX",
      "msg_def_id": "pacs.008.001.12"
    },
    "document": {
      "grp_hdr": {
        "msg_id": "MSG123",
        "cre_dt_tm": "2025-01-15T10:30:00Z"
      },
      "cdt_trf_tx_inf": {
        "pmt_id": {
          "instr_id": "INSTR123",
          "uetr": "174d2c70-..."
        }
      }
    }
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `PARSE_ERROR` | Cannot parse message |
| `BLOCK_STRUCTURE` | Invalid MT block structure |
| `MISSING_TAG` | Required tag missing |
| `INVALID_FORMAT` | Field format error |
| `INVALID_BIC` | Invalid BIC code |
| `INVALID_IBAN` | Invalid IBAN |
| `INVALID_AMOUNT` | Amount format error |
| `INVALID_DATE` | Date format error |
| `SCHEMA_VIOLATION` | XML schema error |
| `BUSINESS_RULE` | Business rule violation |

## Interactive Playground

Validate messages using the interactive playground:

<div class="reframe-playground" data-tab="validate"></div>

---

## Related Pages

- **[Validate API Reference](../api-reference/validate-api.md)** - Complete API documentation
- **[Message Types Reference](../reference/message-types.md)** - Supported SWIFT MT and ISO 20022 types
- **[Error Codes Reference](../reference/error-codes.md)** - Validation error codes
- **[Sample Generation](./sample-generation.md)** - Generate test messages
- **[Interactive Playground](../playground/index.md)** - Try validation online
- **[FAQ](../faq.md)** - Common questions about Reframe
