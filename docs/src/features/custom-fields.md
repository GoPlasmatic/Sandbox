# Custom Fields

Define package-specific computed fields for analytics and monitoring.

## Overview

Custom fields allow you to extract and compute values from transformed messages for:

- **Analytics**: Track transformation patterns
- **Filtering**: Query messages by business attributes
- **Monitoring**: Build dashboards and alerts
- **Compliance**: Extract regulatory reporting data

## How It Works

Custom fields are defined in `api_config.json` within your transformation package:

```json
{
  "custom_fields": [
    {
      "name": "sender_country",
      "type": "string",
      "storage": "precompute",
      "logic": {
        "substr": [
          {"var": "context.data.sender_bic"},
          4,
          2
        ]
      }
    }
  ]
}
```

The Reframe engine evaluates these JSONLogic expressions after each transformation and stores the results.

## Field Definition

### Structure

```json
{
  "name": "field_name",
  "type": "string | number | boolean",
  "storage": "precompute | runtime | hybrid",
  "logic": { /* JSONLogic expression */ },
  "description": "Optional field description"
}
```

### Properties

| Property | Required | Description |
|----------|----------|-------------|
| `name` | Yes | Unique field identifier |
| `type` | Yes | Data type: string, number, boolean |
| `storage` | Yes | When to compute the field |
| `logic` | Yes | JSONLogic expression |
| `description` | No | Human-readable description |

### Storage Strategies

| Strategy | Computed | Stored | Best For |
|----------|----------|--------|----------|
| `precompute` | At transformation time | Yes | Filtering, frequent queries |
| `runtime` | At query time | No | Time-dependent values |
| `hybrid` | Both | Yes | Updateable computations |

## Example Custom Fields

### Basic Extraction

Extract sender country from BIC:

```json
{
  "name": "sender_country",
  "type": "string",
  "storage": "precompute",
  "logic": {
    "substr": [{"var": "context.data.sender_bic"}, 4, 2]
  }
}
```

### Amount Banding

Categorize transactions by value:

```json
{
  "name": "amount_band",
  "type": "string",
  "storage": "precompute",
  "logic": {
    "if": [
      {">": [{"var": "context.data.amount"}, 1000000]},
      "HIGH",
      {"if": [
        {">": [{"var": "context.data.amount"}, 100000]},
        "MEDIUM",
        "LOW"
      ]}
    ]
  }
}
```

### Risk Scoring

Compute a risk score based on multiple factors:

```json
{
  "name": "risk_score",
  "type": "number",
  "storage": "precompute",
  "logic": {
    "+": [
      {"if": [{">": [{"var": "context.data.amount"}, 500000]}, 30, 0]},
      {"if": [{"in": [{"var": "context.data.receiver_country"}, ["HR", "RS", "BY"]]}, 40, 0]},
      {"if": [{"!": {"var": "context.data.remittance_info"}}, 20, 0]},
      10
    ]
  }
}
```

### Cross-Border Detection

Determine if payment is cross-border:

```json
{
  "name": "is_cross_border",
  "type": "boolean",
  "storage": "precompute",
  "logic": {
    "!=": [
      {"substr": [{"var": "context.data.sender_bic"}, 4, 2]},
      {"substr": [{"var": "context.data.receiver_bic"}, 4, 2]}
    ]
  }
}
```

### Processing Priority

Assign priority based on business rules:

```json
{
  "name": "processing_priority",
  "type": "string",
  "storage": "precompute",
  "logic": {
    "if": [
      {"==": [{"var": "context.data.service_level"}, "G001"]},
      "CRITICAL",
      {"if": [
        {"or": [
          {">": [{"var": "context.data.amount"}, 1000000]},
          {"==": [{"var": "context.data.service_level"}, "G002"]}
        ]},
        "HIGH",
        "NORMAL"
      ]}
    ]
  }
}
```

## Complete Configuration Example

```json
// api_config.json
{
  "custom_fields": [
    {
      "name": "sender_name",
      "type": "string",
      "storage": "precompute",
      "logic": {"var": "context.data.debtor_name"}
    },
    {
      "name": "receiver_name",
      "type": "string",
      "storage": "precompute",
      "logic": {"var": "context.data.creditor_name"}
    },
    {
      "name": "amount",
      "type": "number",
      "storage": "precompute",
      "logic": {"var": "context.data.settlement_amount"}
    },
    {
      "name": "currency",
      "type": "string",
      "storage": "precompute",
      "logic": {"var": "context.data.settlement_currency"}
    },
    {
      "name": "sender_country",
      "type": "string",
      "storage": "precompute",
      "logic": {"substr": [{"var": "context.data.sender_bic"}, 4, 2]}
    },
    {
      "name": "receiver_country",
      "type": "string",
      "storage": "precompute",
      "logic": {"substr": [{"var": "context.data.receiver_bic"}, 4, 2]}
    },
    {
      "name": "is_cross_border",
      "type": "boolean",
      "storage": "precompute",
      "logic": {
        "!=": [
          {"substr": [{"var": "context.data.sender_bic"}, 4, 2]},
          {"substr": [{"var": "context.data.receiver_bic"}, 4, 2]}
        ]
      }
    },
    {
      "name": "amount_band",
      "type": "string",
      "storage": "precompute",
      "logic": {
        "if": [
          {">": [{"var": "context.data.settlement_amount"}, 1000000]},
          "HIGH",
          {"if": [
            {">": [{"var": "context.data.settlement_amount"}, 100000]},
            "MEDIUM",
            "LOW"
          ]}
        ]
      }
    }
  ]
}
```

## Querying Custom Fields

### GraphQL API

Query messages using custom fields:

```graphql
query {
  messages(
    filter: {
      package_id: "swift-cbpr-mt-mx",
      custom_field_filters: {
        is_cross_border: true,
        amount_band: "HIGH",
        sender_country: "US"
      }
    },
    limit: 100
  ) {
    messages {
      id
      message_type
      direction
      custom_fields {
        sender_name
        receiver_name
        amount
        currency
        is_cross_border
        amount_band
      }
      created_at
    }
    total_count
  }
}
```

### Aggregations

```graphql
query {
  message_aggregations(
    package_id: "swift-cbpr-mt-mx",
    group_by: ["sender_country", "amount_band"],
    date_range: {
      start: "2025-01-01",
      end: "2025-01-31"
    }
  ) {
    groups {
      sender_country
      amount_band
      count
      total_amount
    }
  }
}
```

## Context Variables

Custom fields have access to transformation context:

| Variable | Description |
|----------|-------------|
| `context.data.*` | Parsed message data |
| `context.metadata.*` | Message metadata |
| `context.temp_data.*` | Intermediate values |

### Available Data Fields

The available `context.data` fields depend on the message type. Common fields include:

- `sender_bic`, `receiver_bic`
- `debtor_name`, `creditor_name`
- `settlement_amount`, `settlement_currency`
- `value_date`, `settlement_date`
- `message_type`, `direction`
- `transaction_reference`, `uetr`
- `service_level`, `charge_bearer`

## Best Practices

### Naming Conventions

Use clear, consistent names:
- `sender_*`, `receiver_*` for party data
- `is_*` for boolean flags
- `*_date` for dates
- `*_count` for counts

### Performance

- Prefer `precompute` for frequently queried fields
- Use `runtime` for time-dependent calculations
- Keep expressions simple for better performance

### Maintenance

- Document each field's purpose
- Version your api_config.json
- Test field logic with sample data

---

**[GraphQL API Reference →](../api-reference/graphql-api.md)**

**[JSONLogic Reference →](../concepts/jsonlogic-rules.md)**
