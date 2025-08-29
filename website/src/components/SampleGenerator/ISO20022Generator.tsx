import React, { useState, useEffect } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { API_ENDPOINTS } from '../../config/api';
import { 
  getReframeScenarios,
  type MessageTypeOption,
  type DropdownOption
} from '../../utils/dropdownData';
import {
  containerStyle,
  cardContainerStyle,
  sectionHeaderStyle,
  formGridStyle,
  labelStyle,
  selectStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  resultContainerStyle,
  emptyStateStyle,
  apiDetailsSummaryStyle,
  headerWithActionsStyle,
  hoverEffects,
  disabledButtonStyle,
  iconStyle,
} from '../../styles/componentStyles';

// Function to format/beautify XML
const formatXML = (xml: string): string => {
  try {
    // Remove any existing formatting
    xml = xml.replace(/>\s*</g, '><').trim();
    
    let formatted = '';
    let indent = 0;
    const tab = '  '; // 2 spaces for indentation
    
    // Split the XML into tokens
    const tokens = xml.split(/(<[^>]+>)/g).filter(token => token.length > 0);
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      // Skip empty tokens
      if (!token || token.trim() === '') continue;
      
      // Check if token is an XML tag
      if (token.startsWith('<')) {
        // Closing tag
        if (token.startsWith('</')) {
          indent--;
          // Check if previous token was text content
          const prevToken = i > 0 ? tokens[i - 1] : '';
          if (prevToken && !prevToken.startsWith('<')) {
            // Previous was text content, don't add indentation
            formatted += token;
          } else {
            // Previous was a tag, add indentation
            formatted += tab.repeat(Math.max(0, indent)) + token;
          }
          if (i < tokens.length - 1 && !tokens[i + 1].startsWith('<')) {
            // Don't add newline if next token is text content
          } else {
            formatted += '\n';
          }
        }
        // Self-closing tag
        else if (token.endsWith('/>') || token.includes('<?xml')) {
          formatted += tab.repeat(Math.max(0, indent)) + token + '\n';
        }
        // Opening tag
        else {
          formatted += tab.repeat(Math.max(0, indent)) + token;
          if (i < tokens.length - 1 && !tokens[i + 1].startsWith('<')) {
            // Don't add newline if next token is text content
          } else {
            formatted += '\n';
          }
          if (!token.includes('<?xml')) {
            indent++;
          }
        }
      }
      // Text content
      else {
        // Just add the text content as-is, no modifications
        formatted += token;
      }
    }
    
    return formatted;
  } catch (e) {
    console.error('Error formatting XML:', e);
    return xml; // Return original if formatting fails
  }
};

const ISO20022Generator: React.FC = () => {
  const [scenario, setScenario] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [apiRequest, setApiRequest] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scenarios, setScenarios] = useState<any[]>([]);

  // Get API base URL from Docusaurus config
  const { siteConfig } = useDocusaurusContext();
  const API_BASE_URL = (siteConfig.customFields?.REFRAME_API_URL as string) || 'http://localhost:3000';
  
  // Load scenarios on component mount (reverse transformations for ISO 20022)
  useEffect(() => {
    const loadScenarios = async () => {
      // Load reverse transformation scenarios (MX source messages)
      const scenarioList = await getReframeScenarios('reverse');
      setScenarios(scenarioList);
      // Auto-select first scenario if available
      if (scenarioList.length > 0 && !scenario) {
        setScenario(scenarioList[0].value);
      }
    };
    loadScenarios();
  }, []);

  const scenariosByType: Record<string, string[]> = {
    'camt.025': ['central_bank_rate_notification', 'deposit_rate_change', 'fx_rate_update', 
                'loan_rate_adjustment', 'multi_product_rate_change'],
    'camt.029': ['answer_cancellation', 'answer_inquiry_response', 'answer_pending_investigation',
                'answer_rejection', 'cancellation_accepted', 'cancellation_rejected',
                'cbpr_cancellation_response', 'inquiry_response', 'no_payment_found',
                'partial_cancellation'],
    'camt.052': ['daily_balance_report', 'intraday_liquidity_report', 'multi_currency_balance',
                'negative_balance_report', 'real_time_position_update', 'treasury_cash_sweep'],
    'camt.053': ['correspondent_banking', 'daily_account_statement', 'high_volume_batch',
                'interim_statement_intraday', 'repeated_sequence_issues', 'simplified_statement',
                'year_end_statement'],
    'camt.054': ['basic_credit_confirmation', 'basic_debit_confirmation', 'cbpr_credit_confirmation',
                'cbpr_debit_confirmation', 'direct_debit_confirmation', 'dividend_payment',
                'fee_debit_confirmation', 'fx_transaction_debit', 'incoming_wire_transfer',
                'interest_credit', 'refund_credit', 'standing_order_debit'],
    'camt.056': ['cbpr_cancellation_request', 'compliance_hold_cancellation', 'fi_cancellation_request',
                'fraud_prevention_cancellation', 'regulatory_compliance_cancellation', 'request_cancellation',
                'system_error_cancellation', 'urgent_cancellation', 'wrong_beneficiary_cancellation'],
    'camt.057': ['expected_incoming_funds', 'fx_settlement_notice', 'securities_settlement_notice',
                'single_payment_notice'],
    'camt.060': ['interim_report_request', 'multi_account_request', 'statement_request_basic'],
    'pacs.002': ['cheque_collection_advice', 'duplicate_cheque_stop', 'foreign_cheque_collection',
                'fraud_prevention_stop', 'lost_cheque_stop', 'returned_cheque_advice',
                'single_cheque_advice', 'stop_payment_accepted', 'stop_payment_pending',
                'stop_payment_rejected'],
    'pacs.003': ['cbpr_insurance_collection', 'cbpr_subscription_collection', 'cbpr_utility_collection',
                'fi_direct_debit_basic', 'fi_direct_debit_cbpr', 'fi_direct_debit_multiple',
                'fi_direct_debit_recurring', 'fi_direct_debit_return'],
    'pacs.008': ['standard', 'minimal', 'stp', 'cbpr_stp_compliant', 'cbpr_stp_enhanced',
                'cbpr_business_payment', 'cbpr_charity_donation', 'cbpr_commission_payment',
                'cbpr_crypto_settlement', 'cbpr_dividend_distribution', 'cbpr_dividend_payment',
                'cbpr_ecommerce_b2c', 'cbpr_education_international', 'cbpr_education_payment',
                'cbpr_fees_payment', 'cbpr_gig_economy', 'cbpr_government_disbursement',
                'cbpr_healthcare_payment', 'cbpr_insurance_cross_border', 'cbpr_insurance_payment',
                'cbpr_interest_payment', 'cbpr_investment_payment', 'cbpr_loan_disbursement',
                'cbpr_pension_payment', 'cbpr_person_to_person', 'cbpr_real_estate',
                'cbpr_remittance_corridor', 'cbpr_rent_payment', 'cbpr_royalty_payment',
                'cbpr_salary_payment', 'cbpr_sanctions_failure', 'cbpr_social_security',
                'cbpr_subscription_saas', 'cbpr_supplier_payment', 'cbpr_tax_payment',
                'cbpr_trade_finance', 'cbpr_treasury_intercompany', 'cbpr_utility_cross_border',
                'cbpr_utility_payment', 'correspondent_banking', 'cover_payment', 'duplicate_uetr',
                'fx_conversion', 'high_value', 'missing_lei_entity', 'regulatory_compliant',
                'regulatory_test', 'rejection', 'remit_basic', 'remit_structured',
                'remittance_enhanced', 'return', 'treasury_payment', 'unresolved_intermediary'],
    'pacs.009': ['standard', 'bank_transfer_cover', 'bank_transfer_non_cover', 'cbpr_cov_complex_routing',
                'cbpr_cov_compliance_enhanced', 'cbpr_cov_rejection', 'cbpr_cov_return',
                'cbpr_cov_standard', 'cbpr_serial_payment', 'cov_mismatch', 'fi_to_fi_transparency',
                'minimal_return', 'regulatory_reporting', 'rejection_payment', 'return',
                'return_payment', 'return_simple', 'urgent_liquidity_transfer'],
    'pain.001': ['standard', 'minimal', 'bulk_payment', 'cbpr_corporate_bulk', 'cbpr_payroll',
                'cbpr_supplier_batch', 'multi_currency', 'salary_payment', 'scheduled_payment',
                'urgent_payment', 'vendor_payment'],
    'pain.008': ['authorized_bulk_collection', 'general_direct_debit_basic', 'return_processing',
                'unauthorized_debit_processing']
  };
  
  // Display labels for scenarios - make them more user-friendly
  const scenarioLabels: Record<string, string> = {
    // Common scenarios
    'standard': 'Standard',
    'minimal': 'Minimal',
    'stp': 'STP',
    'return': 'Return',
    
    // camt025 scenarios
    'central_bank_rate_notification': 'Central Bank Rate Notification',
    'deposit_rate_change': 'Deposit Rate Change',
    'fx_rate_update': 'FX Rate Update',
    'loan_rate_adjustment': 'Loan Rate Adjustment',
    'multi_product_rate_change': 'Multi-Product Rate Change',
    
    // camt029 scenarios
    'answer_cancellation': 'Answer Cancellation',
    'answer_inquiry_response': 'Answer Inquiry Response',
    'answer_pending_investigation': 'Answer Pending Investigation',
    'answer_rejection': 'Answer Rejection',
    'cancellation_accepted': 'Cancellation Accepted',
    'cancellation_rejected': 'Cancellation Rejected',
    'cbpr_cancellation_response': 'CBPR+ Cancellation Response',
    'inquiry_response': 'Inquiry Response',
    'no_payment_found': 'No Payment Found',
    'partial_cancellation': 'Partial Cancellation',
    
    // camt052 scenarios
    'daily_balance_report': 'Daily Balance Report',
    'intraday_liquidity_report': 'Intraday Liquidity Report',
    'multi_currency_balance': 'Multi-Currency Balance',
    'negative_balance_report': 'Negative Balance Report',
    'real_time_position_update': 'Real-Time Position Update',
    'treasury_cash_sweep': 'Treasury Cash Sweep',
    
    // camt053 scenarios
    'correspondent_banking': 'Correspondent Banking',
    'daily_account_statement': 'Daily Account Statement',
    'high_volume_batch': 'High Volume Batch',
    'interim_statement_intraday': 'Interim Statement Intraday',
    'repeated_sequence_issues': 'Repeated Sequence Issues',
    'simplified_statement': 'Simplified Statement',
    'year_end_statement': 'Year End Statement',
    
    // camt054 scenarios
    'basic_credit_confirmation': 'Basic Credit Confirmation',
    'basic_debit_confirmation': 'Basic Debit Confirmation',
    'cbpr_credit_confirmation': 'CBPR+ Credit Confirmation',
    'cbpr_debit_confirmation': 'CBPR+ Debit Confirmation',
    'direct_debit_confirmation': 'Direct Debit Confirmation',
    'dividend_payment': 'Dividend Payment',
    'fee_debit_confirmation': 'Fee Debit Confirmation',
    'fx_transaction_debit': 'FX Transaction Debit',
    'incoming_wire_transfer': 'Incoming Wire Transfer',
    'interest_credit': 'Interest Credit',
    'refund_credit': 'Refund Credit',
    'standing_order_debit': 'Standing Order Debit',
    
    // camt056 scenarios
    'cbpr_cancellation_request': 'CBPR+ Cancellation Request',
    'compliance_hold_cancellation': 'Compliance Hold Cancellation',
    'fi_cancellation_request': 'FI Cancellation Request',
    'fraud_prevention_cancellation': 'Fraud Prevention Cancellation',
    'regulatory_compliance_cancellation': 'Regulatory Compliance Cancellation',
    'request_cancellation': 'Request Cancellation',
    'system_error_cancellation': 'System Error Cancellation',
    'urgent_cancellation': 'Urgent Cancellation',
    'wrong_beneficiary_cancellation': 'Wrong Beneficiary Cancellation',
    
    // camt057 scenarios
    'expected_incoming_funds': 'Expected Incoming Funds',
    'fx_settlement_notice': 'FX Settlement Notice',
    'securities_settlement_notice': 'Securities Settlement Notice',
    'single_payment_notice': 'Single Payment Notice',
    
    // camt060 scenarios
    'interim_report_request': 'Interim Report Request',
    'multi_account_request': 'Multi-Account Request',
    'statement_request_basic': 'Statement Request Basic',
    
    // pacs002 scenarios
    'cheque_collection_advice': 'Cheque Collection Advice',
    'duplicate_cheque_stop': 'Duplicate Cheque Stop',
    'foreign_cheque_collection': 'Foreign Cheque Collection',
    'fraud_prevention_stop': 'Fraud Prevention Stop',
    'lost_cheque_stop': 'Lost Cheque Stop',
    'returned_cheque_advice': 'Returned Cheque Advice',
    'single_cheque_advice': 'Single Cheque Advice',
    'stop_payment_accepted': 'Stop Payment Accepted',
    'stop_payment_pending': 'Stop Payment Pending',
    'stop_payment_rejected': 'Stop Payment Rejected',
    
    // pacs003 scenarios
    'cbpr_insurance_collection': 'CBPR+ Insurance Collection',
    'cbpr_subscription_collection': 'CBPR+ Subscription Collection',
    'cbpr_utility_collection': 'CBPR+ Utility Collection',
    'fi_direct_debit_basic': 'FI Direct Debit Basic',
    'fi_direct_debit_cbpr': 'FI Direct Debit CBPR+',
    'fi_direct_debit_multiple': 'FI Direct Debit Multiple',
    'fi_direct_debit_recurring': 'FI Direct Debit Recurring',
    'fi_direct_debit_return': 'FI Direct Debit Return',
    
    // pacs008 scenarios (CBPR+ scenarios)
    'cbpr_stp_compliant': 'CBPR+ STP Compliant',
    'cbpr_stp_enhanced': 'CBPR+ STP Enhanced',
    'cbpr_business_payment': 'CBPR+ Business Payment',
    'cbpr_charity_donation': 'CBPR+ Charity Donation',
    'cbpr_commission_payment': 'CBPR+ Commission Payment',
    'cbpr_crypto_settlement': 'CBPR+ Crypto Settlement',
    'cbpr_dividend_distribution': 'CBPR+ Dividend Distribution',
    'cbpr_dividend_payment': 'CBPR+ Dividend Payment',
    'cbpr_ecommerce_b2c': 'CBPR+ E-commerce B2C',
    'cbpr_education_international': 'CBPR+ Education International',
    'cbpr_education_payment': 'CBPR+ Education Payment',
    'cbpr_fees_payment': 'CBPR+ Fees Payment',
    'cbpr_gig_economy': 'CBPR+ Gig Economy',
    'cbpr_government_disbursement': 'CBPR+ Government Disbursement',
    'cbpr_healthcare_payment': 'CBPR+ Healthcare Payment',
    'cbpr_insurance_cross_border': 'CBPR+ Insurance Cross-Border',
    'cbpr_insurance_payment': 'CBPR+ Insurance Payment',
    'cbpr_interest_payment': 'CBPR+ Interest Payment',
    'cbpr_investment_payment': 'CBPR+ Investment Payment',
    'cbpr_loan_disbursement': 'CBPR+ Loan Disbursement',
    'cbpr_pension_payment': 'CBPR+ Pension Payment',
    'cbpr_person_to_person': 'CBPR+ Person to Person',
    'cbpr_real_estate': 'CBPR+ Real Estate',
    'cbpr_remittance_corridor': 'CBPR+ Remittance Corridor',
    'cbpr_rent_payment': 'CBPR+ Rent Payment',
    'cbpr_royalty_payment': 'CBPR+ Royalty Payment',
    'cbpr_salary_payment': 'CBPR+ Salary Payment',
    'cbpr_sanctions_failure': 'CBPR+ Sanctions Failure',
    'cbpr_social_security': 'CBPR+ Social Security',
    'cbpr_subscription_saas': 'CBPR+ Subscription SaaS',
    'cbpr_supplier_payment': 'CBPR+ Supplier Payment',
    'cbpr_tax_payment': 'CBPR+ Tax Payment',
    'cbpr_trade_finance': 'CBPR+ Trade Finance',
    'cbpr_treasury_intercompany': 'CBPR+ Treasury Intercompany',
    'cbpr_utility_cross_border': 'CBPR+ Utility Cross-Border',
    'cbpr_utility_payment': 'CBPR+ Utility Payment',
    
    // Other pacs008 scenarios
    'cover_payment': 'Cover Payment',
    'duplicate_uetr': 'Duplicate UETR',
    'fx_conversion': 'FX Conversion',
    'high_value': 'High Value',
    'missing_lei_entity': 'Missing LEI Entity',
    'regulatory_compliant': 'Regulatory Compliant',
    'regulatory_test': 'Regulatory Test',
    'rejection': 'Rejection',
    'remit_basic': 'Remittance Basic',
    'remit_structured': 'Remittance Structured',
    'remittance_enhanced': 'Remittance Enhanced',
    'treasury_payment': 'Treasury Payment',
    'unresolved_intermediary': 'Unresolved Intermediary',
    
    // pacs009 scenarios
    'bank_transfer_cover': 'Bank Transfer Cover',
    'bank_transfer_non_cover': 'Bank Transfer Non-Cover',
    'cbpr_cov_complex_routing': 'CBPR+ COV Complex Routing',
    'cbpr_cov_compliance_enhanced': 'CBPR+ COV Compliance Enhanced',
    'cbpr_cov_rejection': 'CBPR+ COV Rejection',
    'cbpr_cov_return': 'CBPR+ COV Return',
    'cbpr_cov_standard': 'CBPR+ COV Standard',
    'cbpr_serial_payment': 'CBPR+ Serial Payment',
    'cov_mismatch': 'COV Mismatch',
    'fi_to_fi_transparency': 'FI to FI Transparency',
    'minimal_return': 'Minimal Return',
    'regulatory_reporting': 'Regulatory Reporting',
    'rejection_payment': 'Rejection Payment',
    'return_payment': 'Return Payment',
    'return_simple': 'Return Simple',
    'urgent_liquidity_transfer': 'Urgent Liquidity Transfer',
    
    // pain001 scenarios
    'bulk_payment': 'Bulk Payment',
    'cbpr_corporate_bulk': 'CBPR+ Corporate Bulk',
    'cbpr_payroll': 'CBPR+ Payroll',
    'cbpr_supplier_batch': 'CBPR+ Supplier Batch',
    'multi_currency': 'Multi-Currency',
    'salary_payment': 'Salary Payment',
    'scheduled_payment': 'Scheduled Payment',
    'urgent_payment': 'Urgent Payment',
    'vendor_payment': 'Vendor Payment',
    
    // pain008 scenarios
    'authorized_bulk_collection': 'Authorized Bulk Collection',
    'general_direct_debit_basic': 'General Direct Debit Basic',
    'return_processing': 'Return Processing',
    'unauthorized_debit_processing': 'Unauthorized Debit Processing'
  };

  // Scenarios are now loaded dynamically via useEffect

  const handleGenerate = async () => {
    if (!scenario) {
      alert('Please select a scenario');
      return;
    }

    // Find the selected scenario to get its source type
    const selectedScenario = scenarios.find(s => s.value === scenario);
    if (!selectedScenario) {
      alert('Selected scenario not found');
      setLoading(false);
      return;
    }

    setLoading(true);
    setCopied(false);

    const requestBody = {
      message_type: selectedScenario.source, // Use source from scenario
      config: {
        scenario: scenario
      }
    };

    const apiEndpoint = `${API_BASE_URL}${API_ENDPOINTS.GENERATE_SAMPLE}`;
    
    setApiRequest(`POST ${apiEndpoint}
Content-Type: application/json

${JSON.stringify(requestBody, null, 2)}`);

    try {
      console.log('Making API request to:', apiEndpoint);
      console.log('Request body:', requestBody);
      
      // Make actual API call with timeout and error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
        mode: 'cors', // Explicitly set CORS mode
      }).catch(error => {
        console.error('Fetch error:', error);
        throw new Error(`Network error: ${error.message}. The API might not be running or CORS might not be configured.`);
      });
      
      clearTimeout(timeoutId);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Try to parse response as JSON, but handle text responses too
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('Response text:', text);
        // Try to parse as JSON anyway
        try {
          data = JSON.parse(text);
        } catch {
          // If not JSON, wrap in object
          data = { message: text };
        }
      }
      
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      // Extract the result field from the response
      let generatedMessage = data.result || data.transformed_message || data.message || '';
      
      // Beautify XML if it's a valid XML string
      if (generatedMessage && typeof generatedMessage === 'string') {
        try {
          // Check if it's XML by trying to parse it
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(generatedMessage, 'text/xml');
          
          // Check for parse errors
          const parseError = xmlDoc.getElementsByTagName('parsererror');
          if (parseError.length === 0) {
            // It's valid XML, beautify it
            generatedMessage = formatXML(generatedMessage);
          }
        } catch (e) {
          // Not XML or error in parsing, use as is
          console.log('Not XML or error parsing:', e);
        }
      }
      
      // Only show the transformed_message content, not the entire response
      setGeneratedContent(generatedMessage);
      
      // Keep the full response for debugging in the API details section
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (error: any) {
      console.error('Error generating sample:', error);
      
      let errorMessage = '';
      let errorDetails = '';
      
      // Handle different types of errors
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout';
        errorDetails = 'The request took too long to complete. Please try again.';
      } else if (error.message.includes('Load failed') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Connection failed';
        errorDetails = `Could not connect to the API at ${apiEndpoint}. Please ensure:\n1. The Reframe API is running\n2. The API is accessible at port 3000\n3. CORS is properly configured on the API`;
      } else if (error.message.includes('CORS')) {
        errorMessage = 'CORS error';
        errorDetails = 'The API needs to allow cross-origin requests. Please configure CORS headers on your API.';
      } else {
        errorMessage = 'API error';
        errorDetails = error.message;
      }
      
      setApiResponse(JSON.stringify({ 
        error: errorMessage,
        details: errorDetails,
        endpoint: apiEndpoint,
        timestamp: new Date().toISOString()
      }, null, 2));
      
      alert(`${errorMessage}\n\n${errorDetails}`);
      setGeneratedContent('');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Component-specific style overrides
  const localResultContainerStyle: React.CSSProperties = {
    ...resultContainerStyle,
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={containerStyle}>
      {/* Form Section */}
      <div style={cardContainerStyle}>
        <h3 style={sectionHeaderStyle}>
          Generate ISO20022 Message
        </h3>
        
        <div style={formGridStyle}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>
              ISO 20022 Scenario
            </label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              style={selectStyle}
              {...hoverEffects.select}
            >
              <option value="">Select scenario...</option>
              {scenarios.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handleGenerate}
              disabled={loading || !scenario}
              style={{
                ...primaryButtonStyle,
                ...((loading || !scenario) ? disabledButtonStyle : {}),
              }}
              {...hoverEffects.primaryButton}
            >
              {loading ? <><span>⏳</span> Generating...</> : <><span>🚀</span> Generate Message</>}
            </button>
          </div>
        </div>
      </div>

      {/* Result Section - Always Visible */}
      <div style={localResultContainerStyle}>
        <div style={headerWithActionsStyle}>
          <h3 style={{ ...sectionHeaderStyle, marginBottom: 0 }}>
            Generated ISO20022 Message
          </h3>
          {generatedContent && (
            <button
              onClick={handleCopy}
              style={{
                ...secondaryButtonStyle,
                ...(copied ? { backgroundColor: 'var(--ifm-color-primary)', color: 'white' } : {}),
              }}
              {...(copied ? {} : hoverEffects.secondaryButton)}
            >
              {copied ? <><span>✓</span> Copied!</> : <><span>📋</span> Copy to Clipboard</>}
            </button>
          )}
        </div>

        {generatedContent ? (
          <div style={{ flex: 1, overflow: 'auto' }}>
            <CodeBlock language="xml" showLineNumbers>
              {generatedContent}
            </CodeBlock>
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <div style={iconStyle}>📄</div>
            <p style={{ fontSize: '18px', margin: 0 }}>
              Select a message type and scenario above
            </p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Then click Generate to create a sample ISO20022 message
            </p>
          </div>
        )}

        {/* API Details - Always visible for documentation purposes */}
        <details style={{ marginTop: '24px' }}>
          <summary style={apiDetailsSummaryStyle}>
            <span>🔍</span> View API Request & Response Details
          </summary>
          <div style={{ marginTop: '16px' }}>
            <h5 style={{ marginBottom: '12px' }}>Request:</h5>
            <CodeBlock language="http">{apiRequest || 'API request will appear here after generating a message'}</CodeBlock>
            
            <h5 style={{ marginTop: '20px', marginBottom: '12px' }}>Response:</h5>
            <CodeBlock language="json">{apiResponse || 'API response will appear here after generating a message'}</CodeBlock>
          </div>
        </details>
      </div>
    </div>
  );
};

export default ISO20022Generator;