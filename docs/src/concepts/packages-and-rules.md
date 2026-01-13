# Packages and Rules

How Reframe organizes transformation logic into modular, reusable packages.

## Key Concept: Engine vs Package

**Reframe is a universal transformation engine.** It doesn't know anything about SWIFT, ISO 20022, or any specific message format. All transformation knowledge lives in packages.

| Component | Contains | Examples |
|-----------|----------|----------|
| **Reframe Engine** | Workflow execution, rule evaluation, message parsing framework | Core engine code |
| **Packages** | Message-specific transformation rules, schemas, validation | SWIFT CBPR+, FIX, custom formats |

This means you can use Reframe for **any** message transformation - not just SWIFT/ISO 20022.

## Benefits

This separation of engine and packages enables:
- **Customization**: Modify rules without changing engine code
- **Multiple packages**: Load different rule sets for different contexts
- **Version control**: Track rule changes independently
- **Hot reload**: Update rules without restarting

For architecture diagrams, see **[Architecture Overview →](../why-reframe/architecture-overview.md)**

## Package Structure

A Reframe package follows this structure:

```
reframe-package-swift-cbpr/
├── reframe-package.json          # Package metadata
│
├── transform/                    # Transformation workflows
│   ├── index.json               # Workflow registry
│   ├── 00-detect-format.json    # Format detection
│   │
│   ├── outgoing/                # MT → MX rules
│   │   ├── parse-mt.json        # Common MT parser
│   │   ├── combine-xml.json     # XML assembly
│   │   ├── MT103/               # MT103-specific rules
│   │   │   ├── bah-mapping.json
│   │   │   ├── document-mapping.json
│   │   │   ├── precondition.json
│   │   │   └── postcondition.json
│   │   └── MT202/
│   │       └── ...
│   │
│   └── incoming/                # MX → MT rules
│       ├── parse-mx.json        # Common MX parser
│       ├── pacs008/             # pacs.008-specific rules
│       │   ├── 01-variant-detection.json
│       │   ├── 02-preconditions.json
│       │   ├── 03-headers-mapping.json
│       │   └── ...
│       └── pacs009/
│           └── ...
│
├── validate/                    # Validation workflows
│   ├── index.json
│   ├── validate-mt.json
│   └── validate-mx.json
│
├── generate/                    # Sample generation
│   ├── index.json
│   ├── generate-mt.json
│   └── generate-mx.json
│
└── scenarios/                   # Test scenarios
    ├── index.json
    ├── outgoing/
    │   └── mt103_to_pacs008_standard.json
    └── incoming/
        └── pacs008_to_mt103.json
```

## Package Metadata

The `reframe-package.json` file defines package identity:

```json
{
  "id": "swift-cbpr-mt-mx",
  "name": "SWIFT CBPR+ MT <-> MX Transformations",
  "version": "2.1.2",
  "description": "SR2025 compliant CBPR+ transformations",
  "engine_version": "3.1.4",
  "author": "Plasmatic",
  "license": "Apache-2.0",

  "workflows": {
    "transform": {
      "path": "transform",
      "entry_point": "index.json"
    },
    "generate": {
      "path": "generate",
      "entry_point": "index.json"
    },
    "validate": {
      "path": "validate",
      "entry_point": "index.json"
    }
  },

  "scenarios": {
    "path": "scenarios",
    "entry_point": "index.json"
  }
}
```

## Workflow Definition

Workflows are defined in JSON with this structure:

```json
{
  "id": "mt103-document-mapping",
  "name": "MT103 Document Mapping",
  "description": "Maps MT103 fields to pacs.008 document",
  "priority": 5,

  "condition": {
    "and": [
      {"==": [{"var": "metadata.direction"}, "outgoing"]},
      {"==": [{"var": "metadata.message_type"}, "MT103"]}
    ]
  },

  "tasks": [
    {
      "id": "map-payment-id",
      "name": "Map Payment Identification",
      "function": {
        "name": "map",
        "input": {
          "mappings": [
            {
              "path": "data.output.PmtId.InstrId",
              "logic": {"var": "data.SwiftMT.fields.20.transaction_reference"}
            },
            {
              "path": "data.output.PmtId.EndToEndId",
              "logic": {"var": "data.SwiftMT.fields.21.related_reference"}
            }
          ]
        }
      }
    }
  ]
}
```

### Workflow Properties

| Property | Description |
|----------|-------------|
| `id` | Unique identifier |
| `priority` | Execution order (lower = earlier) |
| `condition` | JSONLogic expression determining when workflow runs |
| `tasks` | Array of tasks to execute |

### Task Properties

| Property | Description |
|----------|-------------|
| `id` | Task identifier |
| `function.name` | Function to execute (`map`, `validation`, custom) |
| `function.input` | Function-specific configuration |
| `condition` | Optional condition for task execution |

## Rule Organization

Rules are organized by message type and transformation stage:

### Outgoing (MT → MX)

```
transform/outgoing/MT103/
├── bah-mapping.json       # Priority 3: Business Application Header
├── precondition.json      # Priority 4: Pre-transformation validation
├── document-mapping.json  # Priority 5: Field transformation
└── postcondition.json     # Priority 6: Post-transformation validation
```

### Incoming (MX → MT)

```
transform/incoming/pacs008/
├── 01-variant-detection.json    # Detect target MT type
├── 02-preconditions.json        # Validate transformation
├── 03-headers-mapping.json      # Map MT headers
├── 04-mandatory-fields.json     # Required fields
├── 05-amount-fields.json        # Amount handling
├── 06-party-fields.json         # Party information
├── 07-agent-fields.json         # Agent (bank) information
├── 08-remittance-fields.json    # Remittance details
└── 09-postconditions.json       # Final validation
```

## Priority-Based Execution

Workflows execute in priority order:

```
Priority 1: parse-mt.json          ─── Parse input
Priority 2: method-detection.json  ─── Detect variant
Priority 3: bah-mapping.json       ─── Map header
Priority 4: precondition.json      ─── Validate
Priority 5: document-mapping.json  ─── Transform
Priority 6: postcondition.json     ─── Validate output
Priority 10: combine-xml.json      ─── Generate XML
```

This ensures:
- Parsing happens before mapping
- Validation occurs at appropriate stages
- Output generation happens last

## Loading Packages

### Default Package Path

```bash
# Environment variable
export REFRAME_PACKAGE_PATH=/path/to/packages

# Or in reframe.config.json
{
  "packages": [
    {
      "path": "/packages/swift-cbpr",
      "enabled": true
    }
  ]
}
```

### Docker Volume Mount

```yaml
services:
  reframe:
    image: plasmatic/reframe:latest
    volumes:
      - ./my-package:/packages/my-package
    environment:
      - REFRAME_PACKAGE_PATH=/packages
```

Packages can be hot-reloaded. See **[Hot Reload →](../features/hot-reload.md)**

## Creating Custom Packages

### 1. Create Package Structure

```bash
mkdir -p my-package/{transform,validate,generate,scenarios}
```

### 2. Define Package Metadata

```json
// my-package/reframe-package.json
{
  "id": "my-custom-package",
  "name": "My Custom Transformations",
  "version": "1.0.0",
  "engine_version": "3.1.0",
  "workflows": {
    "transform": {"path": "transform", "entry_point": "index.json"}
  }
}
```

### 3. Create Workflow Index

```json
// my-package/transform/index.json
{
  "workflows": [
    {"path": "my-transformation.json"}
  ]
}
```

### 4. Define Transformation Rules

```json
// my-package/transform/my-transformation.json
{
  "id": "my-transform",
  "name": "My Custom Transformation",
  "priority": 5,
  "condition": {"==": [{"var": "metadata.type"}, "custom"]},
  "tasks": [
    // ... your mapping tasks
  ]
}
```

---

## Related Pages

- **[JSONLogic Rules](./jsonlogic-rules.md)** - Business rule syntax and examples
- **[Transformation Engine](./transformation-engine.md)** - Core engine architecture
- **[Workflow Orchestration](./workflow-orchestration.md)** - Multi-step transformation flows
- **[CBPR+ Package Guide](../cbpr-plus/overview.md)** - SWIFT CBPR+ package details
- **[Hot Reload](../features/hot-reload.md)** - Update rules without restart
