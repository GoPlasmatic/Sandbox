# ISO 20022 to MT Transformations

Converting ISO 20022 messages to SWIFT MT format.

## Overview

Incoming transformations convert ISO 20022 XML messages to legacy SWIFT MT format. This direction supports:

- Systems that haven't migrated to ISO 20022
- Legacy downstream applications
- Parallel running during migration
- Fallback scenarios

## Transformation Pipeline

Every ISO 20022 → MT transformation follows this pipeline:

```
┌─────────────────────────────────────────────────────────────┐
│                  ISO 20022 → MT Pipeline                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Parse XML             Priority 1                        │
│     Extract ISO 20022 structure to JSON                     │
│                                                             │
│  2. Detect Target MT      Priority 2                        │
│     Determine appropriate MT message type                   │
│                                                             │
│  3. Pre-conditions        Priority 3                        │
│     Validate transformation feasibility                     │
│                                                             │
│  4. Map Headers           Priority 4                        │
│     Construct MT Block 1, 2, 3                              │
│                                                             │
│  5. Map Fields            Priority 5-9                      │
│     Transform ISO 20022 elements to MT tags                 │
│                                                             │
│  6. Post-conditions       Priority 10                       │
│     Validate MT structure and assemble                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Supported Transformations

### Payment Messages

| Source | Target | Description |
|--------|--------|-------------|
| pain.001 | MT101 | Customer Credit Transfer Initiation |
| pacs.002 | MT103 REJT / MT202 REJT | Payment Status Report |
| pacs.003 | MT104 | Direct Debit |
| pacs.004 | MT103 RETN / MT202 RETN | Payment Return |
| pacs.008 | MT103 | Customer Credit Transfer |
| pacs.009 | MT202 / MT202 COV / MT205 | FI Credit Transfer |
| pacs.010 | MT204 | Financial Institution Direct Debit |

### Cash Management Messages

| Source | Target | Description |
|--------|--------|-------------|
| camt.029 | MT196 / MT296 | Resolution of Investigation |
| camt.052 | MT942 / MT941 | Account Report |
| camt.053 | MT940 | Bank Statement |
| camt.054 | MT900 / MT910 | Debit/Credit Notification |
| camt.056 | MT192 / MT292 | Cancellation Request |
| camt.057 | MT210 | Notification to Receive |

### SR2025 Messages

| Source | Target | Description |
|--------|--------|-------------|
| camt.105 | MTn90 | Charges Payment Notification |
| camt.106 | MTn91 | Charges Payment Request |
| camt.107 | MT110 | Cheque Presentation |
| camt.108 | MT111 | Cheque Cancellation Request |
| camt.109 | MT112 | Cheque Cancellation Report |
| admi.024 | MT199 | System Event Notification |

## Target MT Detection

The target MT type is determined by analyzing the ISO 20022 message:

### pacs.008 → MT Detection

```json
{
  "if": [
    {"!!": {"var": "data.MX.UndrlygCstmrCdtTrf"}},
    "MT103",
    {"if": [
      {"==": [{"var": "data.MX.PmtTpInf.LclInstrm.Prtry"}, "COVER"]},
      "MT202COV",
      "MT103"
    ]}
  ]
}
```

### pacs.009 → MT Detection

| Condition | Target MT |
|-----------|-----------|
| Has UnderlyingCustomerCreditTransfer | MT202 COV |
| InterbankSettlement only | MT202 |
| Third party indicator | MT205 |

### camt.054 → MT Detection

| Condition | Target MT |
|-----------|-----------|
| Debit entry | MT900 |
| Credit entry | MT910 |
| Multiple entries | Multiple MTs |

## Common Field Mappings

### Header Generation

| ISO 20022 Source | MT Target | Notes |
|------------------|-----------|-------|
| `AppHdr/Fr/FIId/FinInstnId/BICFI` | Block 1 BIC | Sender |
| `AppHdr/To/FIId/FinInstnId/BICFI` | Block 2 BIC | Receiver |
| `PmtId/UETR` | Block 3 Tag 121 | End-to-end tracking |
| `AppHdr/BizMsgIdr` | Tag 20 | Reference |

### Amount Mapping

| ISO 20022 Source | MT Target | Notes |
|------------------|-----------|-------|
| `IntrBkSttlmDt` | Tag 32A (date) | YYYY-MM-DD → YYMMDD |
| `IntrBkSttlmAmt/@Ccy` | Tag 32A (currency) | 3-letter code |
| `IntrBkSttlmAmt` | Tag 32A (amount) | Add comma separator |

### Party Mapping

| ISO 20022 Source | MT Target | Notes |
|------------------|-----------|-------|
| `Dbtr/Nm` | Tag 50K Line 1 | Debtor name |
| `Dbtr/PstlAdr/AdrLine` | Tag 50K Lines 2-4 | Address |
| `DbtrAcct/Id/IBAN` | Tag 50K Account | With / prefix |
| `DbtrAcct/Id/Othr/Id` | Tag 50K Account | With / prefix |
| `Cdtr/Nm` | Tag 59 Line 1 | Creditor name |
| `CdtrAcct/Id/IBAN` | Tag 59 Account | With / prefix |

### Agent Mapping

| ISO 20022 Source | MT Target | Notes |
|------------------|-----------|-------|
| `DbtrAgt/FinInstnId/BICFI` | Tag 52A | Debtor's bank |
| `CdtrAgt/FinInstnId/BICFI` | Tag 57A | Creditor's bank |
| `IntrmyAgt1/FinInstnId/BICFI` | Tag 56A | Intermediary |

### Charge Bearer Mapping

| ISO 20022 | MT (Tag 71A) |
|-----------|--------------|
| SHAR | SHA |
| DEBT | OUR |
| CRED | BEN |

## Data Truncation Rules

MT messages have field length limits. ISO 20022 data is truncated when necessary:

| MT Field | Max Length | Truncation Rule |
|----------|------------|-----------------|
| Tag 20 | 16 chars | Truncate right |
| Tag 50K/59 name | 35 chars | Truncate right |
| Tag 50K/59 address | 35 chars/line | Truncate per line |
| Tag 70 | 4 x 35 chars | Truncate total |
| Tag 72 | 6 x 35 chars | Truncate total |

## Example Transformation

### Input: pacs.008

```xml
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.12">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>MSG123456789</MsgId>
      <CreDtTm>2025-01-15T10:30:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf><SttlmMtd>INDA</SttlmMtd></SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <InstrId>INSTR123</InstrId>
        <EndToEndId>E2E123</EndToEndId>
        <UETR>174d2c70-7a8c-4c0d-8b2e-5c2a9f8e6d3a</UETR>
      </PmtId>
      <IntrBkSttlmAmt Ccy="EUR">25000.00</IntrBkSttlmAmt>
      <IntrBkSttlmDt>2025-01-15</IntrBkSttlmDt>
      <ChrgBr>SHAR</ChrgBr>
      <Dbtr><Nm>SENDER COMPANY</Nm></Dbtr>
      <DbtrAcct><Id><IBAN>FR7630006000011234567890189</IBAN></Id></DbtrAcct>
      <DbtrAgt><FinInstnId><BICFI>BNPAFRPPXXX</BICFI></FinInstnId></DbtrAgt>
      <CdtrAgt><FinInstnId><BICFI>DEUTDEFFXXX</BICFI></FinInstnId></CdtrAgt>
      <Cdtr><Nm>RECEIVER GMBH</Nm></Cdtr>
      <CdtrAcct><Id><IBAN>DE89370400440532013000</IBAN></Id></CdtrAcct>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>
```

### Output: MT103

```swift
{1:F01BNPAFRPPXXX0000000000}
{2:I103DEUTDEFFXXXXN}
{3:{121:174d2c70-7a8c-4c0d-8b2e-5c2a9f8e6d3a}}
{4:
:20:INSTR123
:23B:CRED
:32A:250115EUR25000,00
:50K:/FR7630006000011234567890189
SENDER COMPANY
:57A:DEUTDEFFXXX
:59:/DE89370400440532013000
RECEIVER GMBH
:71A:SHA
-}
```

## Try It

<div class="reframe-playground" data-tab="transform"></div>

## API Example

```bash
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{
    "message": "<?xml version=\"1.0\"?><Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:pacs.008.001.12\">...</Document>"
  }'
```

The API automatically detects ISO 20022 input and applies the appropriate reverse transformation.

---

**[Back to CBPR+ Overview →](../overview.md)**

**[View Message Catalog →](../message-catalog.md)**
