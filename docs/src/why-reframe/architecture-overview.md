# Architecture Overview

How Reframe achieves high-performance, transparent message transformation.

## Universal, Package-Based Design

Reframe is a **universal message transformation engine** - not tied to any specific standard. The engine loads transformation packages that define the rules for converting between formats.

**Key insight**: Reframe is completely format-agnostic - all SWIFT, ISO 20022, and CBPR+ knowledge lives in loadable packages.

## Design Principles

Reframe is built on four core principles:

1. **Separation of concerns**: Engine logic completely separate from transformation rules
2. **Transparency**: All business rules in external, auditable JSON files
3. **Performance**: Rust implementation with zero-copy processing
4. **Universality**: Package-based architecture supports any message standard

## System Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │              Reframe Engine                  │
                    │                                              │
   Input Message    │  ┌─────────┐  ┌─────────┐  ┌─────────┐       │   Output Message
   (MT or MX)  ────▶│  │ Parser  │─▶│Workflow │─▶│Publisher│─────▶ │   (MX or MT)
                    │  └─────────┘  │ Engine  │  └─────────┘       │
                    │               └────┬────┘                    │
                    │                    │                         │
                    └────────────────────┼─────────────────────────┘
                                         │ loads
                    ┌────────────────────▼─────────────────────────┐
                    │           Transformation Package             │
                    │                                              │
                    │   ┌─────────────┐  ┌─────────────────────┐   │
                    │   │  Workflows  │  │   Field Mappings    │   │
                    │   │  (JSON)     │  │   (JSONLogic)       │   │
                    │   └─────────────┘  └─────────────────────┘   │
                    │                                              │
                    │   ┌─────────────┐  ┌─────────────────────┐   │
                    │   │ Conditions  │  │   Validation Rules  │   │
                    │   │ (JSONLogic) │  │   (JSONLogic)       │   │
                    │   └─────────────┘  └─────────────────────┘   │
                    └──────────────────────────────────────────────┘
```

## Core Components

### 1. Reframe Engine

The engine handles all runtime processing:

| Component | Responsibility |
|-----------|---------------|
| **Parser** | Detects message format (MT/MX), parses into internal representation |
| **Workflow Engine** | Orchestrates transformation pipeline using Dataflow |
| **Rule Evaluator** | Executes JSONLogic expressions using Datalogic |
| **Publisher** | Generates output in target format (MT or MX XML) |
| **Validator** | Validates messages against schemas and business rules |

### 2. Transformation Package

Packages contain all transformation logic in JSON. **Reframe can load any package** - it's not limited to a specific format.

**Available Packages:**

| Package | Description | Link |
|---------|-------------|------|
| **SWIFT CBPR+ MT ↔ ISO 20022** | SR2025 compliant bidirectional transformations (free) | [GitHub](https://github.com/GoPlasmatic/reframe-package-swift-cbpr) |
| *Custom packages* | Create your own for FIX, proprietary formats, etc. | [Package Guide](../concepts/packages-and-rules.md) |

**Example Package Structure (SWIFT CBPR+):**

```
reframe-package-swift-cbpr/
├── reframe-package.json      # Package metadata
├── transform/
│   ├── index.json           # Workflow registry
│   ├── outgoing/            # MT → MX rules
│   │   ├── MT103/
│   │   │   ├── document-mapping.json
│   │   │   ├── bah-mapping.json
│   │   │   └── precondition.json
│   │   └── MT202/
│   └── incoming/            # MX → MT rules
│       ├── pacs008/
│       └── pacs009/
├── validate/                # Validation rules
└── generate/                # Sample generation
```

### 3. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Runtime** | Rust + Tokio | Async, high-performance execution |
| **Workflow** | Dataflow | Pipeline orchestration |
| **Rules** | Datalogic | JSONLogic evaluation |
| **MT Parser** | swift-mt-message | SWIFT MT parsing |
| **MX Parser** | mx-message | ISO 20022 XML parsing |
| **API** | Axum | HTTP/REST server |

## Transformation Pipeline

### MT to ISO 20022 (Outgoing)

```
MT103 Input
    │
    ▼
┌─────────────────┐
│ 1. Parse MT     │  Extract blocks and fields
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Detect Type  │  Identify MT variant (standard/STP/reject/return)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. Map BAH      │  Create Business Application Header
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. Pre-validate │  Check business rule preconditions
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 5. Map Document │  Transform fields to ISO 20022 paths
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 6. Post-validate│  Verify output compliance
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 7. Publish XML  │  Generate ISO 20022 XML envelope
└────────┬────────┘
         │
         ▼
    pacs.008 Output
```

### ISO 20022 to MT (Incoming)

The reverse flow follows a similar pattern, extracting data from XML and constructing MT blocks.

## Performance Characteristics

### Zero-Copy Processing
- Pre-compiled JSONLogic rules at startup
- No runtime parsing of rule definitions
- Direct memory access for string operations

### Async Architecture
- Tokio runtime with configurable worker threads
- Non-blocking I/O for all operations
- Handles thousands of concurrent requests

### Benchmarks

| Operation | Latency | Throughput |
|-----------|---------|------------|
| MT103 → pacs.008 | <1ms | 5,000+ msg/sec |
| pacs.008 → MT103 | <1ms | 5,000+ msg/sec |
| Validation | <0.5ms | 10,000+ msg/sec |

*Benchmarks on standard cloud VM (4 vCPU, 8GB RAM)*

## Scalability

### Horizontal Scaling
- Stateless design enables simple replication
- No shared state between instances
- Load balance across multiple containers

### Deployment Options

```
                    ┌─────────────┐
                    │   Load      │
                    │   Balancer  │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────┐       ┌─────────┐       ┌─────────┐
   │ Reframe │       │ Reframe │       │ Reframe │
   │   #1    │       │   #2    │       │   #3    │
   └─────────┘       └─────────┘       └─────────┘
```

## Hot Reload

Update transformation rules without restarting the engine. See **[Hot Reload Guide →](../features/hot-reload.md)**

---

**[See Real Use Cases →](./use-cases.md)**

**[Get Started with Quick Start →](../getting-started/quick-start.md)**
