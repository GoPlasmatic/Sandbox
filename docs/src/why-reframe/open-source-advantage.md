# The Open Source Advantage

Why financial institutions are choosing open source for ISO 20022 transformation.

## The Challenge with Proprietary Solutions

Traditional SWIFT MT to ISO 20022 transformation solutions share common limitations:

- **Black-box logic**: Transformation rules hidden in compiled code
- **Vendor lock-in**: Difficult to switch providers or customize behavior
- **Expensive licensing**: Per-message fees or costly annual licenses
- **Slow updates**: Waiting for vendors to support new standards
- **Limited auditability**: Cannot verify transformation correctness

## How Reframe is Different

### 100% Transparent Rules

Every transformation rule in Reframe is defined in human-readable JSON:

```json
{
  "path": "data.output.CdtTrfTxInf.PmtId.InstrId",
  "logic": {"var": "data.SwiftMT.fields.20.transaction_reference"}
}
```

You can inspect, audit, and modify any rule. No hidden logic, no surprises.

### Full Auditability

For regulated financial institutions, auditability is essential:

- **Complete rule visibility**: Review every field mapping and business rule
- **Version control**: Track changes to transformation rules in Git
- **Compliance documentation**: Generate rule documentation for auditors
- **Testing transparency**: Understand exactly why a transformation produces its output

### Cost Efficiency

| Cost Factor | Proprietary | Reframe |
|-------------|-------------|---------|
| License fees | $50K-500K/year | Free (Apache 2.0) |
| Per-message fees | $0.01-0.10/message | None |
| Customization | Vendor rates ($200-400/hr) | In-house or community |
| Support | Mandatory contracts | Optional, community available |

### Control Over Your Infrastructure

With Reframe, you own your transformation infrastructure:

- **Self-hosted**: Run on your infrastructure, your cloud, your rules
- **No external dependencies**: No calls to vendor APIs during transformation
- **Data sovereignty**: Messages never leave your environment
- **Customization**: Modify rules to match your specific business requirements

## Community and Ecosystem

Reframe is part of a growing ecosystem:

- **Active development**: Regular updates and improvements
- **Community support**: GitHub issues, discussions, and contributions
- **Ecosystem libraries**: Datalogic, Dataflow, Datafake all open source
- **Enterprise support**: Available for organizations that need it

## Migration Path

Moving from proprietary solutions to Reframe:

1. **Evaluate**: Run Reframe alongside your current solution
2. **Compare**: Verify transformation outputs match expectations
3. **Customize**: Adjust rules for your specific requirements
4. **Migrate**: Gradually shift traffic to Reframe
5. **Optimize**: Fine-tune performance and add custom features

## Real-World Benefits

### For Development Teams
- Debug transformation issues by reading the rules
- Extend functionality without vendor involvement
- Test edge cases with full visibility into logic

### For Compliance Teams
- Document transformation logic for regulators
- Verify SR2025 compliance in detail
- Audit trail of all rule changes

### For Operations Teams
- Hot-reload configuration without downtime
- Monitor transformation performance
- Scale horizontally as needed

---

**[Learn About the Architecture →](./architecture-overview.md)**

**[See Real Use Cases →](./use-cases.md)**
