---
sidebar_position: 2
---

import ISO20022toMTTransformerWrapper from '@site/src/components/TransformationConverter/ISO20022toMTTransformerWrapper';

# ISO 20022 to SWIFT MT Transformation

Transform ISO 20022 XML messages to SWIFT MT format for legacy system compatibility.

<ISO20022toMTTransformerWrapper />

## Overview

The ISO 20022 to MT transformation service converts modern ISO 20022 XML messages back to SWIFT MT format, enabling communication with legacy systems that haven't yet migrated to ISO 20022.

### Key Features

- **Format Conversion**: Converts structured XML to SWIFT MT block format
- **Block Generation**: Automatically generates required SWIFT blocks (1-5)
- **Field Mapping**: Maps ISO 20022 elements to corresponding MT fields
- **SR2025 Validation**: Ensures compliance with SWIFT Release 2025 standards
- **Character Set Conversion**: Ensures SWIFT character set compliance
- **CBPR+ Support**: Handles enhanced Cross-Border Payments and Reporting Plus data
- **Performance Optimized**: High-throughput reverse transformation engine
- **Scenario-Based Processing**: 34 pre-configured reverse transformation scenarios

### Supported Transformations

#### Payment Messages

| ISO 20022 | SWIFT MT | Description | Scenario ID |
|-----------|----------|-------------|-------------|
| pacs.008 | MT103 | Standard Customer Credit Transfer | standard |
| pacs.008 | MT103 | STP Compliant Transfer | stp |
| pacs.009 | MT202 | Financial Institution Transfer | core |
| pacs.009 | MT202COV | Cover Payment | cover |
| pacs.009 | MT202 | Advice Variant | advice |
| pacs.009 | MT205 | Serial FI Transfer | serial |
| pacs.009 | MT205COV | Serial Cover Payment | serial_cover |
| pain.001 | MT101 | Customer Credit Transfer Initiation | payment_initiation |

#### Status and Exception Handling

| ISO 20022 | SWIFT MT | Description | Scenario ID |
|-----------|----------|-------------|-------------|
| pacs.002 | MT103REJT | Payment Status Report Rejection | rejection |
| pacs.004 | MT103RETN | Payment Return | customer_return |
| pacs.004 | MT202RETN | FI Payment Return | fi_return |
| pacs.004 | MT205RETN | Serial FI Payment Return | serial_return |

#### Account Reporting

| ISO 20022 | SWIFT MT | Description | Scenario ID |
|-----------|----------|-------------|-------------|
| camt.052 | MT942 | Interim Transaction Report | interim_report |
| camt.053 | MT940 | Bank to Customer Statement | statement |
| camt.054 | MT103 | Customer Credit Notification | customer_notification |
| camt.054 | MT900 | Confirmation of Debit | debit_confirmation |
| camt.054 | MT910 | Confirmation of Credit | credit_confirmation |
| camt.054 | MT202 | Bank-to-Bank Notification | bank_notification |

#### Investigation and Cancellation

| ISO 20022 | SWIFT MT | Description | Scenario ID |
|-----------|----------|-------------|-------------|
| camt.029 | MT196 | Customer Payment Cancellation Response | cancellation_response_customer |
| camt.029 | MT296 | FI Payment Cancellation Response | cancellation_response_fi |
| camt.056 | MT192 | Payment Cancellation Request | cancellation_request |
| camt.057 | MT210 | Notification To Receive | notification_to_receive |
| camt.058 | MT292 | Notification to Receive Cancellation Advice | cancellation_advice |

#### Specialized Messages

| ISO 20022 | SWIFT MT | Description | Scenario ID |
|-----------|----------|-------------|-------------|
| camt.105 | MTn90 | Charges Payment Notification | charges_payment_notification |
| camt.106 | MT191 | Request for Payment of Charges (Customer) | customer_charges_request |
| camt.106 | MT291 | Request for Payment of Charges (FI) | fi_charges_request |
| camt.107 | MT110 | Advice of Cheque Collection | cheque_collection |
| camt.108 | MT111 | Stop of Cheque | stop_cheque |
| camt.109 | MT112 | Status of Request for Stop of Cheque | stop_cheque_status |
| pacs.003 | MT104 | Direct Debit Transaction | direct_debit |
| pacs.010 | MT204 | Margin Collection Direct Debit | margin_collection |
| admi.024 | MT199 | System Event Notification | system_notification |

### Handling Limitations

When transforming from ISO 20022 to MT, the service handles:

- **Field Length**: Intelligent truncation of long fields (e.g., 140 chars → 35 chars)
- **Character Set**: Automatic conversion from UTF-8 to SWIFT X-character set
- **Structure Mapping**: Converts structured addresses to 4x35 character lines
- **Data Preservation**: Prioritizes critical payment information
- **SR2025 Compliance**: Ensures output meets November 2025 SWIFT standards