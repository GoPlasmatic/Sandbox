# Frequently Asked Questions

Common questions about Reframe, the open source SWIFT MT to ISO 20022 transformation engine.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Reframe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Reframe is an open source transformation engine for converting financial messages between formats. It specializes in SWIFT MT to ISO 20022 conversion using auditable JSONLogic rules. Built in Rust for high performance, it can process thousands of messages per second with sub-millisecond latency."
      }
    },
    {
      "@type": "Question",
      "name": "Is Reframe free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Reframe is completely free and open source under the Apache 2.0 license. This includes the core engine and the CBPR+ transformation package with 41+ scenarios for SWIFT MT to ISO 20022 conversion."
      }
    },
    {
      "@type": "Question",
      "name": "What is CBPR+ and does Reframe support it?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CBPR+ (Cross-Border Payments and Reporting Plus) is SWIFT's framework for migrating from MT messages to ISO 20022. Reframe includes a free CBPR+ package that supports 41+ transformation scenarios including MT103 to pacs.008, MT202 to pacs.009, and MT940 to camt.053."
      }
    },
    {
      "@type": "Question",
      "name": "Is Reframe SR2025 compliant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, the CBPR+ package is fully compliant with SWIFT Standards Release 2025 (SR2025), which becomes mandatory in November 2025. It supports Business Application Header v3, UETR, enhanced party identification with LEI, and the latest message versions."
      }
    },
    {
      "@type": "Question",
      "name": "What message types does Reframe support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Reframe supports SWIFT MT messages (MT103, MT202, MT940, etc.) and ISO 20022 messages (pacs.008, pacs.009, camt.053, etc.). The engine is extensible, so custom packages can be created for proprietary formats."
      }
    },
    {
      "@type": "Question",
      "name": "How do I get started with Reframe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can get started in under 5 minutes using Docker. Simply run 'docker run -p 3000:3000 plasmatic/reframe:latest' and access the API at http://localhost:3000. See the Quick Start guide for detailed instructions."
      }
    },
    {
      "@type": "Question",
      "name": "What makes Reframe different from other transformation tools?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Reframe uses externalized JSONLogic rules that are fully auditable and transparent. Unlike black-box solutions, you can inspect, modify, and extend any transformation logic. It's also built in Rust for sub-millisecond performance and supports hot-reload for updating rules without downtime."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use Reframe in production?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Reframe is production-ready with features like health checks, monitoring endpoints, Kubernetes deployment support, and hot-reload capability for zero-downtime rule updates. It processes thousands of messages per second with sub-millisecond latency."
      }
    }
  ]
}
</script>

---

## What is Reframe?

Reframe is an **open source transformation engine** for converting financial messages between formats. It specializes in SWIFT MT to ISO 20022 conversion using auditable JSONLogic rules.

**Key features:**
- High-performance Rust engine with sub-millisecond latency
- Transparent, auditable transformation rules
- Free CBPR+ package with 41+ scenarios
- Apache 2.0 licensed

**[Learn more about the architecture →](./why-reframe/architecture-overview.md)**

---

## Is Reframe free to use?

**Yes, Reframe is completely free** and open source under the Apache 2.0 license. This includes:

- The core Reframe transformation engine
- The CBPR+ package with 41+ transformation scenarios
- All documentation and examples

There are no licensing fees, usage limits, or hidden costs.

**[View the license on GitHub →](https://github.com/GoPlasmatic/Reframe/blob/main/LICENSE)**

---

## What is CBPR+ and does Reframe support it?

**CBPR+** (Cross-Border Payments and Reporting Plus) is SWIFT's framework for migrating from MT messages to ISO 20022.

Reframe includes a **free CBPR+ package** that supports:

| Transformation | Description |
|----------------|-------------|
| MT103 → pacs.008 | Customer credit transfers |
| MT202 → pacs.009 | FI credit transfers |
| MT940 → camt.053 | Account statements |
| + 38 more scenarios | Returns, cancellations, status |

**[Explore the CBPR+ Package →](./cbpr-plus/overview.md)**

---

## Is Reframe SR2025 compliant?

**Yes**, the CBPR+ package is fully compliant with **SWIFT Standards Release 2025** (SR2025), which becomes mandatory in November 2025.

SR2025 features supported:
- Business Application Header v3
- UETR (Unique End-to-End Transaction Reference)
- Enhanced party identification with LEI
- Structured remittance information
- Latest message versions (pacs.008.001.12, etc.)

**[Learn about SR2025 compliance →](./cbpr-plus/sr2025-compliance.md)**

---

## What message types does Reframe support?

### SWIFT MT Messages
MT101, MT103, MT104, MT107, MT110, MT111, MT112, MT192, MT196, MT199, MT202, MT205, MT210, MT292, MT296, MT299, MT900, MT910, MT920, MT935, MT940, MT941, MT942, MT950

### ISO 20022 Messages
pacs.002, pacs.003, pacs.008, pacs.009, pain.001, pain.008, camt.025, camt.029, camt.052, camt.053, camt.054, camt.056, camt.057, camt.060

**[View the complete message catalog →](./cbpr-plus/message-catalog.md)**

---

## How do I get started with Reframe?

Get started in **under 5 minutes** using Docker:

```bash
# Pull and run Reframe
docker run -d -p 3000:3000 plasmatic/reframe:latest

# Test the API
curl http://localhost:3000/health
```

Or try the interactive playground without any installation:

**[Try the Playground →](./playground/index.md)**

**[Read the Quick Start Guide →](./getting-started/quick-start.md)**

---

## What makes Reframe different from other transformation tools?

| Feature | Reframe | Proprietary Solutions |
|---------|---------|----------------------|
| **Rules** | Auditable JSONLogic | Black-box logic |
| **License** | Apache 2.0 (Free) | Expensive licensing |
| **Performance** | Sub-millisecond (Rust) | Slower (JVM) |
| **Updates** | Hot-reload rules | Vendor intervention |
| **Customization** | Full access to rules | Limited or none |

**[Learn about the open source advantage →](./why-reframe/open-source-advantage.md)**

---

## Can I use Reframe in production?

**Yes**, Reframe is production-ready with:

- **Health checks** - Monitor service status
- **Hot-reload** - Update rules without downtime
- **Kubernetes support** - Enterprise deployment
- **High performance** - Thousands of messages/second
- **Audit trails** - Full transformation logging

**[Deployment guide →](./deployment/kubernetes.md)**

---

## Where can I get help?

- **Documentation**: You're reading it!
- **GitHub Issues**: [Report bugs or request features](https://github.com/GoPlasmatic/Reframe/issues)
- **GitHub Discussions**: [Ask questions](https://github.com/GoPlasmatic/Reframe/discussions)

---

## Related Resources

- **[Quick Start Guide](./getting-started/quick-start.md)** - Get running in 5 minutes
- **[Interactive Playground](./playground/index.md)** - Try transformations online
- **[API Reference](./api-reference/overview.md)** - Complete API documentation
- **[CBPR+ Package Guide](./cbpr-plus/overview.md)** - SWIFT MT ↔ ISO 20022
