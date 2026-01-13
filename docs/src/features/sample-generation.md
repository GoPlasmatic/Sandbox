# Sample Generation

Generate valid test messages for development, testing, and certification.

## Overview

Reframe can generate sample SWIFT MT and ISO 20022 messages for any supported message type. Generated messages are:

- **Valid**: Pass schema and business validation
- **Realistic**: Use plausible data values
- **Configurable**: Multiple scenarios per message type
- **Reproducible**: Same scenario produces consistent structure

## API Usage

### Generate a Sample Message

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "message_type": "MT103",
    "scenario": "standard"
  }'
```

### Response

```json
{
  "status": "success",
  "message_type": "MT103",
  "scenario": "standard",
  "message": "{1:F01BNPAFRPPXXX0000000000}{2:I103DEUTDEFFXXXXN}...",
  "metadata": {
    "generated_at": "2025-01-15T10:30:00Z",
    "package": "swift-cbpr-mt-mx",
    "version": "2.1.2"
  }
}
```

## Supported Types

For the complete list of supported message types and scenarios, see **[Generate API Reference →](../api-reference/generate-api.md#supported-message-types)**

## Scenarios

Scenarios define different variations of a message type:

### MT103 Scenarios

**standard**: Basic customer credit transfer
```json
{"message_type": "MT103", "scenario": "standard"}
```

**high_value**: Large amount transfer with additional details
```json
{"message_type": "MT103", "scenario": "high_value"}
```

**remittance**: Includes detailed remittance information
```json
{"message_type": "MT103", "scenario": "remittance"}
```

### pacs.008 Scenarios

**standard**: Basic ISO 20022 credit transfer
```json
{"message_type": "pacs.008", "scenario": "standard"}
```

**high_value**: Large amount with full party details
```json
{"message_type": "pacs.008", "scenario": "high_value"}
```

## Data Generation

Sample messages use realistic generated data:

### Financial Data
- **BICs**: Valid SWIFT BIC codes
- **IBANs**: Country-appropriate format
- **Amounts**: Realistic ranges by scenario
- **Currencies**: Major currencies (USD, EUR, GBP, etc.)

### Party Information
- **Names**: Company names for corporate payments
- **Addresses**: Valid postal addresses
- **References**: Realistic transaction references

### Dates
- **Value Date**: Near future dates
- **Creation Time**: Current timestamp
- **Statement Dates**: Recent date ranges

## Use Cases

### Development Testing

Generate messages for unit and integration tests:

```bash
# Generate test data for your test suite
curl -X POST http://localhost:3000/api/generate \
  -d '{"message_type": "MT103", "scenario": "standard"}' \
  > test_fixtures/mt103_sample.txt
```

### SWIFT Certification

Generate valid messages for certification testing:

```bash
# Generate SR2025 compliant messages
curl -X POST http://localhost:3000/api/generate \
  -d '{"message_type": "pacs.008", "scenario": "sr2025_standard"}'
```

### Demo and Training

Create realistic examples for demonstrations:

```bash
# Generate various message types
for type in MT103 MT202 MT940; do
  curl -X POST http://localhost:3000/api/generate \
    -d "{\"message_type\": \"$type\", \"scenario\": \"standard\"}" \
    > "samples/${type}.txt"
done
```

### Transformation Testing

Generate source messages and verify transformation:

```bash
# Generate MT103
MT103=$(curl -s -X POST http://localhost:3000/api/generate \
  -d '{"message_type": "MT103", "scenario": "standard"}' | jq -r .message)

# Transform to pacs.008
curl -X POST http://localhost:3000/api/transform \
  -d "{\"message\": \"$MT103\"}"
```

## Interactive Playground

Generate messages using the interactive playground:

<div class="reframe-playground" data-tab="generate"></div>

## Powered by Datafake

Sample generation uses [Datafake](https://goplasmatic.github.io/datafake-rs/), an open-source test data generation library. Datafake provides:

- Faker.js compatible API
- Deterministic output with seeds
- Financial domain generators (BIC, IBAN, amounts)
- Locale-aware data generation

---

**[API Reference →](../api-reference/generate-api.md)**
