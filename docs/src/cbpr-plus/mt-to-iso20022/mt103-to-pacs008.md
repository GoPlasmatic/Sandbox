# MT103 → pacs.008 Transformation

Complete guide to transforming SWIFT MT103 to ISO 20022 pacs.008.

## Overview

MT103 (Single Customer Credit Transfer) is the most common SWIFT message type. It transforms to **pacs.008** (FIToFICustomerCreditTransfer) in ISO 20022.

| Attribute | Value |
|-----------|-------|
| Source Message | MT103 |
| Target Message | pacs.008.001.12 |
| Direction | Outgoing (MT → MX) |
| Category | Customer Payments |
| SR2025 | Fully compliant |

## Message Structure Comparison

### MT103 Structure

```
{1:F01...}           Basic Header
{2:I103...}          Application Header
{3:{121:...}}        User Header (UETR)
{4:                  Text Block
:20:                 Transaction Reference
:23B:                Bank Operation Code
:32A:                Value Date/Currency/Amount
:50K:                Ordering Customer
:52A:                Ordering Institution
:53A:                Sender's Correspondent
:54A:                Receiver's Correspondent
:56A:                Intermediary
:57A:                Account With Institution
:59:                 Beneficiary
:70:                 Remittance Information
:71A:                Details of Charges
:71F:                Sender's Charges
:71G:                Receiver's Charges
:72:                 Sender to Receiver Info
:77B:                Regulatory Reporting
-}
```

### pacs.008 Structure

```xml
<Document>
  <FIToFICstmrCdtTrf>
    <GrpHdr>                    Group Header
      <MsgId>                   Message Identification
      <CreDtTm>                 Creation Date Time
      <NbOfTxs>                 Number of Transactions
      <SttlmInf>                Settlement Information
    </GrpHdr>
    <CdtTrfTxInf>               Credit Transfer Transaction
      <PmtId>                   Payment Identification
      <PmtTpInf>                Payment Type Information
      <IntrBkSttlmAmt>          Interbank Settlement Amount
      <IntrBkSttlmDt>           Interbank Settlement Date
      <ChrgBr>                  Charge Bearer
      <Dbtr>                    Debtor
      <DbtrAcct>                Debtor Account
      <DbtrAgt>                 Debtor Agent
      <CdtrAgt>                 Creditor Agent
      <Cdtr>                    Creditor
      <CdtrAcct>                Creditor Account
      <RmtInf>                  Remittance Information
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>
```

## Complete Field Mapping Table

### Header Mappings

| MT Field | ISO 20022 Path | Rule | Example |
|----------|----------------|------|---------|
| Block 1 BIC | `AppHdr/Fr/FIId/FinInstnId/BICFI` | Direct | BNPAFRPPXXX |
| Block 2 BIC | `AppHdr/To/FIId/FinInstnId/BICFI` | Direct | DEUTDEFFXXX |
| Tag 20 | `AppHdr/BizMsgIdr` | Direct | REF123456 |
| Tag 20 | `GrpHdr/MsgId` | Direct | REF123456 |
| Tag 20 | `PmtId/InstrId` | Direct | REF123456 |
| Tag 121 | `PmtId/UETR` | Direct | UUID |

### Amount & Date Mappings

| MT Field | ISO 20022 Path | Rule | Example |
|----------|----------------|------|---------|
| Tag 32A (date) | `IntrBkSttlmDt` | YYMMDD → YYYY-MM-DD | 250115 → 2025-01-15 |
| Tag 32A (currency) | `IntrBkSttlmAmt/@Ccy` | Direct | USD |
| Tag 32A (amount) | `IntrBkSttlmAmt` | Remove comma | 50000,00 → 50000.00 |
| Tag 33B (currency) | `InstdAmt/@Ccy` | Direct | EUR |
| Tag 33B (amount) | `InstdAmt` | Remove comma | 45000,00 → 45000.00 |
| Tag 36 | `XchgRate` | Direct | 1.1234 |

### Ordering Customer (Debtor) Mappings

| MT Field | ISO 20022 Path | Notes |
|----------|----------------|-------|
| Tag 50K Line 1 (with /) | `DbtrAcct/Id/Othr/Id` | Account number |
| Tag 50K Name | `Dbtr/Nm` | Customer name |
| Tag 50K Address | `Dbtr/PstlAdr/AdrLine` | Address lines |
| Tag 50F /1 | `Dbtr/Nm` | Structured name |
| Tag 50F /2 | `Dbtr/PstlAdr/StrtNm` | Street |
| Tag 50F /3 | `Dbtr/PstlAdr/TwnNm` | Town |
| Tag 50F /4 | `Dbtr/PstlAdr/Ctry` | Country |

### Beneficiary (Creditor) Mappings

| MT Field | ISO 20022 Path | Notes |
|----------|----------------|-------|
| Tag 59 Line 1 (with /) | `CdtrAcct/Id/Othr/Id` | Account number |
| Tag 59 Name | `Cdtr/Nm` | Beneficiary name |
| Tag 59 Address | `Cdtr/PstlAdr/AdrLine` | Address lines |
| Tag 59A | `Cdtr/Id/OrgId/AnyBIC` | BIC identification |
| Tag 59F /1 | `Cdtr/Nm` | Structured name |

### Agent (Bank) Mappings

| MT Field | ISO 20022 Path | Notes |
|----------|----------------|-------|
| Tag 52A | `DbtrAgt/FinInstnId/BICFI` | Ordering institution |
| Tag 52D | `DbtrAgt/FinInstnId/Nm` + `PstlAdr` | Name and address |
| Tag 53A | `InstgAgt/FinInstnId/BICFI` | Sender's correspondent |
| Tag 53B | `InstgAgt/FinInstnId/ClrSysMmbId` | Clearing system |
| Tag 54A | `IntrmyAgt1/FinInstnId/BICFI` | Receiver's correspondent |
| Tag 56A | `IntrmyAgt2/FinInstnId/BICFI` | Intermediary |
| Tag 57A | `CdtrAgt/FinInstnId/BICFI` | Account with institution |
| Tag 57D | `CdtrAgt/FinInstnId/Nm` + `PstlAdr` | Name and address |

### Charges Mappings

| MT Field | ISO 20022 Path | Mapping |
|----------|----------------|---------|
| Tag 71A: SHA | `ChrgBr` | SHAR |
| Tag 71A: OUR | `ChrgBr` | DEBT |
| Tag 71A: BEN | `ChrgBr` | CRED |
| Tag 71F | `ChrgsInf/Amt` + `Agt` | Sender's charges |
| Tag 71G | `ChrgsInf/Amt` + `Agt` | Receiver's charges |

### Remittance & Regulatory

| MT Field | ISO 20022 Path | Notes |
|----------|----------------|-------|
| Tag 70 | `RmtInf/Ustrd` | Unstructured remittance |
| Tag 72 | `InstrForCdtrAgt` | Sender to receiver info |
| Tag 77B | `RgltryRptg` | Regulatory reporting |

## Business Rules Applied

### Service Level Determination

```json
{
  "path": "data.output.PmtTpInf.SvcLvl.Cd",
  "logic": {
    "if": [
      {"==": [{"var": "data.SwiftMT.fields.23E.instruction_code"}, "URGP"]},
      "G001",
      {"if": [
        {"==": [{"var": "data.SwiftMT.fields.23B.bank_operation_code"}, "SPAY"]},
        "G003",
        "G002"
      ]}
    ]
  }
}
```

### Settlement Method

```json
{
  "path": "data.output.GrpHdr.SttlmInf.SttlmMtd",
  "logic": {
    "if": [
      {"!!": {"var": "data.SwiftMT.fields.53A"}},
      "COVE",
      "INDA"
    ]
  }
}
```

### Charge Bearer Conversion

```json
{
  "path": "data.output.ChrgBr",
  "logic": {
    "if": [
      {"==": [{"var": "data.SwiftMT.fields.71A.details_of_charges"}, "SHA"]},
      "SHAR",
      {"if": [
        {"==": [{"var": "data.SwiftMT.fields.71A.details_of_charges"}, "OUR"]},
        "DEBT",
        "CRED"
      ]}
    ]
  }
}
```

## Complete Example

### Input: MT103

```swift
{1:F01BNPAFRPPXXX0000000000}
{2:I103DEUTDEFFXXXXN}
{3:{121:174d2c70-7a8c-4c0d-8b2e-5c2a9f8e6d3a}}
{4:
:20:REF123456789
:23B:CRED
:32A:250115USD50000,00
:50K:/12345678901234
ACME INTERNATIONAL CORP
123 BUSINESS AVENUE
NEW YORK NY 10001
:52A:CITIUS33XXX
:57A:COBADEFFXXX
:59:/DE89370400440532013000
GLOBAL TRADING GMBH
MUSTERSTRASSE 123
60329 FRANKFURT
:70:/INV/2025-001
PAYMENT FOR INVOICE
:71A:SHA
:72:/REC/PAYMENT
-}
```

### Output: pacs.008

```xml
<?xml version="1.0" encoding="UTF-8"?>
<BizMsg xmlns="urn:iso:std:iso:20022:tech:xsd:head.001.001.03">
  <AppHdr>
    <Fr>
      <FIId>
        <FinInstnId>
          <BICFI>BNPAFRPPXXX</BICFI>
        </FinInstnId>
      </FIId>
    </Fr>
    <To>
      <FIId>
        <FinInstnId>
          <BICFI>DEUTDEFFXXX</BICFI>
        </FinInstnId>
      </FIId>
    </To>
    <BizMsgIdr>REF123456789</BizMsgIdr>
    <MsgDefIdr>pacs.008.001.12</MsgDefIdr>
    <CreDt>2025-01-15T10:30:00Z</CreDt>
  </AppHdr>
  <Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.12">
    <FIToFICstmrCdtTrf>
      <GrpHdr>
        <MsgId>REF123456789</MsgId>
        <CreDtTm>2025-01-15T10:30:00Z</CreDtTm>
        <NbOfTxs>1</NbOfTxs>
        <SttlmInf>
          <SttlmMtd>INDA</SttlmMtd>
        </SttlmInf>
      </GrpHdr>
      <CdtTrfTxInf>
        <PmtId>
          <InstrId>REF123456789</InstrId>
          <EndToEndId>REF123456789</EndToEndId>
          <UETR>174d2c70-7a8c-4c0d-8b2e-5c2a9f8e6d3a</UETR>
        </PmtId>
        <PmtTpInf>
          <SvcLvl>
            <Cd>G002</Cd>
          </SvcLvl>
        </PmtTpInf>
        <IntrBkSttlmAmt Ccy="USD">50000.00</IntrBkSttlmAmt>
        <IntrBkSttlmDt>2025-01-15</IntrBkSttlmDt>
        <ChrgBr>SHAR</ChrgBr>
        <Dbtr>
          <Nm>ACME INTERNATIONAL CORP</Nm>
          <PstlAdr>
            <AdrLine>123 BUSINESS AVENUE</AdrLine>
            <AdrLine>NEW YORK NY 10001</AdrLine>
          </PstlAdr>
        </Dbtr>
        <DbtrAcct>
          <Id>
            <Othr>
              <Id>12345678901234</Id>
            </Othr>
          </Id>
        </DbtrAcct>
        <DbtrAgt>
          <FinInstnId>
            <BICFI>CITIUS33XXX</BICFI>
          </FinInstnId>
        </DbtrAgt>
        <CdtrAgt>
          <FinInstnId>
            <BICFI>COBADEFFXXX</BICFI>
          </FinInstnId>
        </CdtrAgt>
        <Cdtr>
          <Nm>GLOBAL TRADING GMBH</Nm>
          <PstlAdr>
            <AdrLine>MUSTERSTRASSE 123</AdrLine>
            <AdrLine>60329 FRANKFURT</AdrLine>
          </PstlAdr>
        </Cdtr>
        <CdtrAcct>
          <Id>
            <IBAN>DE89370400440532013000</IBAN>
          </Id>
        </CdtrAcct>
        <InstrForCdtrAgt>
          <InstrInf>PAYMENT</InstrInf>
        </InstrForCdtrAgt>
        <RmtInf>
          <Ustrd>/INV/2025-001 PAYMENT FOR INVOICE</Ustrd>
        </RmtInf>
      </CdtTrfTxInf>
    </FIToFICstmrCdtTrf>
  </Document>
</BizMsg>
```

## Variants

### MT103 STP

Straight-Through Processing variant with BIC-only agent identification:

- Same mapping as standard MT103
- Tag 119: STP in Block 3
- All agents identified by BIC (no name/address)

### MT103 REJT

Payment rejection (transformed to pacs.002):

- Block 2 contains `103` with REJT indicator
- Includes original message reference
- Rejection reason code

### MT103 RETN

Payment return (transformed to pacs.004):

- Indicates returned payment
- Contains reason for return
- May include charges information

## Try It

<div class="reframe-playground" data-tab="transform"></div>

## API Example

```bash
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{
    "message": "{1:F01BNPAFRPPXXX0000000000}{2:I103DEUTDEFFXXXXN}{3:{121:174d2c70-7a8c-4c0d-8b2e-5c2a9f8e6d3a}}{4:\n:20:REF123456789\n:23B:CRED\n:32A:250115USD50000,00\n:50K:/12345678901234\nACME INTERNATIONAL CORP\n:59:/DE89370400440532013000\nGLOBAL TRADING GMBH\n:71A:SHA\n-}",
    "validation": true
  }'
```

---

**[Back to MT → ISO 20022 Overview →](./overview.md)**

**[View Message Catalog →](../message-catalog.md)**
