# Workflow Orchestration

How Reframe orchestrates transformation pipelines using Dataflow.

## Dataflow Engine

Reframe uses [Dataflow](https://goplasmatic.github.io/dataflow-rs/) for workflow orchestration. Dataflow provides:

- **Pre-compiled workflows**: All rules compiled at startup, zero runtime parsing
- **Priority-based execution**: Workflows execute in defined order
- **Conditional routing**: Rules determine which workflows apply
- **Audit trail**: Complete record of all transformations

## Workflow Execution Model

```
                    Input Message
                          │
                          ▼
              ┌───────────────────────┐
              │   Message Context     │
              │   • data              │
              │   • metadata          │
              │   • temp_data         │
              └───────────┬───────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
    ┌─────────┐     ┌─────────┐     ┌─────────┐
    │Workflow │     │Workflow │     │Workflow │
    │   P:1   │────▶│   P:5   │────▶│  P:10   │
    └─────────┘     └─────────┘     └─────────┘
         │                │                │
         ▼                ▼                ▼
    ┌─────────────────────────────────────────┐
    │           Updated Context               │
    └─────────────────────────────────────────┘
                          │
                          ▼
                   Output Message
```

## Message Context

Every message flows through with a context object:

```json
{
  "context": {
    "data": {
      "SwiftMT": { /* parsed MT message */ },
      "output": { /* transformation output */ }
    },
    "metadata": {
      "direction": "outgoing",
      "message_type": "MT103",
      "variant": "standard"
    },
    "temp_data": {
      /* intermediate calculations */
    }
  },
  "audit_trail": [
    /* record of all changes */
  ],
  "errors": [
    /* any errors encountered */
  ]
}
```

### Context Sections

| Section | Purpose |
|---------|---------|
| `data` | Primary business data (input and output) |
| `metadata` | Routing and tracking information |
| `temp_data` | Intermediate processing results |
| `audit_trail` | Record of all modifications |
| `errors` | Collected errors and warnings |

## Workflow Structure

A workflow definition:

```json
{
  "id": "mt103-transform",
  "name": "MT103 Transformation",
  "description": "Transform MT103 to pacs.008",
  "priority": 5,

  "condition": {
    "and": [
      {"==": [{"var": "metadata.direction"}, "outgoing"]},
      {"==": [{"var": "metadata.message_type"}, "MT103"]}
    ]
  },

  "error_handling": "continue",

  "tasks": [
    {
      "id": "map-payment-info",
      "name": "Map Payment Information",
      "function": {
        "name": "map",
        "input": {
          "mappings": [/* field mappings */]
        }
      }
    }
  ]
}
```

### Workflow Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique workflow identifier |
| `name` | string | Human-readable name |
| `priority` | number | Execution order (lower = earlier) |
| `condition` | JSONLogic | When this workflow should run |
| `error_handling` | string | `"continue"` or `"stop"` on error |
| `tasks` | array | Tasks to execute |

## Priority-Based Execution

Workflows execute in priority order:

```
Priority 1: parse-mt.json
    │
    ▼ (condition check)
Priority 2: detect-variant.json
    │
    ▼ (condition check)
Priority 3: bah-mapping.json
    │
    ▼ (condition check)
Priority 4: precondition.json
    │
    ▼ (condition check)
Priority 5: document-mapping.json
    │
    ▼ (condition check)
Priority 6: postcondition.json
    │
    ▼ (condition check)
Priority 10: publish-xml.json
```

Each workflow's condition is evaluated:
- **Condition true**: Workflow executes
- **Condition false**: Workflow skipped

## Task Types

### Map Task

Transform data using JSONLogic:

```json
{
  "id": "map-fields",
  "function": {
    "name": "map",
    "input": {
      "mappings": [
        {
          "path": "data.output.field1",
          "logic": {"var": "data.input.source_field"}
        },
        {
          "path": "data.output.field2",
          "logic": {"cat": [{"var": "data.a"}, {"var": "data.b"}]}
        }
      ]
    }
  }
}
```

### Validation Task

Validate data against rules:

```json
{
  "id": "validate-input",
  "function": {
    "name": "validation",
    "input": {
      "rules": [
        {
          "logic": {"!!": {"var": "data.required_field"}},
          "message": "Required field is missing"
        },
        {
          "logic": {">": [{"var": "data.amount"}, 0]},
          "message": "Amount must be positive"
        }
      ]
    }
  }
}
```

### Custom Function Task

Call custom functions registered with the engine:

```json
{
  "id": "parse-message",
  "function": {
    "name": "parse_mt",
    "input": {
      "source": "data.raw_message",
      "target": "data.SwiftMT"
    }
  }
}
```

## Conditional Tasks

Tasks can have their own conditions:

```json
{
  "id": "map-optional-field",
  "condition": {
    "!!": {"var": "data.SwiftMT.fields.70.remittance_information"}
  },
  "function": {
    "name": "map",
    "input": {
      "mappings": [
        {
          "path": "data.output.RmtInf.Ustrd",
          "logic": {"var": "data.SwiftMT.fields.70.remittance_information"}
        }
      ]
    }
  }
}
```

The task only executes if the condition evaluates to true.

## Audit Trail

Every modification is recorded:

```json
{
  "audit_trail": [
    {
      "timestamp": "2025-01-15T10:30:00.123Z",
      "workflow_id": "mt103-transform",
      "task_id": "map-payment-info",
      "path": "data.output.PmtId.InstrId",
      "old_value": null,
      "new_value": "REF123456"
    },
    {
      "timestamp": "2025-01-15T10:30:00.125Z",
      "workflow_id": "mt103-transform",
      "task_id": "map-amount",
      "path": "data.output.IntrBkSttlmAmt",
      "old_value": null,
      "new_value": {"Ccy": "USD", "value": "50000.00"}
    }
  ]
}
```

### Audit Trail Benefits

- **Debugging**: See exactly what changed and when
- **Compliance**: Complete transformation history
- **Testing**: Verify expected transformations occurred
- **Monitoring**: Track transformation patterns

## Error Handling

### Workflow-Level Handling

```json
{
  "id": "critical-workflow",
  "error_handling": "stop",
  "tasks": [/* ... */]
}
```

| Setting | Behavior |
|---------|----------|
| `"continue"` | Log error, continue to next workflow |
| `"stop"` | Halt processing, return error |

### Task-Level Handling

```json
{
  "id": "optional-task",
  "error_handling": "continue",
  "function": {/* ... */}
}
```

### Error Collection

Errors are collected in the context:

```json
{
  "errors": [
    {
      "workflow_id": "validation",
      "task_id": "check-amount",
      "code": "VALIDATION_FAILED",
      "message": "Amount must be positive"
    }
  ]
}
```

## Performance Optimization

### Pre-Compilation

All JSONLogic rules are compiled at startup:

```
Startup
   │
   ▼
┌──────────────────┐
│ Load Workflows   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Compile All      │  ← One-time cost
│ JSONLogic Rules  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Cache Compiled   │
│ Rules in Memory  │
└────────┬─────────┘
         │
         ▼
    Ready to Process
```

### Runtime Efficiency

During message processing:
- No parsing of rule definitions
- Direct execution of compiled logic
- O(1) access to cached rules

## Workflow Index

The workflow index registers all workflows:

```json
// transform/index.json
{
  "workflows": [
    {"path": "00-detect-format.json"},
    {"path": "outgoing/parse-mt.json"},
    {"path": "outgoing/MT103/bah-mapping.json"},
    {"path": "outgoing/MT103/document-mapping.json"},
    {"path": "outgoing/combine-xml.json"},
    {"path": "incoming/parse-mx.json"},
    {"path": "incoming/pacs008/variant-detection.json"},
    {"path": "incoming/pacs008/field-mapping.json"}
  ]
}
```

---

**[Try the Dataflow Playground →](https://goplasmatic.github.io/dataflow-rs/playground/)**

**[See CBPR+ Workflows →](../cbpr-plus/overview.md)**
