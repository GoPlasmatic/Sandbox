# MT to ISO 20022 Transformations

Converting SWIFT MT messages to ISO 20022 format.

## Overview

Outgoing transformations convert legacy SWIFT MT messages to ISO 20022 XML format. This is the primary direction for institutions migrating to ISO 20022 for cross-border payments.

## Transformation Pipeline

Every MT → ISO 20022 transformation follows this pipeline:

```
┌─────────────────────────────────────────────────────────────┐
│                    MT → ISO 20022 Pipeline                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Parse MT              Priority 1                        │
│     Extract blocks, tags, and field values                  │
│                                                             │
│  2. Detect Message Type   Priority 2                        │
│     Identify MT variant (standard, STP, REJT, RETN)         │
│                                                             │
│  3. Map BAH               Priority 3                        │
│     Create Business Application Header from MT headers      │
│                                                             │
│  4. Pre-conditions        Priority 4                        │
│     Validate business rules before transformation           │
│                                                             │
│  5. Map Document          Priority 5                        │
│     Transform MT fields to ISO 20022 document structure     │
│                                                             │
│  6. Post-conditions       Priority 6                        │
│     Validate output compliance                              │
│                                                             │
│  7. Combine XML           Priority 10                       │
│     Generate final ISO 20022 XML envelope                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Supported Transformations

### Customer Payments

| Source | Target | Description | Details |
|--------|--------|-------------|---------|
| MT103 | pacs.008 | Customer Credit Transfer | [View →](./mt103-to-pacs008.md) |
| MT103 STP | pacs.008 | Straight-Through Processing | |
| MT103 REJT | pacs.002 | Payment Rejection | |
| MT103 RETN | pacs.004 | Payment Return | |

### Financial Institution Transfers

| Source | Target | Description |
|--------|--------|-------------|
| MT200 | pacs.009 | Own Account Transfer |
| MT202 | pacs.009 | General FI Transfer |
| MT202 COV | pacs.009 | Cover Payment |
| MT202 REJT | pacs.002 | FI Transfer Rejection |
| MT202 RETN | pacs.004 | FI Transfer Return |
| MT205 | pacs.009 | Third Party FI Transfer |
| MT205 COV | pacs.009 | Cover Payment (Third Party) |

### Cancellation & Investigation

| Source | Target | Description |
|--------|--------|-------------|
| MT192 | camt.056 | Customer Payment Cancellation |
| MT196 | camt.029 | Cancellation Response |
| MT292 | camt.056 | FI Payment Cancellation |
| MT296 | camt.029 | FI Cancellation Response |

### Cash Management

| Source | Target | Description |
|--------|--------|-------------|
| MT900 | camt.054 | Debit Confirmation |
| MT910 | camt.054 | Credit Confirmation |

## Common Field Mappings

These mappings apply across multiple MT → ISO 20022 transformations:

### Header Mappings

| MT Source | ISO 20022 Target | Description |
|-----------|------------------|-------------|
| Block 1 BIC | `AppHdr/Fr/FIId/FinInstnId/BICFI` | Sender identification |
| Block 2 BIC | `AppHdr/To/FIId/FinInstnId/BICFI` | Receiver identification |
| Tag 20 | `AppHdr/BizMsgIdr` | Message identifier |
| Tag 121 (Block 3) | `PmtId/UETR` | End-to-end tracking |

### Amount Mappings

| MT Source | ISO 20022 Target | Notes |
|-----------|------------------|-------|
| Tag 32A Date | `IntrBkSttlmDt` | YYMMDD → YYYY-MM-DD |
| Tag 32A Currency | `IntrBkSttlmAmt/@Ccy` | 3-letter code |
| Tag 32A Amount | `IntrBkSttlmAmt` | Remove comma separator |

### Party Mappings

| MT Source | ISO 20022 Target | Notes |
|-----------|------------------|-------|
| Tag 50K/50F | `Dbtr` | Ordering customer |
| Tag 50K Account | `DbtrAcct/Id/Othr/Id` | Account number |
| Tag 59/59A | `Cdtr` | Beneficiary |
| Tag 59 Account | `CdtrAcct/Id/Othr/Id` | Account number |

### Agent Mappings

| MT Source | ISO 20022 Target | Notes |
|-----------|------------------|-------|
| Tag 52A | `DbtrAgt` | Debtor's bank |
| Tag 53A/53B | `InstgAgt` or `IntrmyAgt1` | Intermediary |
| Tag 54A | `IntrmyAgt1` | Intermediary |
| Tag 57A | `CdtrAgt` | Creditor's bank |

### Charge Bearer Mapping

| MT (Tag 71A) | ISO 20022 | Code |
|--------------|-----------|------|
| SHA | SHAR | Shared |
| OUR | DEBT | All charges to debtor |
| BEN | CRED | All charges to creditor |

## Business Rules

### Service Level Determination

The CBPR+ service level is determined from MT fields:

```json
{
  "if": [
    {"==": [{"var": "fields.23E.instruction_code"}, "URGP"]},
    "G001",
    {"if": [
      {"==": [{"var": "fields.23B.bank_operation_code"}, "SPAY"]},
      "G003",
      "G002"
    ]}
  ]
}
```

| MT Indicator | Service Level | Priority |
|--------------|---------------|----------|
| 23E: URGP | G001 | Urgent |
| 23B: SPAY | G003 | Same-day |
| Default | G002 | Normal |

### UETR Handling

If Tag 121 exists in Block 3, it's used as the UETR. Otherwise, a new UUID is generated.

### Date Conversion

MT dates (YYMMDD) are converted to ISO format (YYYY-MM-DD):

| MT | ISO 20022 |
|----|-----------|
| 250115 | 2025-01-15 |
| 991231 | 2099-12-31 |

## Example Transformation

### Input: MT103

```swift
{1:F01BNPAFRPPXXX0000000000}
{2:I103DEUTDEFFXXXXN}
{3:{121:174d2c70-7a8c-4c0d-8b2e-5c2a9f8e6d3a}}
{4:
:20:REF123456
:23B:CRED
:32A:250115USD50000,00
:50K:/12345678
ACME CORPORATION
:59:/98765432
GLOBAL TRADING LTD
:71A:SHA
-}
```

### Output: pacs.008

```xml
<?xml version="1.0"?>
<BizMsg xmlns="urn:iso:std:iso:20022:tech:xsd:head.001.001.03">
  <AppHdr>
    <Fr><FIId><FinInstnId><BICFI>BNPAFRPPXXX</BICFI></FinInstnId></FIId></Fr>
    <To><FIId><FinInstnId><BICFI>DEUTDEFFXXX</BICFI></FinInstnId></FIId></To>
    <BizMsgIdr>REF123456</BizMsgIdr>
    <MsgDefIdr>pacs.008.001.12</MsgDefIdr>
  </AppHdr>
  <Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.12">
    <FIToFICstmrCdtTrf>
      <CdtTrfTxInf>
        <PmtId>
          <InstrId>REF123456</InstrId>
          <UETR>174d2c70-7a8c-4c0d-8b2e-5c2a9f8e6d3a</UETR>
        </PmtId>
        <IntrBkSttlmAmt Ccy="USD">50000.00</IntrBkSttlmAmt>
        <IntrBkSttlmDt>2025-01-15</IntrBkSttlmDt>
        <ChrgBr>SHAR</ChrgBr>
        <Dbtr><Nm>ACME CORPORATION</Nm></Dbtr>
        <DbtrAcct><Id><Othr><Id>12345678</Id></Othr></Id></DbtrAcct>
        <Cdtr><Nm>GLOBAL TRADING LTD</Nm></Cdtr>
        <CdtrAcct><Id><Othr><Id>98765432</Id></Othr></Id></CdtrAcct>
      </CdtTrfTxInf>
    </FIToFICstmrCdtTrf>
  </Document>
</BizMsg>
```

## Try It

<div class="reframe-playground" data-tab="transform"></div>

---

**[MT103 → pacs.008 Details →](./mt103-to-pacs008.md)**

**[Back to CBPR+ Overview →](../overview.md)**
