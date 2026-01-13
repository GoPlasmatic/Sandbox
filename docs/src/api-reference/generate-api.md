# Generate API

Generate sample SWIFT MT and ISO 20022 messages.

## Endpoint

```
POST /api/generate
```

## Request

### Headers

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

### Body

```json
{
  "message_type": "string (required)",
  "scenario": "string (optional, default: 'standard')"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message_type` | string | Yes | Message type to generate (MT103, pacs.008, etc.) |
| `scenario` | string | No | Scenario variant (standard, high_value, etc.) |

## Response

### Success (200 OK)

```json
{
  "status": "success",
  "message_type": "MT103",
  "scenario": "standard",
  "message": "{1:F01BNPAFRPPXXX0000000000}...",
  "metadata": {
    "generated_at": "2025-01-15T10:30:00Z",
    "package": "swift-cbpr-mt-mx",
    "version": "2.1.2"
  }
}
```

### Unsupported Type (400 Bad Request)

```json
{
  "status": "error",
  "error": {
    "code": "UNSUPPORTED_TYPE",
    "message": "Message type 'MT999' is not supported",
    "supported_types": ["MT103", "MT202", "MT940", "pacs.008", "pacs.009", "..."]
  }
}
```

### Unknown Scenario (400 Bad Request)

```json
{
  "status": "error",
  "error": {
    "code": "UNKNOWN_SCENARIO",
    "message": "Scenario 'custom' not found for MT103",
    "available_scenarios": ["standard", "high_value", "remittance"]
  }
}
```

## Supported Message Types

### SWIFT MT Messages

| Type | Description | Scenarios |
|------|-------------|-----------|
| `MT101` | Request for Transfer | standard |
| `MT103` | Single Customer Credit Transfer | standard, high_value, remittance |
| `MT103STP` | Straight-Through Processing | standard |
| `MT200` | Financial Institution Transfer | standard |
| `MT202` | General FI Transfer | standard, cover |
| `MT202COV` | Cover Payment | standard |
| `MT205` | FI Transfer (Third Party) | standard |
| `MT900` | Confirmation of Debit | standard |
| `MT910` | Confirmation of Credit | standard |
| `MT940` | Customer Statement | standard, multi_entry |
| `MT942` | Interim Transaction Report | standard |

### ISO 20022 Messages

| Type | Description | Scenarios |
|------|-------------|-----------|
| `pacs.002` | Payment Status Report | accepted, rejected |
| `pacs.004` | Payment Return | standard |
| `pacs.008` | FI to FI Customer Credit Transfer | standard, high_value |
| `pacs.009` | FI to FI FI Credit Transfer | standard, cover |
| `camt.029` | Resolution of Investigation | standard |
| `camt.052` | Account Report | standard |
| `camt.053` | Bank Statement | standard |
| `camt.054` | Debit/Credit Notification | debit, credit |
| `camt.056` | Cancellation Request | standard |

## Scenario Details

### MT103 Scenarios

**standard**: Basic customer credit transfer
- Amount: $10,000 - $100,000
- Standard party information
- SHA charges

**high_value**: Large value transfer
- Amount: $500,000 - $5,000,000
- Full party details with addresses
- Complete agent chain

**remittance**: With remittance information
- Includes Tag 70 (remittance info)
- Invoice/PO references
- Regulatory reporting

### pacs.008 Scenarios

**standard**: Basic ISO 20022 transfer
- SR2025 compliant structure
- UETR included
- Standard party identification

**high_value**: Enhanced party details
- LEI identifiers
- Structured addresses
- Full creditor reference

## Examples

### Generate MT103

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "message_type": "MT103",
    "scenario": "standard"
  }'
```

### Generate pacs.008

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "message_type": "pacs.008",
    "scenario": "standard"
  }'
```

### Generate High-Value MT103

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "message_type": "MT103",
    "scenario": "high_value"
  }'
```

### Generate MT940 Statement

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "message_type": "MT940",
    "scenario": "multi_entry"
  }'
```

## Sample Output

### MT103 (standard)

```swift
{1:F01CITIUS33XXX0000000000}
{2:I103DEUTDEFFXXXXN}
{3:{121:a1b2c3d4-e5f6-7890-abcd-ef1234567890}}
{4:
:20:TRF20250115001
:23B:CRED
:32A:250115USD75000,00
:50K:/US33445566778899
ACME INTERNATIONAL INC
1234 CORPORATE BLVD
NEW YORK NY 10001
:57A:COBADEFFXXX
:59:/DE89370400440532013000
MUNICH TRADING GMBH
LEOPOLDSTRASSE 100
80802 MUNICH
:70:/INV/2025-00123
:71A:SHA
-}
```

### pacs.008 (standard)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.12">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>MSG20250115001</MsgId>
      <CreDtTm>2025-01-15T10:30:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>INDA</SttlmMtd>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <InstrId>INSTR20250115001</InstrId>
        <EndToEndId>E2E20250115001</EndToEndId>
        <UETR>a1b2c3d4-e5f6-7890-abcd-ef1234567890</UETR>
      </PmtId>
      <PmtTpInf>
        <SvcLvl><Cd>G002</Cd></SvcLvl>
      </PmtTpInf>
      <IntrBkSttlmAmt Ccy="EUR">45000.00</IntrBkSttlmAmt>
      <IntrBkSttlmDt>2025-01-15</IntrBkSttlmDt>
      <ChrgBr>SHAR</ChrgBr>
      <Dbtr>
        <Nm>SENDER CORPORATION</Nm>
      </Dbtr>
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
        <Nm>RECEIVER GMBH</Nm>
      </Cdtr>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>
```

---

**[API Overview →](./overview.md)**

**[Try in Playground →](../playground/generator.md)**
