# Dataflow

The workflow orchestration engine powering Reframe pipelines.

## What is Dataflow?

**Dataflow** is an async-first workflow orchestration engine built in Rust. It executes transformation pipelines by routing messages through a series of workflows and tasks.

In Reframe, Dataflow manages the transformation pipeline - determining which workflows execute and in what order.

## Role in Reframe

```
Message Input
      │
      ▼
┌───────────────────────────────────────────────┐
│              Dataflow Engine                  │
│                                               │
│  ┌──────────┐   ┌──────────┐   ┌───────────┐  │
│  │Workflow  │──▶│Workflo w │──▶│Workflow   │  │
│  │Priority:1│   │Priority:5│   │Priority:10│  │
│  └──────────┘   └──────────┘   └───────────┘  │
│                                               │
│  Each workflow contains tasks that:           │
│  • Map fields (using Datalogic)               │
│  • Validate data                              │
│  • Call custom functions                      │
└───────────────────────────────────────────────┘
      │
      ▼
Message Output
```

## Key Features

### Priority-Based Execution

Workflows execute in priority order (lowest first):

```
Priority 1:  parse-mt.json
Priority 2:  detect-variant.json
Priority 3:  bah-mapping.json
Priority 5:  document-mapping.json
Priority 10: combine-xml.json
```

### Conditional Routing

Each workflow has a condition that determines if it runs:

```json
{
  "condition": {
    "and": [
      {"==": [{"var": "metadata.direction"}, "outgoing"]},
      {"==": [{"var": "metadata.message_type"}, "MT103"]}
    ]
  }
}
```

### Pre-Compiled Workflows

- All JSONLogic compiled at startup
- Zero runtime parsing
- Indexed for O(1) access

### Audit Trail

Every change is recorded:

```json
{
  "audit_trail": [
    {
      "timestamp": "2025-01-15T10:30:00Z",
      "workflow_id": "mt103-mapping",
      "task_id": "map-amount",
      "path": "data.output.IntrBkSttlmAmt",
      "old_value": null,
      "new_value": "50000.00"
    }
  ]
}
```

## Interactive Playground

Try Dataflow workflows in the browser:

**[Dataflow Playground →](https://goplasmatic.github.io/dataflow-rs/playground/)**

## Resources

| Resource | Link |
|----------|------|
| Documentation | [goplasmatic.github.io/dataflow-rs](https://goplasmatic.github.io/dataflow-rs/) |
| GitHub | [github.com/GoPlasmatic/dataflow-rs](https://github.com/GoPlasmatic/dataflow-rs) |
| Crates.io | [crates.io/crates/dataflow-rs](https://crates.io/crates/dataflow-rs) |
| Playground | [Interactive Playground](https://goplasmatic.github.io/dataflow-rs/playground/) |

## Workflow Structure

```json
{
  "id": "mt103-document-mapping",
  "name": "MT103 Document Mapping",
  "priority": 5,

  "condition": {
    "==": [{"var": "metadata.message_type"}, "MT103"]
  },

  "tasks": [
    {
      "id": "map-payment-id",
      "function": {
        "name": "map",
        "input": {
          "mappings": [
            {
              "path": "data.output.PmtId.InstrId",
              "logic": {"var": "data.SwiftMT.fields.20.transaction_reference"}
            }
          ]
        }
      }
    }
  ]
}
```

## Task Types

### Map Task

Transform data using JSONLogic:

```json
{
  "function": {
    "name": "map",
    "input": {
      "mappings": [
        {"path": "output.field", "logic": {"var": "input.field"}}
      ]
    }
  }
}
```

### Validation Task

Validate data against rules:

```json
{
  "function": {
    "name": "validation",
    "input": {
      "rules": [
        {"logic": {"!!": {"var": "data.required"}}, "message": "Required field"}
      ]
    }
  }
}
```

### Custom Function

Call registered functions:

```json
{
  "function": {
    "name": "parse_mt",
    "input": {"source": "data.raw", "target": "data.parsed"}
  }
}
```

---

**[Datalogic →](./datalogic.md)**

**[Workflow Orchestration Guide →](../concepts/workflow-orchestration.md)**
