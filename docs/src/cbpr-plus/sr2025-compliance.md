# SR2025 Compliance

SWIFT Standards Release 2025 compliance in Reframe.

## Overview

**SR2025** (Standards Release 2025) is SWIFT's mandatory update that becomes effective in November 2025. It introduces:

- Updated ISO 20022 message versions
- Business Application Header v3
- Enhanced data requirements
- New message types for cash management

Reframe's CBPR+ package is **fully SR2025 compliant**.

## Message Version Support

### Payment Messages

| Message | SR2025 Version | Previous Version |
|---------|----------------|------------------|
| pacs.002 | 001.14 | 001.12 |
| pacs.004 | 001.13 | 001.11 |
| pacs.008 | 001.12 | 001.10 |
| pacs.009 | 001.11 | 001.09 |
| pacs.010 | 001.06 | 001.04 |

### Cash Management Messages

| Message | SR2025 Version | Previous Version |
|---------|----------------|------------------|
| camt.029 | 001.13 | 001.11 |
| camt.052 | 001.12 | 001.10 |
| camt.053 | 001.12 | 001.10 |
| camt.054 | 001.12 | 001.10 |
| camt.056 | 001.12 | 001.10 |
| camt.057 | 001.08 | 001.06 |

### New SR2025 Messages

| Message | Version | Description |
|---------|---------|-------------|
| camt.105 | 001.02 | Charges Payment Notification |
| camt.106 | 001.02 | Charges Payment Request |
| camt.107 | 001.02 | Cheque Presentation Notification |
| camt.108 | 001.02 | Cheque Cancellation or Stop Request |
| camt.109 | 001.02 | Cheque Cancellation or Stop Report |
| admi.024 | 001.01 | System Event Notification |

## Business Application Header v3

SR2025 uses BAH version 3 (head.001.001.03) with enhanced features:

```xml
<AppHdr xmlns="urn:iso:std:iso:20022:tech:xsd:head.001.001.03">
  <Fr>
    <FIId>
      <FinInstnId>
        <BICFI>BNPAFRPPXXX</BICFI>
        <LEI>9695005MSX1OYEMGDF46</LEI>
      </FinInstnId>
    </FIId>
  </Fr>
  <To>
    <FIId>
      <FinInstnId>
        <BICFI>DEUTDEFFXXX</BICFI>
        <LEI>7LTWFZYICNSX8D621K86</LEI>
      </FinInstnId>
    </FIId>
  </To>
  <BizMsgIdr>MSG123456789</BizMsgIdr>
  <MsgDefIdr>pacs.008.001.12</MsgDefIdr>
  <BizSvc>swift.cbprplus.02</BizSvc>
  <CreDt>2025-01-15T10:30:00Z</CreDt>
  <Prty>NORM</Prty>
</AppHdr>
```

### BAH v3 Enhancements

| Field | Description | Notes |
|-------|-------------|-------|
| `LEI` | Legal Entity Identifier | 20-character code |
| `BizSvc` | Business Service | CBPR+ service identifier |
| `Prty` | Priority | HIGH, NORM, or empty |
| `PssblDplct` | Possible Duplicate | Boolean flag |

## UETR Requirements

The **UETR** (Unique End-to-End Transaction Reference) is mandatory for all CBPR+ payments:

### Format
- UUID version 4
- 36 characters including hyphens
- Example: `174d2c70-7a8c-4c0d-8b2e-5c2a9f8e6d3a`

### In Messages
- **ISO 20022**: `PmtId/UETR`
- **SWIFT MT**: Block 3, Tag 121

### Reframe Handling

```json
{
  "path": "data.output.PmtId.UETR",
  "logic": {
    "or": [
      {"var": "data.SwiftMT.block3.121"},
      {"uuid": []}
    ]
  }
}
```

If the source MT message contains Tag 121, it's preserved. Otherwise, a new UUID is generated.

## Enhanced Party Identification

SR2025 requires richer party identification:

### Legal Entity Identifier (LEI)

```xml
<Dbtr>
  <Nm>ACME CORPORATION</Nm>
  <Id>
    <OrgId>
      <LEI>5493001KJTIIGC8Y1R12</LEI>
    </OrgId>
  </Id>
</Dbtr>
```

### BIC + BEI Identification

```xml
<DbtrAgt>
  <FinInstnId>
    <BICFI>BNPAFRPPXXX</BICFI>
  </FinInstnId>
</DbtrAgt>
```

### Structured Address

SR2025 encourages structured addresses over free-form:

```xml
<PstlAdr>
  <StrtNm>123 MAIN STREET</StrtNm>
  <BldgNb>SUITE 500</BldgNb>
  <PstCd>10001</PstCd>
  <TwnNm>NEW YORK</TwnNm>
  <CtrySubDvsn>NY</CtrySubDvsn>
  <Ctry>US</Ctry>
</PstlAdr>
```

## Service Level Codes

CBPR+ service levels for SR2025:

| Code | Name | Description | SLA |
|------|------|-------------|-----|
| G001 | URGP | Urgent Payment | Immediate |
| G002 | NURG | Normal Urgent | Same day |
| G003 | SDVA | Same Day Value | End of day |
| G004 | NORM | Normal | Next day |

### Mapping from MT

```json
{
  "if": [
    {"==": [{"var": "fields.23E"}, "URGP"]},
    "G001",
    {"if": [
      {"==": [{"var": "fields.23B"}, "SPAY"]},
      "G003",
      "G002"
    ]}
  ]
}
```

## Structured Remittance

SR2025 supports structured remittance information:

### Structured Format

```xml
<RmtInf>
  <Strd>
    <RfrdDocInf>
      <Tp>
        <CdOrPrtry>
          <Cd>CINV</Cd>
        </CdOrPrtry>
      </Tp>
      <Nb>INV-2025-001234</Nb>
      <RltdDt>2025-01-10</RltdDt>
    </RfrdDocInf>
    <RfrdDocAmt>
      <DuePyblAmt Ccy="USD">50000.00</DuePyblAmt>
    </RfrdDocAmt>
  </Strd>
</RmtInf>
```

### Document Types

| Code | Description |
|------|-------------|
| CINV | Commercial Invoice |
| CREN | Credit Note |
| DEBN | Debit Note |
| SOAC | Statement of Account |
| DISP | Dispatch Advice |

## Regulatory Reporting

Enhanced regulatory reporting for SR2025:

```xml
<RgltryRptg>
  <DbtCdtRptgInd>DEBT</DbtCdtRptgInd>
  <Authrty>
    <Nm>CENTRAL BANK</Nm>
    <Ctry>US</Ctry>
  </Authrty>
  <Dtls>
    <Tp>CRED</Tp>
    <Cd>GOODS</Cd>
    <Amt Ccy="USD">50000.00</Amt>
    <Inf>PAYMENT FOR GOODS</Inf>
  </Dtls>
</RgltryRptg>
```

## Validation Rules

Reframe enforces SR2025 validation rules:

### Mandatory Fields

| Message | Required Fields |
|---------|-----------------|
| pacs.008 | UETR, IntrBkSttlmAmt, IntrBkSttlmDt, ChrgBr |
| pacs.009 | UETR, IntrBkSttlmAmt, IntrBkSttlmDt |
| camt.056 | OrgnlMsgId, OrgnlMsgNmId, CxlRsnInf |

### Format Validations

| Field | Rule |
|-------|------|
| BIC | 8 or 11 characters |
| LEI | 20 characters |
| UETR | UUID v4 format |
| IBAN | Country-specific length |
| Amount | Max 18 digits, 5 decimals |

## Coexistence Period

During the SR2025 migration, Reframe supports:

### Bidirectional Translation
- Convert MT messages to SR2025-compliant ISO 20022
- Convert ISO 20022 back to MT for legacy systems

### Version Handling
- Accept older ISO 20022 versions
- Output latest SR2025 versions
- Preserve data through translation

### Feature Degradation
- LEI stripped when converting to MT
- Structured addresses converted to free-form
- Structured remittance converted to unstructured

## Testing SR2025 Compliance

### Generate SR2025 Messages

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"message_type": "pacs.008", "scenario": "sr2025_standard"}'
```

### Validate SR2025 Compliance

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "message": "<ISO 20022 message>",
    "business_validation": true
  }'
```

---

**[Back to CBPR+ Overview →](./overview.md)**

**[View Message Catalog →](./message-catalog.md)**
