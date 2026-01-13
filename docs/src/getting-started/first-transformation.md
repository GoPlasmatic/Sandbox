# Your First Transformation

A step-by-step guide to understanding how Reframe transforms MT103 to ISO 20022 pacs.008.

## What We'll Cover

1. Understanding the MT103 message structure
2. Transforming MT103 to pacs.008
3. Examining the transformation result
4. Understanding field mappings

## The MT103 Message

MT103 is SWIFT's standard message for single customer credit transfers. Here's a sample:

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
123 MAIN STREET
NEW YORK NY 10001
:59:/98765432
GLOBAL TRADING LTD
456 HIGH STREET
LONDON EC1A 1BB
:71A:SHA
-}
```

### MT103 Structure

| Block/Tag | Content | Purpose |
|-----------|---------|---------|
| Block 1 | `F01BNPAFRPPXXX...` | Basic header - sender BIC |
| Block 2 | `I103DEUTDEFFXXXX` | Application header - receiver BIC |
| Block 3 | `{121:...}` | User header - UETR |
| Tag 20 | `REF123456` | Transaction reference |
| Tag 23B | `CRED` | Bank operation code |
| Tag 32A | `250115USD50000,00` | Value date, currency, amount |
| Tag 50K | Account + Name + Address | Ordering customer (debtor) |
| Tag 59 | Account + Name + Address | Beneficiary (creditor) |
| Tag 71A | `SHA` | Charges (shared) |

## Step 1: Send the Transformation Request

```bash
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{
    "message": "{1:F01BNPAFRPPXXX0000000000}{2:I103DEUTDEFFXXXXN}{3:{121:174d2c70-7a8c-4c0d-8b2e-5c2a9f8e6d3a}}{4:\n:20:REF123456\n:23B:CRED\n:32A:250115USD50000,00\n:50K:/12345678\nACME CORPORATION\n123 MAIN STREET\nNEW YORK NY 10001\n:59:/98765432\nGLOBAL TRADING LTD\n456 HIGH STREET\nLONDON EC1A 1BB\n:71A:SHA\n-}",
    "validation": true
  }'
```

## Step 2: Examine the Response

The response contains the transformed pacs.008 message:

```json
{
  "status": "success",
  "direction": "outgoing",
  "source_type": "MT103",
  "target_type": "pacs.008.001.12",
  "message": "<?xml version=\"1.0\"?>...",
  "timing_ms": 0.8
}
```

## Step 3: Understanding the pacs.008 Output

The transformed ISO 20022 message has two parts:

### Business Application Header (BAH)

```xml
<AppHdr xmlns="urn:iso:std:iso:20022:tech:xsd:head.001.001.03">
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
  <BizMsgIdr>REF123456</BizMsgIdr>
  <MsgDefIdr>pacs.008.001.12</MsgDefIdr>
  <CreDt>2025-01-15T10:30:00Z</CreDt>
</AppHdr>
```

### Document (pacs.008)

```xml
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.12">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>REF123456</MsgId>
      <CreDtTm>2025-01-15T10:30:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>INDA</SttlmMtd>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <InstrId>REF123456</InstrId>
        <EndToEndId>REF123456</EndToEndId>
        <UETR>174d2c70-7a8c-4c0d-8b2e-5c2a9f8e6d3a</UETR>
      </PmtId>
      <IntrBkSttlmAmt Ccy="USD">50000.00</IntrBkSttlmAmt>
      <IntrBkSttlmDt>2025-01-15</IntrBkSttlmDt>
      <ChrgBr>SHAR</ChrgBr>
      <Dbtr>
        <Nm>ACME CORPORATION</Nm>
        <PstlAdr>
          <AdrLine>123 MAIN STREET</AdrLine>
          <AdrLine>NEW YORK NY 10001</AdrLine>
        </PstlAdr>
      </Dbtr>
      <DbtrAcct>
        <Id>
          <Othr>
            <Id>12345678</Id>
          </Othr>
        </Id>
      </DbtrAcct>
      <DbtrAgt>
        <FinInstnId>
          <BICFI>BNPAFRPPXXX</BICFI>
        </FinInstnId>
      </DbtrAgt>
      <CdtrAgt>
        <FinInstnId>
          <BICFI>DEUTDEFFXXX</BICFI>
        </FinInstnId>
      </CdtrAgt>
      <Cdtr>
        <Nm>GLOBAL TRADING LTD</Nm>
        <PstlAdr>
          <AdrLine>456 HIGH STREET</AdrLine>
          <AdrLine>LONDON EC1A 1BB</AdrLine>
        </PstlAdr>
      </Cdtr>
      <CdtrAcct>
        <Id>
          <Othr>
            <Id>98765432</Id>
          </Othr>
        </Id>
      </CdtrAcct>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>
```

## Field Mapping Summary

Here's how key MT103 fields map to pacs.008:

| MT103 Field | pacs.008 Path | Example |
|-------------|---------------|---------|
| Block 1 BIC | `Fr/FIId/FinInstnId/BICFI` | BNPAFRPPXXX |
| Block 2 BIC | `To/FIId/FinInstnId/BICFI` | DEUTDEFFXXX |
| Tag 20 | `PmtId/InstrId` | REF123456 |
| Tag 121 (UETR) | `PmtId/UETR` | 174d2c70-... |
| Tag 32A date | `IntrBkSttlmDt` | 2025-01-15 |
| Tag 32A amount | `IntrBkSttlmAmt` | 50000.00 |
| Tag 32A currency | `IntrBkSttlmAmt/@Ccy` | USD |
| Tag 50K name | `Dbtr/Nm` | ACME CORPORATION |
| Tag 50K account | `DbtrAcct/Id/Othr/Id` | 12345678 |
| Tag 59 name | `Cdtr/Nm` | GLOBAL TRADING LTD |
| Tag 59 account | `CdtrAcct/Id/Othr/Id` | 98765432 |
| Tag 71A | `ChrgBr` | SHA → SHAR |

## Charge Bearer Mapping

The 71A tag maps to ISO 20022 charge bearer codes:

| MT (71A) | ISO 20022 | Meaning |
|----------|-----------|---------|
| SHA | SHAR | Shared between parties |
| OUR | DEBT | All charges to debtor |
| BEN | CRED | All charges to creditor |

## Try It Yourself

Use the interactive playground to experiment:

<div class="reframe-playground" data-tab="transform"></div>

## Debug Mode

To see the transformation steps, add `debug: true`:

```bash
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{
    "message": "...",
    "debug": true
  }'
```

The debug response shows:
- Parsed input structure
- Each workflow that executed
- Intermediate transformation values
- Final output assembly

## Reverse Transformation

Transform pacs.008 back to MT103:

```bash
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{
    "message": "<?xml version=\"1.0\"?>..."
  }'
```

Reframe auto-detects the input format and applies the appropriate transformation direction.

---

**[Explore CBPR+ Message Types →](../cbpr-plus/overview.md)**

**[See MT103 → pacs.008 Details →](../cbpr-plus/mt-to-iso20022/mt103-to-pacs008.md)**

**[API Reference →](../api-reference/transform-api.md)**
