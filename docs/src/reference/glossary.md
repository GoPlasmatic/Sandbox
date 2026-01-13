# Glossary

Key terms used in ISO 20022, SWIFT, and CBPR+ messaging.

## ISO 20022 Terms

### Business Application Header (BAH)
The header element in ISO 20022 messages containing routing and processing information. Includes sender/receiver BICs, message definition identifier, and creation timestamp.

### Document
The root element of an ISO 20022 message containing the business payload. Each message type has a specific document structure defined by its XML schema.

### Message Definition Identifier
A unique identifier for an ISO 20022 message type, following the pattern `area.type.variant.version` (e.g., `pacs.008.001.12`).

### Message Type
A standardized ISO 20022 message format. Common types include:
- **pacs** - Payments Clearing and Settlement
- **camt** - Cash Management
- **pain** - Payment Initiation

### Schema
The XML Schema Definition (XSD) that defines the structure and validation rules for an ISO 20022 message.

### Supplementary Data
Optional extension elements in ISO 20022 messages for carrying additional information not covered by the standard schema.

---

## SWIFT Terms

### Application Header
The second block of a SWIFT MT message containing message type, sender/receiver information, and processing details.

### Basic Header
The first block of a SWIFT MT message identifying the application, service, and session information.

### BIC (Bank Identifier Code)
An 8 or 11 character code that uniquely identifies a financial institution. Also known as SWIFT code.

### Field Tag
A two or three character identifier for a data field in SWIFT MT messages (e.g., Tag 20, Tag 32A, Tag 50K).

### FIN (Financial Information Network)
SWIFT's messaging service for financial transaction messages using the MT format.

### MT Message
SWIFT Message Type - the legacy text-based format for financial messages (e.g., MT103, MT202).

### MX Message
SWIFT's XML-based message format aligned with ISO 20022 standards.

### Trailer Block
The fifth block of a SWIFT MT message containing message authentication and checksum information.

### User Header
The third block of a SWIFT MT message containing optional banking priority and delivery information.

---

## CBPR+ Terms

### CBPR+ (Cross-Border Payments and Reporting Plus)
SWIFT's guidelines for implementing ISO 20022 messages in cross-border payments, ensuring interoperability between financial institutions.

### Coexistence Period
The transition period (2023-2025) during which both MT and MX message formats are supported for cross-border payments.

### Market Practice
Agreed conventions for using ISO 20022 messages in specific contexts, ensuring consistent implementation across institutions.

### SR2025 (Standards Release 2025)
SWIFT's annual standards release for 2025, marking the end of the coexistence period and full transition to ISO 20022.

### Translation Rules
The mapping specifications that define how MT message fields correspond to ISO 20022 elements and vice versa.

### Usage Guidelines
CBPR+ documentation specifying how ISO 20022 messages should be structured and populated for cross-border payments.

---

## Payment Terms

### Charge Bearer
Indicates which party pays the transaction charges:
- **SHA (Shared)** - Charges shared between parties
- **OUR** - Sender pays all charges
- **BEN** - Beneficiary pays all charges

### Clearing System
The infrastructure for settling payments between financial institutions (e.g., CHIPS, Fedwire, TARGET2).

### Credit Transfer
A payment instruction to move funds from debtor to creditor account.

### Debtor
The party whose account is debited in a payment transaction (payer/sender).

### Creditor
The party whose account is credited in a payment transaction (payee/beneficiary).

### Instructing Agent
The financial institution instructing the next party in the payment chain.

### Instructed Agent
The financial institution receiving the payment instruction.

### Interbank Settlement Amount
The amount being transferred between financial institutions, excluding charges.

### Interbank Settlement Date
The date on which the settlement between banks occurs.

### Service Level
Indicates the type of processing for a payment:
- **G001** - SWIFT gpi (tracked payments)
- **G002** - SWIFT gpi for cover payments
- **G003** - SWIFT gpi for financial institution transfers
- **G004** - SWIFT gpi for direct debits

### Settlement Method
How the payment is settled between banks:
- **INDA** - Instructed Agent account
- **INGA** - Instructing Agent account
- **COVE** - Cover method
- **CLRG** - Clearing system

### UETR (Unique End-to-End Transaction Reference)
A UUID that uniquely identifies a payment throughout its lifecycle, used for gpi tracking.

---

## Technical Terms

### Dataflow
Reframe's workflow orchestration engine that manages transformation pipelines.

### Datalogic
Reframe's JSONLogic implementation for evaluating business rules during transformation.

### Datafake
Reframe's test data generation library for creating sample messages.

### Hot Reload
The ability to update transformation rules at runtime without restarting the service.

### JSONLogic
A standard for expressing business logic as JSON, enabling portable and auditable rules.

### Package
A collection of workflows and rules that define transformations for a specific message standard (e.g., CBPR+).

### Pipeline
The sequence of processing stages a message passes through during transformation.

### Workflow
A named set of tasks that execute in priority order during message processing.

---

## Identifiers

### IBAN (International Bank Account Number)
A standardized international account number format for identifying bank accounts.

### LEI (Legal Entity Identifier)
A 20-character alphanumeric code that uniquely identifies legal entities in financial transactions.

### MCC (Merchant Category Code)
A four-digit code classifying the type of business or merchant.

### National ID
A country-specific identifier for organizations or individuals.

---

## Message Categories

### Customer Payments (MT1xx / pacs.008)
Messages for customer credit transfers initiated by corporate customers.

### Financial Institution Transfers (MT2xx / pacs.009)
Messages for bank-to-bank transfers not involving customer accounts.

### Cash Management (MT9xx / camt.xxx)
Messages for account statements, balance reports, and cash position management.

### Securities (MT5xx)
Messages for securities trading, settlement, and custody operations.

---

**[Message Types Reference →](./message-types.md)**

**[Error Codes Reference →](./error-codes.md)**
