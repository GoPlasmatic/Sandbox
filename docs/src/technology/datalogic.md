# Datalogic

The JSONLogic rules engine powering Reframe transformations.

## What is Datalogic?

**Datalogic** is a high-performance Rust implementation of [JSONLogic](https://jsonlogic.com) - a standard for expressing business logic as JSON.

In Reframe, Datalogic evaluates all field mappings and business rules during transformation.

## Role in Reframe

```
Transformation Pipeline
        │
        ▼
┌───────────────────┐
│  Field Mapping    │
│  {                │
│    "path": "...", │
│    "logic": {...} │◄──── Datalogic evaluates this
│  }                │
└───────────────────┘
        │
        ▼
   Transformed Data
```

## Key Features

### 59 Built-in Operators

| Category | Examples |
|----------|----------|
| Comparison | `==`, `!=`, `>`, `<`, `>=`, `<=` |
| Boolean | `and`, `or`, `!`, `!!` |
| Arithmetic | `+`, `-`, `*`, `/`, `%`, `min`, `max` |
| String | `cat`, `substr`, `in`, `upper`, `lower` |
| Array | `map`, `filter`, `reduce`, `all`, `some` |
| Control | `if`, `?:`, `??` |
| Date/Time | `now`, `format_date`, `parse_date` |

### Pre-Compilation

Rules are compiled once at startup:
- No parsing during request processing
- O(1) rule lookup
- Zero-copy execution

### Thread-Safe

- Safe concurrent evaluation
- Arc-wrapped compiled rules
- Native async/Tokio support

## Example Rules

### Direct Mapping

```json
{"var": "data.SwiftMT.fields.20.transaction_reference"}
```

### Conditional Logic

```json
{
  "if": [
    {"==": [{"var": "data.field"}, "A"]},
    "Result A",
    "Result B"
  ]
}
```

### String Operations

```json
{
  "cat": [
    {"var": "data.first"},
    " ",
    {"var": "data.last"}
  ]
}
```

### Complex Transformation

```json
{
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
```

## Interactive Playground

Try Datalogic expressions in the browser:

**[Datalogic Playground →](https://goplasmatic.github.io/datalogic-rs/playground/)**

## Resources

| Resource | Link |
|----------|------|
| Documentation | [goplasmatic.github.io/datalogic-rs](https://goplasmatic.github.io/datalogic-rs/) |
| GitHub | [github.com/GoPlasmatic/datalogic-rs](https://github.com/GoPlasmatic/datalogic-rs) |
| Crates.io | [crates.io/crates/datalogic-rs](https://crates.io/crates/datalogic-rs) |
| Playground | [Interactive Playground](https://goplasmatic.github.io/datalogic-rs/playground/) |

## Usage in Reframe

### Transformation Rules

```json
{
  "path": "data.output.PmtId.InstrId",
  "logic": {"var": "data.SwiftMT.fields.20.transaction_reference"}
}
```

### Workflow Conditions

```json
{
  "id": "mt103-workflow",
  "condition": {
    "and": [
      {"==": [{"var": "metadata.direction"}, "outgoing"]},
      {"==": [{"var": "metadata.message_type"}, "MT103"]}
    ]
  }
}
```

### Validation Rules

```json
{
  "rules": [
    {
      "logic": {">": [{"var": "data.amount"}, 0]},
      "message": "Amount must be positive"
    }
  ]
}
```

---

**[Dataflow →](./dataflow.md)**

**[JSONLogic Rules Guide →](../concepts/jsonlogic-rules.md)**
