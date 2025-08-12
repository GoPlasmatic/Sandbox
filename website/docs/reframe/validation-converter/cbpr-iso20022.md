---
sidebar_position: 2
---

import ISO20022ValidatorWrapper from '@site/src/components/ValidationConverter/ISO20022ValidatorWrapper';

# CBPR+ ISO20022 Message Validator

<ISO20022ValidatorWrapper />

---

## About This Validator

### Overview

The CBPR+ ISO20022 Message Validator provides comprehensive validation capabilities for ISO20022 XML messages. It validates messages against XSD schemas, business rules, and CBPR+ compliance requirements while providing canonical JSON representation for easy integration and processing.

### How It Works

The validation process follows these steps:

1. Parses the input ISO20022 XML message
2. Validates the message structure against ISO20022 XSD schemas
3. Applies CBPR+ business validation rules
4. Checks mandatory fields and data types
5. Validates cross-field dependencies and business logic
6. Generates canonical JSON representation if requested
7. Returns detailed validation results with specific error messages

### Features

- **Schema Validation**: Validates messages against official ISO20022 XSD schemas
- **Business Rule Validation**: Applies CBPR+ specific business rules and constraints
- **Canonical JSON Conversion**: Converts validated messages to a standardized JSON format
- **Detailed Error Reporting**: Provides specific error messages with field paths and descriptions
- **Interactive Interface**: Easy-to-use web interface with sample messages
- **Multiple Message Types**: Supports all major ISO20022 message types (pacs, pain, camt)

### Supported Message Types

The validator supports the following ISO20022 message types:
- **pacs.002** - FIToFI Payment Status Report
- **pacs.003** - FIToFI Customer Direct Debit
- **pacs.008** - FIToFI Customer Credit Transfer
- **pacs.009** - Financial Institution Credit Transfer
- **pain.001** - Customer Credit Transfer Initiation
- **pain.008** - Customer Direct Debit Initiation
- **camt.025** - Receipt
- **camt.029** - Resolution of Investigation
- **camt.052** - Bank to Customer Account Report
- **camt.053** - Bank to Customer Statement
- **camt.054** - Bank to Customer Debit/Credit Notification
- **camt.056** - FIToFI Payment Cancellation Request
- **camt.057** - Notification to Account Owner
- **camt.060** - Account Reporting Request

### API Reference

#### Endpoint
```
POST /validate/mx
```

#### Request Body
```json
{
  "message": "<ISO20022 XML message>",
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
  "message_type": "pacs.008.001.08",
  "errors": [
    {
      "error_type": "parser_error|business_validation_error|transformation_error",
      "code": "INVALID_FORMAT",
      "message": "Error description",
      "field": "field.name",
      "location": "XPath or location in message",
      "details": { ... }
    }
  ],
  "canonical_json": { ... }
}
```