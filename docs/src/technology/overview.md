# Technology Overview

The open-source foundation powering Reframe.

## Architecture

Reframe is built on a modular architecture with specialized libraries:

```
┌─────────────────────────────────────────────────────────────┐
│                      Reframe Engine                         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Dataflow  │  │  Datalogic  │  │      Datafake       │  │
│  │  Workflows  │  │   Rules     │  │   Data Generation   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  swift-mt-message  │  mx-message  │  quick-xml       │   │
│  │  MT Parsing        │  MX Parsing  │  XML Processing  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Core Libraries

| Library | Purpose | Role in Reframe |
|---------|---------|-----------------|
| [Dataflow](./dataflow.md) | Workflow orchestration | Executes transformation pipelines |
| [Datalogic](./datalogic.md) | JSONLogic evaluation | Processes business rules and mappings |
| [Datafake](./datafake.md) | Test data generation | Generates sample messages |

## Why These Libraries?

### Separation of Concerns

Each library handles a specific responsibility:
- **Dataflow**: Orchestrates *when* and *how* workflows execute
- **Datalogic**: Evaluates *what* transformations to apply
- **Datafake**: Generates *realistic* test data

### Performance

All libraries are:
- Written in Rust for memory safety and speed
- Pre-compiled at startup (zero runtime parsing)
- Thread-safe for concurrent processing

### Transparency

All business logic is:
- Defined in JSON (not compiled code)
- Auditable and version-controllable
- Modifiable without rebuilding

## Technology Stack

### Core

| Technology | Version | Purpose |
|------------|---------|---------|
| Rust | 1.89+ | Language |
| Tokio | 1.48 | Async runtime |
| Axum | 0.8 | HTTP framework |
| serde_json | 1.0 | JSON processing |

### Message Processing

| Library | Purpose |
|---------|---------|
| swift-mt-message | SWIFT MT parsing |
| mx-message | ISO 20022 parsing |
| quick-xml | XML serialization |

### Database & API

| Technology | Purpose |
|------------|---------|
| MongoDB | Message storage (optional) |
| utoipa | OpenAPI generation |
| async-graphql | GraphQL API |

## Open Source Ecosystem

All components are open source under Apache 2.0:

| Project | GitHub | Documentation |
|---------|--------|---------------|
| Reframe | [GoPlasmatic/Reframe](https://github.com/GoPlasmatic/Reframe) | This site |
| Datalogic | [GoPlasmatic/datalogic-rs](https://github.com/GoPlasmatic/datalogic-rs) | [Docs](https://goplasmatic.github.io/datalogic-rs/) |
| Dataflow | [GoPlasmatic/dataflow-rs](https://github.com/GoPlasmatic/dataflow-rs) | [Docs](https://goplasmatic.github.io/dataflow-rs/) |
| Datafake | [GoPlasmatic/datafake-rs](https://github.com/GoPlasmatic/datafake-rs) | [Docs](https://goplasmatic.github.io/datafake-rs/) |

Each project includes an interactive playground for testing.

## Performance Characteristics

### Latency

| Operation | Typical Latency |
|-----------|-----------------|
| MT103 → pacs.008 | < 1ms |
| pacs.008 → MT103 | < 1ms |
| Validation | < 0.5ms |
| Sample generation | < 2ms |

### Throughput

| Configuration | Messages/Second |
|---------------|-----------------|
| Single instance (4 CPU) | 5,000+ |
| Horizontal scaling | Linear |

### Resource Usage

| Resource | Typical Usage |
|----------|---------------|
| Memory | 256-512 MB |
| CPU | Low (mostly I/O bound) |
| Startup time | < 5 seconds |

---

**[Datalogic →](./datalogic.md)**

**[Dataflow →](./dataflow.md)**

**[Datafake →](./datafake.md)**
