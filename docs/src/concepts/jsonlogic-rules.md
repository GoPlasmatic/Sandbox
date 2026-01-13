# JSONLogic Rules

How Reframe uses JSONLogic for business rules and field transformations.

## What is JSONLogic?

JSONLogic is a standard for expressing business logic as JSON. It provides:

- **Portable rules**: Same rules work across languages and platforms
- **Human-readable**: Logic expressed in familiar JSON structure
- **Safe evaluation**: No arbitrary code execution
- **Testable**: Rules can be validated independently

Reframe uses [Datalogic](https://goplasmatic.github.io/datalogic-rs/), a high-performance Rust implementation of JSONLogic with 59 built-in operators.

## Basic Syntax

JSONLogic expressions follow this pattern:

```json
{ "operator": [arguments] }
```

### Variable Access

Read data from the message context:

```json
{"var": "data.SwiftMT.fields.20.transaction_reference"}
```

This accesses:
```
data
└── SwiftMT
    └── fields
        └── 20
            └── transaction_reference → "REF123456"
```

### Comparison

```json
{"==": [{"var": "data.field"}, "expected_value"]}
{"!=": [{"var": "data.field"}, "unexpected_value"]}
{">": [{"var": "data.amount"}, 10000]}
{">=": [{"var": "data.amount"}, 0]}
```

### Boolean Logic

```json
{"and": [condition1, condition2]}
{"or": [condition1, condition2]}
{"!": [condition]}
{"!!": [value]}  // Convert to boolean
```

## Common Transformation Patterns

### Direct Mapping

Copy a value from source to target:

```json
{
  "path": "data.output.InstrId",
  "logic": {"var": "data.SwiftMT.fields.20.transaction_reference"}
}
```

### Conditional Mapping

Map different values based on conditions:

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

### Default Values

Provide fallback when source is missing:

```json
{
  "path": "data.output.PmtTpInf.SvcLvl.Cd",
  "logic": {
    "or": [
      {"var": "data.SwiftMT.fields.23B.bank_operation_code"},
      "G001"
    ]
  }
}
```

### String Concatenation

Combine multiple fields:

```json
{
  "path": "data.output.FullName",
  "logic": {
    "cat": [
      {"var": "data.first_name"},
      " ",
      {"var": "data.last_name"}
    ]
  }
}
```

### String Extraction

Extract portions of a string:

```json
{
  "path": "data.output.CountryCode",
  "logic": {
    "substr": [
      {"var": "data.SwiftMT.fields.50K.account"},
      0,
      2
    ]
  }
}
```

## Array Operations

### Map (Transform Each Element)

```json
{
  "map": [
    {"var": "data.items"},
    {"cat": ["Item: ", {"var": ""}]}
  ]
}
```

### Filter

```json
{
  "filter": [
    {"var": "data.transactions"},
    {">": [{"var": "amount"}, 1000]}
  ]
}
```

### Reduce (Aggregate)

```json
{
  "reduce": [
    {"var": "data.amounts"},
    {"+": [{"var": "accumulator"}, {"var": "current"}]},
    0
  ]
}
```

### Check All/Some/None

```json
{"all": [{"var": "data.items"}, {"!!": {"var": "valid"}}]}
{"some": [{"var": "data.items"}, {"==": [{"var": "status"}, "active"]}]}
{"none": [{"var": "data.items"}, {"<": [{"var": "amount"}, 0]}]}
```

## Object Construction

### Create Objects

Build complex structures:

```json
{
  "path": "data.output.Amt",
  "logic": {
    "object": {
      "Ccy": {"var": "data.SwiftMT.fields.32A.currency"},
      "value": {"var": "data.SwiftMT.fields.32A.amount"}
    }
  }
}
```

### Nested Objects

```json
{
  "path": "data.output.Dbtr",
  "logic": {
    "object": {
      "Nm": {"var": "data.SwiftMT.fields.50K.name"},
      "PstlAdr": {
        "object": {
          "Ctry": {"var": "data.country"},
          "AdrLine": {"var": "data.address_lines"}
        }
      }
    }
  }
}
```

## Date and Time Operations

### Current Timestamp

```json
{"now": []}
```

### Format Date

```json
{
  "format_date": [
    {"var": "data.date"},
    "%Y-%m-%d"
  ]
}
```

### Parse Date

```json
{
  "parse_date": [
    {"var": "data.date_string"},
    "%y%m%d"
  ]
}
```

## Validation Rules

Use JSONLogic for validation:

```json
{
  "id": "validate-amount",
  "function": {
    "name": "validation",
    "input": {
      "rules": [
        {
          "logic": {">": [{"var": "data.amount"}, 0]},
          "message": "Amount must be positive"
        },
        {
          "logic": {"!!": {"var": "data.currency"}},
          "message": "Currency is required"
        },
        {
          "logic": {
            "in": [
              {"var": "data.currency"},
              ["USD", "EUR", "GBP", "JPY"]
            ]
          },
          "message": "Invalid currency code"
        }
      ]
    }
  }
}
```

## CBPR+ Rule Examples

### Charge Bearer Mapping

```json
// MT Tag 71A to ISO 20022 ChargeBearerType1Code
{
  "if": [
    {"==": [{"var": "data.SwiftMT.fields.71A.details_of_charges"}, "SHA"]},
    "SHAR",
    {"if": [
      {"==": [{"var": "data.SwiftMT.fields.71A.details_of_charges"}, "OUR"]},
      "DEBT",
      {"if": [
        {"==": [{"var": "data.SwiftMT.fields.71A.details_of_charges"}, "BEN"]},
        "CRED",
        "SHAR"
      ]}
    ]}
  ]
}
```

### Service Level Determination

```json
// Determine CBPR+ service level from MT fields
{
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
```

### Party Identification

```json
// Build creditor identification from MT fields
{
  "object": {
    "Nm": {"var": "data.SwiftMT.fields.59.beneficiary_name"},
    "PstlAdr": {
      "object": {
        "AdrLine": {
          "filter": [
            {"var": "data.SwiftMT.fields.59.address_lines"},
            {"!!": {"var": ""}}
          ]
        }
      }
    },
    "Id": {
      "if": [
        {"!!": {"var": "data.SwiftMT.fields.59.account"}},
        {
          "object": {
            "OrgId": {
              "object": {
                "Othr": {
                  "object": {
                    "Id": {"var": "data.SwiftMT.fields.59.account"}
                  }
                }
              }
            }
          }
        },
        null
      ]
    }
  }
}
```

## Testing Rules

Test rules in the Datalogic playground:

**[Datalogic Playground →](https://goplasmatic.github.io/datalogic-rs/playground/)**

Example test:

```json
// Rule
{
  "if": [
    {">": [{"var": "amount"}, 10000]},
    "HIGH",
    "NORMAL"
  ]
}

// Data
{"amount": 50000}

// Result
"HIGH"
```

## Operator Reference

### Comparison Operators
`==`, `===`, `!=`, `!==`, `>`, `>=`, `<`, `<=`

### Boolean Operators
`and`, `or`, `!`, `!!`

### Numeric Operators
`+`, `-`, `*`, `/`, `%`, `min`, `max`, `abs`

### String Operators
`cat`, `substr`, `in`, `starts_with`, `ends_with`, `upper`, `lower`, `trim`

### Array Operators
`map`, `filter`, `reduce`, `all`, `some`, `none`, `merge`, `sort`

### Control Flow
`if`, `?:`, `??`

### Date/Time
`now`, `datetime`, `format_date`, `parse_date`, `date_diff`

**[Complete Operator Reference →](https://goplasmatic.github.io/datalogic-rs/operators/)**

---

## Related Pages

- **[Packages and Rules](./packages-and-rules.md)** - How Reframe organizes transformation logic
- **[Workflow Orchestration](./workflow-orchestration.md)** - Multi-step transformation flows
- **[Transformation Engine](./transformation-engine.md)** - Core engine architecture
- **[Interactive Playground](../playground/index.md)** - Try transformations online
- **[CBPR+ Package Guide](../cbpr-plus/overview.md)** - SWIFT MT to ISO 20022 rules
