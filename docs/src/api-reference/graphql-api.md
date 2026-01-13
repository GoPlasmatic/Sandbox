# GraphQL API

Query transformation history and analytics using GraphQL.

## Endpoint

```
POST /graphql
```

## Playground

Interactive GraphQL playground:

```
GET /graphql
```

Open in browser to explore the schema and run queries.

## Schema Overview

### Types

```graphql
type Message {
  id: ID!
  message_type: String!
  direction: String!
  source_message: String!
  target_message: String!
  status: String!
  package_id: String!
  created_at: DateTime!
  timing_ms: Float!
  custom_fields: CustomFields
}

type CustomFields {
  sender_name: String
  receiver_name: String
  amount: Float
  currency: String
  sender_country: String
  receiver_country: String
  is_cross_border: Boolean
  amount_band: String
}

type MessageConnection {
  messages: [Message!]!
  total_count: Int!
  has_next_page: Boolean!
}

type Aggregation {
  group_key: String!
  count: Int!
  total_amount: Float
}
```

### Queries

```graphql
type Query {
  # Get a single message by ID
  message(id: ID!): Message

  # Query messages with filtering
  messages(
    filter: MessageFilter
    limit: Int = 100
    offset: Int = 0
    order_by: OrderBy
  ): MessageConnection!

  # Aggregate messages
  message_aggregations(
    package_id: String!
    group_by: [String!]!
    filter: MessageFilter
  ): [Aggregation!]!
}
```

### Filters

```graphql
input MessageFilter {
  package_id: String
  message_type: String
  direction: String
  status: String
  date_range: DateRange
  custom_field_filters: CustomFieldFilters
}

input DateRange {
  start: DateTime!
  end: DateTime!
}

input CustomFieldFilters {
  sender_country: String
  receiver_country: String
  is_cross_border: Boolean
  amount_band: String
  amount_min: Float
  amount_max: Float
}

input OrderBy {
  field: String!
  direction: SortDirection!
}

enum SortDirection {
  ASC
  DESC
}
```

## Query Examples

### Get Recent Messages

```graphql
query {
  messages(
    filter: {
      package_id: "swift-cbpr-mt-mx"
    },
    limit: 10,
    order_by: { field: "created_at", direction: DESC }
  ) {
    messages {
      id
      message_type
      direction
      status
      created_at
      timing_ms
    }
    total_count
  }
}
```

### Filter by Custom Fields

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
      custom_fields {
        sender_name
        receiver_name
        amount
        currency
        sender_country
        receiver_country
      }
    }
    total_count
  }
}
```

### Filter by Date Range

```graphql
query {
  messages(
    filter: {
      package_id: "swift-cbpr-mt-mx",
      date_range: {
        start: "2025-01-01T00:00:00Z",
        end: "2025-01-31T23:59:59Z"
      }
    }
  ) {
    messages {
      id
      message_type
      created_at
    }
    total_count
  }
}
```

### Get Message by ID

```graphql
query {
  message(id: "msg-12345") {
    id
    message_type
    direction
    source_message
    target_message
    status
    created_at
    timing_ms
    custom_fields {
      sender_name
      receiver_name
      amount
      currency
    }
  }
}
```

### Aggregate by Country

```graphql
query {
  message_aggregations(
    package_id: "swift-cbpr-mt-mx",
    group_by: ["sender_country"],
    filter: {
      date_range: {
        start: "2025-01-01T00:00:00Z",
        end: "2025-01-31T23:59:59Z"
      }
    }
  ) {
    group_key
    count
    total_amount
  }
}
```

### Aggregate by Multiple Dimensions

```graphql
query {
  message_aggregations(
    package_id: "swift-cbpr-mt-mx",
    group_by: ["sender_country", "amount_band"],
    filter: {
      custom_field_filters: {
        is_cross_border: true
      }
    }
  ) {
    group_key
    count
    total_amount
  }
}
```

## Using curl

### Basic Query

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { messages(limit: 10) { messages { id message_type } } }"
  }'
```

### Query with Variables

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetMessages($limit: Int!) { messages(limit: $limit) { messages { id } } }",
    "variables": {"limit": 50}
  }'
```

## Requirements

GraphQL queries require:

1. **MongoDB persistence** enabled in configuration
2. **Message storage** enabled for transformations

### Configuration

```json
{
  "database": {
    "mongodb_uri": "mongodb://localhost:27017",
    "database_name": "reframe",
    "store_messages": true
  }
}
```

## Custom Fields

Custom fields are defined in the package's `api_config.json` and computed during transformation. Common fields include:

| Field | Type | Description |
|-------|------|-------------|
| `sender_name` | string | Debtor name |
| `receiver_name` | string | Creditor name |
| `amount` | number | Settlement amount |
| `currency` | string | Currency code |
| `sender_country` | string | Sender country (from BIC) |
| `receiver_country` | string | Receiver country (from BIC) |
| `is_cross_border` | boolean | Cross-border indicator |
| `amount_band` | string | HIGH/MEDIUM/LOW |

---

**[Custom Fields Guide →](../features/custom-fields.md)**

**[API Overview →](./overview.md)**
