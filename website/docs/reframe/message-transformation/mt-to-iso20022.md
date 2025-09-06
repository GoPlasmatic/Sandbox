---
sidebar_position: 1
---

import MTtoISO20022TransformerWrapper from '@site/src/components/TransformationConverter/MTtoISO20022TransformerWrapper';

# SWIFT MT to ISO 20022 Transformation

Transform SWIFT MT messages to ISO 20022 format with our bidirectional transformation service.

<MTtoISO20022TransformerWrapper />

## Overview

The MT to ISO 20022 transformation service converts legacy SWIFT MT format messages into modern ISO 20022 XML format. This transformation preserves all critical payment information while enabling enhanced data capabilities.

### Key Features

- **Full Message Preservation**: All fields from MT messages are mapped to corresponding ISO 20022 elements
- **UETR Handling**: Preserves or generates Unique End-to-end Transaction Reference
- **Validation**: SR2025-compliant validation before transformation ensures message integrity
- **CBPR+ Compliance**: Enhanced Cross-Border Payments and Reporting Plus requirements
- **SR2025 Standards**: Full compliance with SWIFT Release 2025 (November) specifications
- **Performance Optimized**: Sub-millisecond transformation with configurable threading
- **Scenario-Based Processing**: 22 pre-configured forward transformation scenarios

### Supported Transformations

#### Payment Messages

| SWIFT MT | ISO 20022 | Description | Scenario ID |
|----------|-----------|-------------|-------------|
| MT101 | pain.001 | Single Payment Initiation (CBPR+ Compliant) | single_payment |
| MT103 | pacs.008 | Standard Cross-Border Payment | standard |
| MT103 | pacs.008 | High Value Payment with Priority | high_value |
| MT103 | pacs.008 | Remittance with Enhanced Information | remittance |
| MT200 | pacs.009 | FI Transfer for Own Account | own_account |
| MT202 | pacs.009 | Core Financial Institution Transfer | core |
| MT202COV | pacs.009 | Cover Payment | cover |
| MT205 | pacs.009 | Serial Financial Institution Transfer | serial |
| MT205COV | pacs.009 | Serial Cover Payment | serial_cover |

#### Status and Exception Handling

| SWIFT MT | ISO 20022 | Description | Scenario ID |
|----------|-----------|-------------|-------------|
| MT103REJT | pacs.002 | Payment Rejection Status Report | rejection |
| MT103RETN | pacs.004 | Payment Return | return |
| MT202REJT | pacs.002 | FI Transfer Rejection | fi_rejection |
| MT202RETN | pacs.004 | FI Transfer Return | fi_return |
| MT205REJT | pacs.002 | Serial FI Transfer Rejection | serial_rejection |
| MT205RETN | pacs.004 | Serial FI Transfer Return | serial_return |

#### Investigation and Cancellation

| SWIFT MT | ISO 20022 | Description | Scenario ID |
|----------|-----------|-------------|-------------|
| MT192 | camt.056 | Customer Payment Cancellation Request | cancellation_request |
| MT196 | camt.029 | Customer Investigation Resolution | investigation_resolution |
| MT292 | camt.056 | FI Payment Cancellation Request | fi_cancellation |
| MT296 | camt.029 | FI Investigation Resolution | fi_resolution |

#### Account Notifications

| SWIFT MT | ISO 20022 | Description | Scenario ID |
|----------|-----------|-------------|-------------|
| MT900 | camt.054 | Confirmation of Debit | debit |
| MT910 | camt.054 | Confirmation of Credit | credit |