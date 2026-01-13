# Datafake

The test data generation library powering Reframe sample generation.

## What is Datafake?

**Datafake** is a Rust library for generating realistic test data, compatible with the Faker.js API. It provides generators for common data types including financial identifiers.

In Reframe, Datafake generates sample SWIFT MT and ISO 20022 messages for testing.

## Role in Reframe

```
Generate Request
{
  "message_type": "MT103",
  "scenario": "standard"
}
      │
      ▼
┌─────────────────────────────────────────────┐
│              Datafake Engine                │
│                                             │
│  Generate:                                  │
│  • BIC codes (sender/receiver)              │
│  • IBAN accounts                            │
│  • Currency amounts                         │
│  • Company names                            │
│  • Addresses                                │
│  • Transaction references                   │
│  • UUIDs (UETR)                             │
└─────────────────────────────────────────────┘
      │
      ▼
Sample Message
```

## Key Features

### Financial Data Generators

| Generator | Example Output |
|-----------|---------------|
| BIC | `BNPAFRPPXXX` |
| IBAN | `FR7630006000011234567890189` |
| Currency | `USD`, `EUR`, `GBP` |
| Amount | `50000.00` |
| LEI | `5493001KJTIIGC8Y1R12` |

### General Data Generators

| Generator | Example Output |
|-----------|---------------|
| Company name | `Acme International Inc` |
| Address | `123 Main Street, New York NY 10001` |
| Country | `US`, `DE`, `GB` |
| Date | `2025-01-15` |
| UUID | `f47ac10b-58cc-4372-a567-0e02b2c3d479` |

### Deterministic Output

With seeding, generates reproducible data:

```json
{
  "variables": {
    "ref": {"fake": ["uuid"]},
    "amount": {"fake": ["u64", 1000, 100000]}
  },
  "seed": 12345
}
```

## Interactive Playground

Try Datafake generators in the browser:

**[Datafake Playground →](https://goplasmatic.github.io/datafake-rs/playground/)**

## Resources

| Resource | Link |
|----------|------|
| Documentation | [goplasmatic.github.io/datafake-rs](https://goplasmatic.github.io/datafake-rs/) |
| GitHub | [github.com/GoPlasmatic/datafake-rs](https://github.com/GoPlasmatic/datafake-rs) |
| Crates.io | [crates.io/crates/datafake-rs](https://crates.io/crates/datafake-rs) |
| Playground | [Interactive Playground](https://goplasmatic.github.io/datafake-rs/playground/) |

## Scenario Configuration

Sample scenarios use Datafake in variable definitions:

```json
{
  "description": "MT103 Standard Transfer",
  "variables": {
    "sender_bic": {"fake": ["bic"]},
    "receiver_bic": {"fake": ["bic"]},
    "currency": {"fake": ["enum", "USD", "EUR", "GBP"]},
    "amount": {"fake": ["u64", 5000, 500000]},
    "uetr": {"fake": ["uuid"]},
    "sender_name": {"fake": ["company_name"]},
    "receiver_name": {"fake": ["company_name"]},
    "reference": {"fake": ["alphanumeric", 16]}
  },
  "schema": {
    "basic_header": {
      "sender_bic": "{{sender_bic}}"
    },
    "fields": {
      "20": {"transaction_reference": "{{reference}}"},
      "32A": {
        "currency": "{{currency}}",
        "amount": "{{amount}}"
      }
    }
  }
}
```

## Generator Types

### String Generators

```json
{"fake": ["alphanumeric", 10]}
{"fake": ["alpha", 5]}
{"fake": ["numeric", 8]}
{"fake": ["uuid"]}
```

### Number Generators

```json
{"fake": ["u64", 1000, 100000]}
{"fake": ["f64", 0.0, 100.0]}
{"fake": ["i32", -100, 100]}
```

### Financial Generators

```json
{"fake": ["bic"]}
{"fake": ["iban", "DE"]}
{"fake": ["currency_code"]}
{"fake": ["lei"]}
```

### Selection Generators

```json
{"fake": ["enum", "USD", "EUR", "GBP", "JPY"]}
{"fake": ["one_of", ["Option A", "Option B", "Option C"]]}
```

### Date Generators

```json
{"fake": ["date_future", 30]}
{"fake": ["date_past", 90]}
{"fake": ["datetime"]}
```

---

**[Datalogic →](./datalogic.md)**

**[Sample Generation Feature →](../features/sample-generation.md)**
