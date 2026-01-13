# Error Codes Reference

Complete list of error codes returned by the Reframe API.

## Error Response Format

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

## Error Types

| Type | Description |
|------|-------------|
| `parser_error` | Message parsing failed |
| `validation_error` | Message failed validation |
| `business_validation_error` | Business rule violation |
| `transformation_error` | Transformation failed |
| `schema_error` | XSD schema violation |
| `system_error` | Internal system error |

---

## Parser Errors

| Code | Description |
|------|-------------|
| `MT_PARSE_ERROR` | Failed to parse SWIFT MT message |
| `XML_PARSE_ERROR` | Failed to parse XML message |
| `INVALID_BLOCK_STRUCTURE` | Invalid SWIFT block structure |
| `MISSING_REQUIRED_BLOCK` | Required block is missing |
| `INVALID_HEADER` | Invalid message header |

## Validation Errors

| Code | Description |
|------|-------------|
| `INVALID_FORMAT` | Field format is invalid |
| `INVALID_LENGTH` | Field length exceeds limits |
| `MISSING_REQUIRED_FIELD` | Required field is missing |
| `INVALID_FIELD_VALUE` | Field value is not allowed |
| `INVALID_CHARACTER_SET` | Invalid characters in field |
| `INVALID_DATE_FORMAT` | Invalid date or time format |
| `INVALID_CURRENCY_CODE` | Invalid currency code |
| `INVALID_AMOUNT_FORMAT` | Invalid amount format |
| `INVALID_BIC` | Invalid BIC/SWIFT code |
| `INVALID_IBAN` | Invalid IBAN format |

## Business Validation Errors

| Code | Description |
|------|-------------|
| `NVR_VIOLATION` | Network Validation Rule violation |
| `CBPR_VIOLATION` | CBPR+ requirement not met |
| `CROSS_FIELD_ERROR` | Cross-field validation failed |
| `CONDITIONAL_FIELD_ERROR` | Conditional field requirement not met |
| `DUPLICATE_REFERENCE` | Duplicate transaction reference |
| `INVALID_DATE_RANGE` | Date range is invalid |
| `CURRENCY_MISMATCH` | Currency codes don't match |

## Transformation Errors

| Code | Description |
|------|-------------|
| `UNSUPPORTED_MESSAGE_TYPE` | Message type not supported |
| `UNSUPPORTED_SCENARIO` | Transformation scenario not found |
| `MAPPING_ERROR` | Field mapping failed |
| `DATA_TRUNCATION` | Data was truncated during transformation |
| `CHARACTER_CONVERSION_ERROR` | Character set conversion failed |
| `TRANSFORMATION_FAILED` | General transformation failure |

## Schema Errors

| Code | Description |
|------|-------------|
| `XSD_VALIDATION_ERROR` | XSD schema validation failed |
| `INVALID_NAMESPACE` | Invalid XML namespace |
| `INVALID_ELEMENT` | Unknown or invalid XML element |
| `MISSING_REQUIRED_ELEMENT` | Required XML element missing |

## System Errors

| Code | Description |
|------|-------------|
| `INTERNAL_ERROR` | Internal server error |
| `TIMEOUT` | Operation timed out |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable |
| `CONFIGURATION_ERROR` | Configuration error |
