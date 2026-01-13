# SWIFT MT Sample Generator

Generate CBPR+ compliant SWIFT MT messages for testing and development. Select a message type and scenario to create realistic test data that follows SWIFT standards.

<div class="reframe-playground" data-tab="generate"></div>

## How It Works

Each message type (MT103, MT202, etc.) has predefined scenarios representing real-world use cases. When you select a message type and scenario, the generator:

1. Loads the corresponding scenario configuration
2. Applies business rules and field mappings
3. Generates appropriate test data for variable fields
4. Validates the message structure against CBPR+ standards
5. Returns a fully-formed, compliant SWIFT MT message

## Supported Message Types

### Customer Payments
- **MT101** - Request for Transfer
- **MT103** - Single Customer Credit Transfer
- **MT104** - Direct Debit and Request for Debit Transfer
- **MT107** - General Direct Debit Message

### Cheques
- **MT110** - Advice of Cheque(s)
- **MT111** - Stop Payment of a Cheque
- **MT112** - Status of Request for Stop Payment

### Cancellation & Answers
- **MT192** - Request for Cancellation
- **MT196** - Answers
- **MT199** - Free Format Message
- **MT292** - Request for Cancellation
- **MT296** - Answers
- **MT299** - Free Format Message for Financial Institutions

### Financial Institution Transfers
- **MT202** - General Financial Institution Transfer
- **MT205** - Financial Institution Transfer Execution
- **MT210** - Notice to Receive

### Account Statements & Notifications
- **MT900** - Confirmation of Debit
- **MT910** - Confirmation of Credit
- **MT920** - Request Message
- **MT935** - Rate Change Advice
- **MT940** - Customer Statement Message
- **MT941** - Balance Report
- **MT942** - Interim Transaction Report
- **MT950** - Statement Message

---

## Next Steps

- [Validate your SWIFT MT message](../validation/swift-mt.md) - Check against SWIFT standards and CBPR+ requirements
- [Transform MT to ISO 20022](../transformation/mt-to-iso20022.md) - Convert to ISO 20022 format
