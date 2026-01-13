# SWIFT MT Validator

Validate SWIFT MT messages against SWIFT standards, network validation rules (NVRs), and CBPR+ compliance requirements. The validator also provides canonical JSON representation for modern system integration.

<div class="reframe-playground" data-tab="validate"></div>

## How It Works

The validation process follows these steps:

1. Parses the input SWIFT MT message blocks
2. Validates message structure and format
3. Checks mandatory fields and field options
4. Applies SWIFT network validation rules (NVRs)
5. Validates CBPR+ specific requirements
6. Generates canonical JSON representation if requested
7. Returns detailed validation results with specific error messages

## Features

- **Format Validation**: Validates SWIFT MT message format and structure
- **Network Validation Rules**: Applies SWIFT NVRs and field validations
- **CBPR+ Compliance**: Ensures messages meet CBPR+ requirements
- **Canonical JSON Conversion**: Converts validated messages to structured JSON
- **Detailed Error Reporting**: Provides specific error messages with field references
- **Multiple Message Types**: Supports various MT message types
- **Block Analysis**: Validates all SWIFT blocks (1-5) and their components

## Supported Message Types

See [Message Types Reference](../reference/message-types.md) for the complete list.

## SWIFT Message Structure

### Block 1 - Basic Header
- Application ID
- Service ID
- Logical Terminal Address
- Session Number
- Sequence Number

### Block 2 - Application Header
- I/O Identifier
- Message Type
- Receiver Address
- Priority
- Delivery Monitoring

### Block 3 - User Header (Optional)
- Service Identifier
- Banking Priority
- Message User Reference

### Block 4 - Text Block
- Message-specific fields
- Business content

### Block 5 - Trailer (Optional)
- Checksums
- Message Authentication
- System Information

## API Reference

### Endpoint
```
POST /api/validate
```

### Request Body
```json
{
  "message": "<SWIFT MT message>",
  "options": {
    "canonical": true,
    "business_validation": true,
    "fail_fast": false
  }
}
```

### Response Format
```json
{
  "success": true,
  "message_type": "MT103",
  "errors": [
    {
      "error_type": "parser_error",
      "code": "MT_PARSE_ERROR",
      "message": "Error description",
      "field": "20",
      "location": "Block 4, Field 20",
      "details": {
        "field_tag": "20",
        "field_type": "Field20",
        "position": 1
      }
    }
  ],
  "canonical_json": {
    "header": { ... },
    "body": { ... },
    "trailer": { ... }
  }
}
```

## Validation Rules

### Format Validation
- Field presence and optionality
- Field format and length
- Character set validation
- Code word validation

### Network Validation Rules (NVRs)
- Cross-field validations
- Conditional field requirements
- Currency and amount validations
- Date and time format checks

### CBPR+ Specific Rules
- Enhanced data requirements
- Structured address formats
- Purpose code validations
- Regulatory reporting fields

---

## Next Steps

- [Generate sample SWIFT MT messages](../sample-generation/swift-mt.md) - Create test messages
- [Transform MT to ISO 20022](../transformation/mt-to-iso20022.md) - Convert to ISO 20022 format
