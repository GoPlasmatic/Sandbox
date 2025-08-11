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
- **Validation**: Optional validation ensures message compliance
- **Character Set Conversion**: Ensures SWIFT character set compliance

### Supported Transformations

| ISO 20022 | SWIFT MT | Description |
|-----------|----------|-------------|
| pacs.008 | MT103 | Customer Credit Transfer |
| pacs.009 | MT202 | Financial Institution Credit Transfer |
| pacs.002 | MT012 | Payment Status Report |
| camt.053 | MT940/950 | Account Statement |
| camt.054 | MT900/910 | Debit/Credit Notification |
| camt.052 | MT942 | Interim Transaction Report |
| pain.001 | MT101 | Payment Initiation |

### Handling Limitations

When transforming from ISO 20022 to MT, the service handles:

- **Field Length**: Intelligent truncation of long fields (e.g., 140 chars → 35 chars)
- **Character Set**: Automatic conversion from UTF-8 to SWIFT X-character set
- **Structure Mapping**: Converts structured addresses to 4x35 character lines
- **Data Preservation**: Prioritizes critical payment information