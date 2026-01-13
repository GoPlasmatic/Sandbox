# Message Types Reference

Complete list of supported SWIFT MT and ISO 20022 message types.

## SWIFT MT Messages

### Customer Payments (MT1xx)

| Type | Name | Description |
|------|------|-------------|
| MT101 | Request for Transfer | Customer request for multiple transfers |
| MT103 | Single Customer Credit Transfer | Individual payment instruction |
| MT104 | Direct Debit | Direct debit instruction |
| MT107 | General Direct Debit | General direct debit message |

### Cheques (MT1xx)

| Type | Name | Description |
|------|------|-------------|
| MT110 | Advice of Cheque(s) | Notification of cheque collection |
| MT111 | Stop Payment of a Cheque | Request to stop cheque payment |
| MT112 | Status of Request for Stop Payment | Response to stop payment request |

### Cancellation & Investigation (MT19x/MT29x)

| Type | Name | Description |
|------|------|-------------|
| MT192 | Request for Cancellation | Customer payment cancellation request |
| MT196 | Answers | Response to customer inquiries |
| MT199 | Free Format Message | General purpose customer message |
| MT292 | Request for Cancellation | FI payment cancellation request |
| MT296 | Answers | Response to FI inquiries |
| MT299 | Free Format Message for FIs | General purpose FI message |

### Financial Institution Transfers (MT2xx)

| Type | Name | Description |
|------|------|-------------|
| MT200 | Financial Institution Transfer for Own Account | Transfer for bank's own account |
| MT202 | General Financial Institution Transfer | FI-to-FI transfer |
| MT202COV | Cover Payment | Cover for underlying customer payment |
| MT204 | Direct Debit | Financial institution direct debit |
| MT205 | Financial Institution Transfer Execution | Serial FI transfer |
| MT205COV | Serial Cover Payment | Cover for serial transfers |
| MT210 | Notice to Receive | Notification of incoming payment |

### Account Statements & Notifications (MT9xx)

| Type | Name | Description |
|------|------|-------------|
| MT900 | Confirmation of Debit | Debit confirmation to account owner |
| MT910 | Confirmation of Credit | Credit confirmation to account owner |
| MT920 | Request Message | Account statement request |
| MT935 | Rate Change Advice | Interest rate change notification |
| MT940 | Customer Statement | End-of-day account statement |
| MT941 | Balance Report | Account balance report |
| MT942 | Interim Transaction Report | Intraday transaction report |
| MT950 | Statement Message | FI account statement |

---

## ISO 20022 Messages

### Payments Clearing & Settlement (pacs)

| Type | Name | Description |
|------|------|-------------|
| pacs.002 | FIToFI Payment Status Report | Payment status notification |
| pacs.003 | FIToFI Customer Direct Debit | Direct debit instruction |
| pacs.004 | Payment Return | Return of a payment |
| pacs.008 | FIToFI Customer Credit Transfer | Customer payment instruction |
| pacs.009 | Financial Institution Credit Transfer | FI-to-FI transfer |
| pacs.010 | Financial Institution Direct Debit | FI direct debit |

### Payment Initiation (pain)

| Type | Name | Description |
|------|------|-------------|
| pain.001 | Customer Credit Transfer Initiation | Customer payment request |
| pain.008 | Customer Direct Debit Initiation | Direct debit request |

### Cash Management (camt)

| Type | Name | Description |
|------|------|-------------|
| camt.025 | Receipt | Acknowledgment of receipt |
| camt.029 | Resolution of Investigation | Investigation response |
| camt.052 | Bank to Customer Account Report | Intraday account report |
| camt.053 | Bank to Customer Statement | End-of-day statement |
| camt.054 | Bank to Customer Debit/Credit Notification | Transaction notification |
| camt.056 | FIToFI Payment Cancellation Request | Payment cancellation |
| camt.057 | Notification to Account Owner | Account owner notification |
| camt.058 | Notification to Receive Cancellation | Cancel notification to receive |
| camt.060 | Account Reporting Request | Statement request |
| camt.105 | Charges Payment Notification | Charges notification |
| camt.106 | Request for Payment of Charges | Charges request |
| camt.107 | Cheque Presentment Notification | Cheque notification |
| camt.108 | Cheque Cancellation or Stop Request | Stop cheque |
| camt.109 | Cheque Cancellation or Stop Report | Stop cheque response |

### Administration (admi)

| Type | Name | Description |
|------|------|-------------|
| admi.024 | System Event Notification | System event message |
