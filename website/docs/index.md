---
sidebar_position: 1
---

# Reframe

**An Enterprise-Grade, Bidirectional SWIFT MT ↔ ISO 20022 Transformation Engine**

Reframe is the world's first completely transparent, open-source platform for high-performance SWIFT message transformation.

## Why Reframe?

In the evolving world of financial messaging, clarity and control are non-negotiable. **Reframe** was built to provide a powerful, open-source alternative to proprietary, black-box solutions for SWIFT MT and ISO 20022 transformation. It's designed for financial institutions that demand **auditable logic**, **elite performance**, and **complete control** over their messaging workflows.

- **Full Transparency**: Say goodbye to black boxes. Every transformation rule is defined in human-readable JSON and is fully auditable.
- **Blazing-Fast Performance**: Built in Rust, Reframe delivers sub-millisecond processing speeds, ensuring your operations are never bottlenecked.
- **Total Configurability**: Define your own business logic and mappings with a simple yet powerful JSON-based configuration system.
- **Extensible by Design**: A modular, pluggable architecture makes it easy to customize or extend Reframe to meet your specific needs.

## Key Features

Reframe's robust feature set empowers financial institutions with transparent, high-performance, and fully customizable SWIFT MT and ISO 20022 message transformation capabilities, setting new industry standards for speed, control, and auditability.

### Core Transformation Engine

- **True Bidirectional Processing**: Seamlessly transform messages both ways:
  - **Forward**: SWIFT MT → ISO 20022 (MX)
  - **Reverse**: ISO 20022 (MX) → SWIFT MT
- **Comprehensive Message Support**: 44+ pre-configured transformation scenarios covering payments, cash management, status reporting, and administrative messages.
- **Intelligent Routing**: Automatic message type detection and routing to the correct transformation workflow.

### Built for the Enterprise

- **High Availability**: A stateless, container-native architecture allows for effortless horizontal scaling.
- **Zero-Downtime Updates**: Hot-reload configurations and workflows on the fly via an API endpoint, no service restarts required.
- **Production-Ready**: Comes with comprehensive error handling, monitoring, and observability baked in.
- **Simple Deployment**: Ships as a single, lightweight Docker image for easy deployment in any environment.

### Unmatched Transparency & Control

- **Externalized JSON Rules**: All transformation logic is stored in clear, auditable JSON files—no hidden or compiled logic.
- **Powerful Workflow Engine**: Backed by a sophisticated dataflow engine ([dataflow-rs](https://github.com/GoPlasmatic/dataflow-rs)) to model complex processing pipelines.
- **Declarative Logic**: Utilizes [datalogic-rs](https://github.com/GoPlasmatic/datalogic-rs) to enable powerful and clear declarative logic for complex field mappings.

## How Reframe Compares

| Feature              | Reframe                                       | Traditional Solutions                 |
| -------------------- | --------------------------------------------- | ------------------------------------- |
| **Transparency** | ✅ Open source with 100% auditable JSON rules | ❌ Proprietary, black-box logic       |
| **Transformation** | ✅ Fully bidirectional (MT ↔ MX)              | ❌ Often one-way or limited reverse   |
| **Performance** | ✅ Rust-powered (sub-millisecond)             | ❌ Slower, often JVM-based            |
| **Configuration** | ✅ Hot-reloadable JSON, no downtime           | ❌ Requires vendor intervention       |
| **License** | ✅ Apache 2.0 (Free to use and modify)        | ❌ Expensive, restrictive licensing   |
| **Deployment** | ✅ Lightweight, single Docker container       | ❌ Heavy, complex infrastructure      |
| **SR2025 Compliance** | ✅ Full compliance with November 2025 release | ❌ Limited or delayed support         |
| **CBPR+ Support** | ✅ Enhanced CBPR+ capabilities                | ❌ Basic or partial implementation    |

## Get Started in Minutes

### With Docker (Recommended)

The fastest way to get Reframe running.

```bash
# Pull the latest image from Docker Hub
docker pull plasmatic/reframe:latest

# Run the container and expose the API on port 3000
docker run -p 3000:3000 plasmatic/reframe:latest

# The API is now live and waiting for requests at http://localhost:3000
```

### From Source
For developers who want to build from the ground up.

```bash
# 1. Clone the repository
git clone https://github.com/GoPlasmatic/Reframe.git
cd Reframe

# 2. Build the project in release mode (optimized for performance)
cargo build --release

# 3. Run the application
./target/release/reframe
```

### Try It Now
Use curl to send your first transformation request.

```bash
# Example: Transform an MT103 to a pacs.008
curl -X POST http://localhost:3000/transform/mt-to-mx \
  -H "Content-Type: application/json" \
  -d '{"message": "{1:F01BNPAFRPPXXX0000000000}{...}"}'

# Example: Transform a pacs.008 back to an MT103
curl -X POST http://localhost:3000/transform/mx-to-mt \
  -H "Content-Type: application/json" \
  -d '{"message": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Document>...</Document>"}'

# Example: Validate an MT message
curl -X POST http://localhost:3000/validate/mt \
  -H "Content-Type: application/json" \
  -d '{"message": "{1:F01BNPAFRPPXXX0000000000}{...}"}'

# Example: Generate sample messages
curl -X POST http://localhost:3000/generate/sample \
  -H "Content-Type: application/json" \
  -d '{"message_type": "MT103", "format": "mt"}'

# Example: Hot-reload workflows after a configuration change
curl -X POST http://localhost:3000/admin/reload-workflows
```

## Roadmap

Our vision is to make Reframe the undisputed backbone for financial messaging.

### What's New (v3.0.9)

- **SR2025 Compliance**: Full compliance with SWIFT Release 2025 (November standards).
- **Enhanced CBPR+ Support**: Advanced Cross-Border Payments and Reporting Plus capabilities.
- **44+ Transformation Scenarios**: Comprehensive coverage of MT ↔ MX transformations.
- **Performance Optimization**: Configurable threading and resource management for optimal throughput.
- **Sample Generation**: AI-powered test data generation for all message types.
- **Enhanced Validation**: Dedicated validation endpoints for MT and MX messages.
- **OpenAPI Documentation**: Auto-generated API documentation with Swagger UI.
- **Dual-Engine Architecture**: Optimized forward and reverse transformation engines.

## Security & Compliance

We built Reframe with the stringent requirements of financial institutions in mind.

- **Secure by Design**: Follows security best practices from the ground up.
- **Compliance-Ready**: Architected to support environments requiring PCI, SOX, and Basel III compliance.
- **Full Audit Trail**: Provides complete logging and traceability for every transformation.
- **Proactive Security**: We actively monitor for vulnerabilities and provide regular security updates.

## License

Reframe is licensed under the Apache License, Version 2.0. You are free to use, modify, and distribute it. See [LICENSE](LICENSE) for more details.

---

**Built by Plasmatic**  
Making financial messaging transparent, fast, and reliable.
