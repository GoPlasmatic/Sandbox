# Use Cases

Real-world applications of Reframe for message transformation.

Reframe's package-based architecture supports any message format. Below are common use cases, including the free SWIFT CBPR+ package for ISO 20022 transformations.

## Bank Modernization

### MT to ISO 20022 Migration

Financial institutions worldwide are migrating from SWIFT MT to ISO 20022. Reframe enables:

**Challenge**: Banks need to convert existing MT-based systems to support ISO 20022 while maintaining backward compatibility.

**Solution with Reframe**:
- Run Reframe alongside existing systems during transition
- Convert outgoing MT messages to ISO 20022 for SWIFT
- Convert incoming ISO 20022 to MT for legacy systems
- Gradually migrate internal systems while maintaining interoperability

```
Legacy Core Banking          Reframe              SWIFT Network
      (MT)                                         (ISO 20022)
        │                                               │
        │    MT103                                      │
        ├─────────────────▶ Transform ─────────────────▶│
        │                    to MX                pacs.008
        │                                               │
        │    MT103                                      │
        ◀─────────────────◀ Transform ◀─────────────────┤
        │                    to MT                pacs.008
```

### Phased Migration Benefits
- **No big bang**: Migrate message types incrementally
- **Fallback ready**: Keep MT capability while building MX
- **Testing**: Compare outputs side-by-side
- **Timeline control**: Move at your own pace

---

## Payment Hub Integration

### Central Transformation Service

Large organizations with multiple payment channels benefit from centralized transformation:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Channel 1  │    │  Channel 2  │    │  Channel 3  │
│  (Legacy)   │    │  (Modern)   │    │  (Partner)  │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       │     MT103        │    pacs.008      │    Mixed
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                    ┌─────▼─────┐
                    │  Reframe  │
                    │  Hub      │
                    └─────┬─────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
              ▼           ▼           ▼
         To SWIFT    To Partner   To Archive
         (pacs.008)  (MT103)      (Both)
```

**Benefits**:
- Single transformation engine for all channels
- Consistent mapping across the organization
- Centralized rule management and updates
- Unified logging and monitoring

---

## Testing and Certification

### Test Message Generation

Reframe generates valid test messages for any supported type:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"message_type": "MT103", "scenario": "standard"}'
```

**Use cases**:
- **Integration testing**: Generate realistic messages for system testing
- **Certification**: Create messages for SWIFT certification programs
- **Development**: Provide developers with valid sample messages
- **Training**: Generate examples for training materials

### Transformation Testing

Verify transformations before production:

```bash
# Transform and validate
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{
    "message": "<MT103 content>",
    "validation": true,
    "debug": true
  }'
```

The debug mode shows:
- Each rule that was applied
- Intermediate values during transformation
- Validation results at each step

---

## Regulatory Compliance

### SR2025 Compliance

SWIFT's Standards Release 2025 mandates ISO 20022 for cross-border payments. Reframe provides:

- **Full SR2025 support**: All required message types and fields
- **CBPR+ compliance**: Cross-Border Payments and Reporting guidelines
- **Audit trail**: Complete logging of all transformations
- **Rule documentation**: Export rules for compliance review

### Compliance Documentation

Generate compliance documentation from rules:

```json
// Example rule with documentation
{
  "path": "data.output.CdtTrfTxInf.ChrgBr",
  "logic": {
    "if": [
      {"==": [{"var": "data.SwiftMT.fields.71A.details_of_charges"}, "SHA"]},
      "SHAR",
      {"if": [
        {"==": [{"var": "data.SwiftMT.fields.71A.details_of_charges"}, "OUR"]},
        "DEBT",
        "CRED"
      ]}
    ]
  },
  "documentation": {
    "source": "MT Tag 71A Details of Charges",
    "target": "ChargeBearerType1Code",
    "rule": "SHA→SHAR, OUR→DEBT, BEN→CRED",
    "reference": "CBPR+ Usage Guidelines 4.2.1"
  }
}
```

---

## Message Validation

### Pre-transformation Validation

Validate messages before processing:

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "message": "<message content>",
    "business_validation": true
  }'
```

**Validation checks**:
- Format compliance (MT structure, XML schema)
- Field content rules (BIC format, amount precision)
- Business rules (valid currency pairs, date ranges)
- Network validation rules (SWIFT-specific)

### Validation Use Cases

- **Gateway validation**: Reject invalid messages before processing
- **Quality assurance**: Ensure message quality across channels
- **Debugging**: Identify specific validation failures
- **Monitoring**: Track validation failure patterns

---

## Multi-Market Support

### Regional Customization

Different markets may require rule variations:

```
┌─────────────────────────────────────────────────┐
│                 Reframe Engine                  │
└─────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   ┌─────────┐    ┌─────────┐    ┌─────────┐
   │  CBPR+  │    │  SEPA   │    │ Target2 │
   │ Package │    │ Package │    │ Package │
   └─────────┘    └─────────┘    └─────────┘
```

**Benefits**:
- Share common rules across markets
- Customize specific mappings per region
- Hot-swap packages for different contexts
- Maintain market-specific compliance

---

## Development and DevOps

Integrate Reframe into your development pipeline with Docker and standard CI/CD tools. Use the GitHub Container Registry image in your workflows:

```yaml
# GitHub Actions example
services:
  reframe:
    image: plasmatic/reframe:latest
    ports:
      - 3000:3000
```

For full deployment configurations, see **[Kubernetes Deployment →](../deployment/kubernetes.md)**

---

## Beyond SWIFT: Custom Packages

Reframe is not limited to SWIFT messaging. Create packages for any transformation need:

### FIX Protocol Transformation

Convert between FIX and other formats:

```
FIX 4.4 Message          Reframe              Internal Format
      │                                               │
      │    NewOrderSingle                             │
      ├─────────────────▶ Transform ─────────────────▶│
      │                                         JSON/XML
```

### Proprietary Format Migration

Organizations with legacy proprietary formats can:
- Create packages to transform to industry standards
- Maintain both old and new formats during migration
- Validate against custom business rules

### Multi-Format Hub

A single Reframe instance can load multiple packages:

```
┌─────────────────────────────────────────────────────┐
│                   Reframe Engine                    │
├─────────────────────────────────────────────────────┤
│                   Loaded Packages                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │  CBPR+   │  │   FIX    │  │ Custom Format A  │   │
│  │  MT↔MX   │  │  4.4↔5.0 │  │   Legacy→XML     │   │
│  └──────────┘  └──────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Building Custom Packages

See the [Packages and Rules](../concepts/packages-and-rules.md) guide for creating your own transformation packages.

---

**[Get Started →](../getting-started/quick-start.md)**

**[Explore the API →](../api-reference/overview.md)**
