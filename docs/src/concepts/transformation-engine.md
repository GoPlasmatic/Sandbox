# Transformation Engine

Reframe's open source rules engine transforms messages between any formats using auditable JSONLogic rules. Load transformation packages for SWIFT MT↔ISO 20022 or custom formats.

## How It Works

The transformation engine follows a simple pipeline:

```
Input Message → Parse → Detect Format → Transform → Validate → Output
```

1. **Parse**: Extract structured data from input format
2. **Detect**: Identify message type and target transformation
3. **Transform**: Apply JSONLogic mapping rules
4. **Validate**: Check output against format rules
5. **Output**: Generate target format message

## Format Detection

The engine automatically detects input formats based on package rules:

| Package | Detection | Example |
|---------|-----------|---------|
| CBPR+ | `{1:` prefix = MT, XML namespace = ISO 20022 | SWIFT messages |
| Custom | Package-defined patterns | Any format |

## Transformation Pipeline

Every transformation follows this generic pipeline:

```
┌────────────────────────────────────────────────────────────┐
│               Generic Transformation Pipeline              │
├────────────────────────────────────────────────────────────┤
│  1. Parse Input      → Extract structured data             │
│  2. Detect Target    → Identify output format              │
│  3. Pre-conditions   → Validate business rules             │
│  4. Map Fields       → Apply JSONLogic transformations     │
│  5. Post-conditions  → Validate output                     │
│  6. Publish          → Generate target format              │
└────────────────────────────────────────────────────────────┘
```

Packages customize each stage with format-specific rules.

## CBPR+ Package Example

For SWIFT CBPR+ transformations:
- **MT → ISO 20022**: Parse MT blocks → Map to pacs/camt XML → Validate CBPR+ rules
- **ISO 20022 → MT**: Parse XML → Map to MT fields → Validate MT structure

## Field Mapping

The core of transformation is field mapping using JSONLogic rules.

### Simple Mapping

Direct field copy:

```json
{
  "path": "data.output.field_name",
  "logic": {"var": "data.input.source_field"}
}
```

### Conditional Mapping

Logic-based transformation:

```json
{
  "path": "data.output.status",
  "logic": {
    "if": [
      {"==": [{"var": "data.input.code"}, "A"]}, "ACCEPTED",
      {"==": [{"var": "data.input.code"}, "R"]}, "REJECTED",
      "UNKNOWN"
    ]
  }
}
```

### Composite Mapping

Combining multiple fields:

```json
{
  "path": "data.output.amount",
  "logic": {
    "object": {
      "currency": {"var": "data.input.ccy"},
      "value": {"var": "data.input.amt"}
    }
  }
}
```

See [JSONLogic Rules](./jsonlogic-rules.md) for complete syntax reference.

## Validation Integration

Transformation can include validation:

```bash
curl -X POST http://localhost:3000/api/transform \
  -d '{"message": "...", "validation": true}'
```

When enabled:
1. Input message validated before transformation
2. Output message validated after transformation
3. Validation errors included in response

## Error Handling

Transformation errors are categorized:

| Error Type | Description |
|------------|-------------|
| **Parse Error** | Cannot parse input message format |
| **Mapping Error** | Field transformation failed |
| **Validation Error** | Output fails format rules |
| **Rule Error** | Business rule violation |

Error responses include error code, pipeline location, and source field.

---

**[Learn About Packages →](./packages-and-rules.md)** · **[JSONLogic Rules →](./jsonlogic-rules.md)**
