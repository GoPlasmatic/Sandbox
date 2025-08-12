---
sidebar_position: 3
---

import SwiftMTValidatorWrapper from '@site/src/components/ValidationConverter/SwiftMTValidatorWrapper';

# SWIFT CBPR+ MT Message Validator

<SwiftMTValidatorWrapper />

---

## About This Validator

### Overview

The SWIFT CBPR+ MT Message Validator provides comprehensive validation capabilities for SWIFT MT messages. It validates messages against SWIFT standards, network validation rules, and CBPR+ compliance requirements while providing canonical JSON representation for modern system integration.

### How It Works

The validation process follows these steps:

1. Parses the input SWIFT MT message blocks
2. Validates message structure and format
3. Checks mandatory fields and field options
4. Applies SWIFT network validation rules (NVRs)
5. Validates CBPR+ specific requirements
6. Generates canonical JSON representation if requested
7. Returns detailed validation results with specific error messages

### Features

- **Format Validation**: Validates SWIFT MT message format and structure
- **Network Validation Rules**: Applies SWIFT NVRs and field validations
- **CBPR+ Compliance**: Ensures messages meet CBPR+ requirements
- **Canonical JSON Conversion**: Converts validated messages to structured JSON
- **Detailed Error Reporting**: Provides specific error messages with field references
- **Multiple Message Types**: Supports various MT message types (MT103, MT202, MT900, etc.)
- **Block Analysis**: Validates all SWIFT blocks (1-5) and their components

### Supported Message Types

The validator supports the following SWIFT MT message types:
- **MT101** - Request for Transfer
- **MT103** - Single Customer Credit Transfer
- **MT104** - Direct Debit and Request for Debit Transfer
- **MT107** - General Direct Debit Message
- **MT110** - Advice of Cheque(s)
- **MT111** - Stop Payment of a Cheque
- **MT112** - Status of Request for Stop Payment
- **MT192** - Request for Cancellation
- **MT196** - Answers
- **MT199** - Free Format Message
- **MT202** - General Financial Institution Transfer
- **MT205** - Financial Institution Transfer Execution
- **MT210** - Notice to Receive
- **MT292** - Request for Cancellation
- **MT296** - Answers
- **MT299** - Free Format Message for Financial Institutions
- **MT900** - Confirmation of Debit
- **MT910** - Confirmation of Credit
- **MT920** - Request Message
- **MT935** - Rate Change Advice
- **MT940** - Customer Statement Message
- **MT941** - Balance Report
- **MT942** - Interim Transaction Report
- **MT950** - Statement Message

### SWIFT Message Structure

#### Block 1 - Basic Header
- Application ID
- Service ID
- Logical Terminal Address
- Session Number
- Sequence Number

#### Block 2 - Application Header
- I/O Identifier
- Message Type
- Receiver Address
- Priority
- Delivery Monitoring

#### Block 3 - User Header (Optional)
- Service Identifier
- Banking Priority
- Message User Reference

#### Block 4 - Text Block
- Message-specific fields
- Business content

#### Block 5 - Trailer (Optional)
- Checksums
- Message Authentication
- System Information

### API Reference

#### Endpoint
```
POST /validate/mt
```

#### Request Body
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

#### Response Format
```json
{
  "success": true|false,
  "message_type": "MT103",
  "errors": [
    {
      "error_type": "parser_error|business_validation_error",
      "code": "MT_PARSE_ERROR",
      "message": "Error description",
      "field": "20|32A|50K",
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

### Validation Rules

#### Format Validation
- Field presence and optionality
- Field format and length
- Character set validation
- Code word validation

#### Network Validation Rules (NVRs)
- Cross-field validations
- Conditional field requirements
- Currency and amount validations
- Date and time format checks

#### CBPR+ Specific Rules
- Enhanced data requirements
- Structured address formats
- Purpose code validations
- Regulatory reporting fields