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
- **Validation**: Optional validation before transformation ensures message integrity
- **CBPR+ Compliance**: Ensures transformed messages meet Cross-Border Payments and Reporting Plus requirements

### Supported Transformations

| SWIFT MT | ISO 20022 | Description |
|----------|-----------|-------------|
| MT103 | pacs.008 | Customer Credit Transfer |
| MT202 | pacs.009 | Financial Institution Credit Transfer |
| MT900 | camt.054 | Debit Confirmation |
| MT910 | camt.054 | Credit Confirmation |
| MT940 | camt.053 | Customer Statement |
| MT950 | camt.053 | Statement Message |