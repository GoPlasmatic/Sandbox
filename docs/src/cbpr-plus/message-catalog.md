# Message Catalog

Complete list of message types supported by the Reframe CBPR+ package.

## Outgoing Transformations (MT → ISO 20022)

### Customer Payments

| MT Type | ISO 20022 | Description |
|---------|-----------|-------------|
| MT101 | pain.001 | Request for Transfer |
| MT103 | pacs.008 | Single Customer Credit Transfer |
| MT103 STP | pacs.008 | Straight-Through Processing variant |
| MT103 REJT | pacs.002 | Payment Rejection |
| MT103 RETN | pacs.004 | Payment Return |

### Financial Institution Transfers

| MT Type | ISO 20022 | Description |
|---------|-----------|-------------|
| MT200 | pacs.009 | Financial Institution Transfer (Own Account) |
| MT202 | pacs.009 | Financial Institution Transfer |
| MT202 COV | pacs.009 | Cover Payment |
| MT202 REJT | pacs.002 | FI Transfer Rejection |
| MT202 RETN | pacs.004 | FI Transfer Return |
| MT205 | pacs.009 | Financial Institution Transfer (Third Party) |
| MT205 COV | pacs.009 | Cover Payment (Third Party) |
| MT205 REJT | pacs.002 | FI Transfer Rejection |
| MT205 RETN | pacs.004 | FI Transfer Return |

### Cancellation & Investigation

| MT Type | ISO 20022 | Description |
|---------|-----------|-------------|
| MT192 | camt.056 | Request for Cancellation (Customer) |
| MT196 | camt.029 | Answer to Cancellation Request |
| MT292 | camt.056 | Request for Cancellation (FI) |
| MT296 | camt.029 | Answer to Cancellation Request (FI) |

### Cash Management

| MT Type | ISO 20022 | Description |
|---------|-----------|-------------|
| MT900 | camt.054 | Confirmation of Debit |
| MT910 | camt.054 | Confirmation of Credit |
| MT940 | camt.053 | Customer Statement |
| MT941 | camt.052 | Balance Report |
| MT942 | camt.052 | Interim Transaction Report |

## Incoming Transformations (ISO 20022 → MT)

### Payment Messages

| ISO 20022 | MT Type | Description |
|-----------|---------|-------------|
| pain.001 | MT101 | CustomerCreditTransferInitiation |
| pacs.002 | MT103 REJT / MT202 REJT | FIToFIPaymentStatusReport |
| pacs.003 | MT104 | FIToFICustomerDirectDebit |
| pacs.004 | MT103 RETN / MT202 RETN | PaymentReturn |
| pacs.008 | MT103 | FIToFICustomerCreditTransfer |
| pacs.009 | MT202 / MT202 COV / MT205 | FIToFIFinancialInstitutionCreditTransfer |
| pacs.010 | MT204 | FIToFIDirectDebit |

### Cash Management Messages

| ISO 20022 | MT Type | Description |
|-----------|---------|-------------|
| camt.029 | MT196 / MT296 | ResolutionOfInvestigation |
| camt.052 | MT942 / MT941 | BankToCustomerAccountReport |
| camt.053 | MT940 | BankToCustomerStatement |
| camt.054 | MT900 / MT910 / MT103 / MT202 | BankToCustomerDebitCreditNotification |
| camt.056 | MT192 / MT292 | FIToFIPaymentCancellationRequest |
| camt.057 | MT210 | NotificationToReceive |
| camt.058 | Notification | NotificationToReceiveCancellationAdvice |

### SR2025 New Messages

| ISO 20022 | MT Type | Description |
|-----------|---------|-------------|
| camt.105 | MTn90 | ChargesPaymentNotification |
| camt.106 | MTn91 | ChargesPaymentRequest |
| camt.107 | MT110 | ChequePresentation |
| camt.108 | MT111 | ChequeCancellationOrStopRequest |
| camt.109 | MT112 | ChequeCancellationOrStopReport |
| admi.024 | MT199 | SystemEventNotification |

## Message Type Details

### pacs.008 - FIToFICustomerCreditTransfer

The core message for customer credit transfers.

**Used for:**
- Single customer payments
- Cross-border transfers
- Domestic high-value payments

**Key elements:**
- Group Header (GrpHdr)
- Credit Transfer Transaction Information (CdtTrfTxInf)
- Payment Identification
- Interbank Settlement Amount
- Debtor/Creditor Information
- Agent Chain

### pacs.009 - FIToFIFinancialInstitutionCreditTransfer

Bank-to-bank transfers for treasury operations.

**Used for:**
- Bank treasury movements
- Cover payments
- Nostro/Vostro movements

**Key elements:**
- Group Header
- Credit Transfer Transaction Information
- Underlying Customer Credit Transfer (for covers)

### camt.056 - FIToFIPaymentCancellationRequest

Request to cancel a previously sent payment.

**Used for:**
- Duplicate payment recall
- Fraudulent payment recall
- Technical error correction

**Key elements:**
- Assignment information
- Original message details
- Cancellation reason

## Version Support

The CBPR+ package supports the latest ISO 20022 message versions:

| Message | Version |
|---------|---------|
| head.001 | 001.03 |
| pacs.002 | 001.14 |
| pacs.004 | 001.13 |
| pacs.008 | 001.12 |
| pacs.009 | 001.11 |
| camt.029 | 001.13 |
| camt.052 | 001.12 |
| camt.053 | 001.12 |
| camt.054 | 001.12 |
| camt.056 | 001.12 |

---

**[MT → ISO 20022 Details →](./mt-to-iso20022/overview.md)**

**[ISO 20022 → MT Details →](./iso20022-to-mt/overview.md)**
