# CBPR+ Package: SWIFT MT to ISO 20022 Migration Guide

The free, open source CBPR+ transformation package for SWIFT MT to ISO 20022 migration with SR2025 compliance.

## About This Package

The **SWIFT CBPR+ Package** is a free, open-source transformation package for Reframe. It provides:

- **41+ transformation scenarios** for SWIFT MT ↔ ISO 20022
- **SR2025 compliance** for the November 2025 migration deadline
- **Bidirectional support** - convert in both directions
- **594 JSON rule files** - fully auditable transformation logic

| | |
|---|---|
| **GitHub** | [github.com/GoPlasmatic/reframe-package-swift-cbpr](https://github.com/GoPlasmatic/reframe-package-swift-cbpr) |
| **License** | Apache 2.0 (Free) |
| **Version** | 2.1.2 |

## What is CBPR+?

**CBPR+** (Cross-Border Payments and Reporting Plus) is SWIFT's framework for the migration from MT messages to ISO 20022. It defines:

- Which ISO 20022 messages replace which MT messages
- Field mapping guidelines between formats
- Business rules and validation requirements
- Coexistence rules during the migration period

## SR2025 Compliance

This CBPR+ package is fully compliant with **SWIFT Standards Release 2025** (SR2025), which becomes mandatory in November 2025. Key SR2025 features:

- Business Application Header v3
- UETR (Unique End-to-End Transaction Reference) support
- Enhanced party identification with LEI
- Structured remittance information
- Updated message versions (pacs.008.001.12, pacs.009.001.11, etc.)

## Supported Transformations

The CBPR+ package supports **41+ transformation scenarios** across payment, status, and administrative messages.

### Message Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **Customer Payments** | Individual customer transfers | MT103 ↔ pacs.008 |
| **FI Transfers** | Bank-to-bank transfers | MT202 ↔ pacs.009 |
| **Returns** | Payment returns | MT103 RETN ↔ pacs.004 |
| **Rejections** | Payment rejections | MT103 REJT ↔ pacs.002 |
| **Cancellations** | Cancellation requests | MT192 ↔ camt.056 |
| **Status** | Payment status reports | MT199 ↔ camt.029 |
| **Cash Management** | Account statements | MT940 ↔ camt.053 |

### Direction Terminology

| Term | Direction | Description |
|------|-----------|-------------|
| **Outgoing** | MT → MX | SWIFT MT converted to ISO 20022 |
| **Incoming** | MX → MT | ISO 20022 converted to SWIFT MT |

## Package Structure

The CBPR+ package contains 594 JSON rule files organized by transformation type:

```
reframe-package-swift-cbpr/
├── reframe-package.json          # Package metadata
│
├── transform/                    # Transformation workflows
│   ├── outgoing/                # MT → ISO 20022
│   │   ├── MT103/               # Customer transfers
│   │   ├── MT202/               # FI transfers
│   │   ├── MT192/               # Cancellations
│   │   └── ...
│   │
│   └── incoming/                # ISO 20022 → MT
│       ├── pacs008/             # FIToFICustomerCreditTransfer
│       ├── pacs009/             # FIToFIFinancialInstitutionCreditTransfer
│       ├── camt056/             # FIToFIPaymentCancellationRequest
│       └── ...
│
├── validate/                    # Validation rules
└── generate/                    # Sample generation
```

## Message Flow

### Outgoing Flow (MT → ISO 20022)

```
MT103 Message
      │
      ▼
┌─────────────────┐
│ 1. Parse MT     │  Extract SWIFT blocks and fields
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Detect Type  │  Identify variant (standard/STP/REJT/RETN)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. Apply Rules  │  Execute CBPR+ mapping rules
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. Generate XML │  Create ISO 20022 envelope
└────────┬────────┘
         │
         ▼
   pacs.008 XML
```

### Incoming Flow (ISO 20022 → MT)

```
pacs.008 XML
      │
      ▼
┌─────────────────┐
│ 1. Parse XML    │  Extract ISO 20022 structure
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Detect MT    │  Determine target MT type
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. Apply Rules  │  Execute reverse mapping rules
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. Generate MT  │  Create SWIFT message blocks
└────────┬────────┘
         │
         ▼
   MT103 Message
```

## Key Concepts

### Business Application Header (BAH)

ISO 20022 messages include a BAH with routing information:

```xml
<AppHdr xmlns="urn:iso:std:iso:20022:tech:xsd:head.001.001.03">
  <Fr><FIId><FinInstnId><BICFI>SENDERXX</BICFI></FinInstnId></FIId></Fr>
  <To><FIId><FinInstnId><BICFI>RECEIVERXX</BICFI></FinInstnId></FIId></To>
  <BizMsgIdr>MSG123</BizMsgIdr>
  <MsgDefIdr>pacs.008.001.12</MsgDefIdr>
  <CreDt>2025-01-15T10:30:00Z</CreDt>
</AppHdr>
```

The BAH is generated from MT Block 1 and Block 2 information.

### UETR (Unique End-to-End Transaction Reference)

UETR provides end-to-end tracking for payments:

- Format: UUID v4 (e.g., `174d2c70-7a8c-4c0d-8b2e-5c2a9f8e6d3a`)
- In MT: Tag 121 in Block 3
- In ISO 20022: `PmtId/UETR`

### Service Level Codes

CBPR+ defines service levels for payment processing:

| Code | Name | Description |
|------|------|-------------|
| G001 | URGP | Urgent payment (high priority) |
| G002 | NURG | Normal urgent (standard) |
| G003 | SDVA | Same-day value |
| G004 | NORM | Normal (next-day) |

## Try the Transformations

### Interactive Playground

<div class="reframe-playground" data-tab="transform"></div>

### API Examples

```bash
# MT103 → pacs.008
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{"message": "{1:F01...}{2:I103...}{4:...}"}'

# pacs.008 → MT103
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{"message": "<?xml version=\"1.0\"?>..."}'
```

---

**[View Message Catalog →](./message-catalog.md)**

**[MT to ISO 20022 Transformations →](./mt-to-iso20022/overview.md)**

**[ISO 20022 to MT Transformations →](./iso20022-to-mt/overview.md)**
