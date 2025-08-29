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
  utilityButtonStyle,
  textareaStyle,
  resultContainerStyle,
  apiDetailsSummaryStyle,
  headerWithActionsStyle,
  buttonGroupStyle,
  checkboxContainerStyle,
  tabStyle,
  successMessageStyle,
  errorMessageStyle,
  hoverEffects,
  disabledButtonStyle,
} from '../../styles/componentStyles';

const formatXML = (xml: string): string => {
  try {
    xml = xml.replace(/>\s*</g, '><').trim();
    
    let formatted = '';
    let indent = 0;
    const tab = '  ';
    
    const tokens = xml.split(/(<[^>]+>)/g).filter(token => token.length > 0);
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (!token || token.trim() === '') continue;
      
      if (token.startsWith('<')) {
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
          } else {
            formatted += '\n';
          }
        }
        else if (token.endsWith('/>') || token.includes('<?xml')) {
          formatted += tab.repeat(Math.max(0, indent)) + token + '\n';
        }
        else {
          formatted += tab.repeat(Math.max(0, indent)) + token;
          if (i < tokens.length - 1 && !tokens[i + 1].startsWith('<')) {
          } else {
            formatted += '\n';
          }
          if (!token.includes('<?xml')) {
            indent++;
          }
        }
      }
      else {
        // Just add the text content as-is, no modifications
        formatted += token;
      }
    }
    
    return formatted;
  } catch (e) {
    console.error('Error formatting XML:', e);
    return xml;
  }
};

const formatJSON = (json: any): string => {
  try {
    return JSON.stringify(json, null, 2);
  } catch (e) {
    console.error('Error formatting JSON:', e);
    return JSON.stringify(json);
  }
};

const ISO20022Validator: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [includeCanonical, setIncludeCanonical] = useState(true);
  const [includeBusinessValidation, setIncludeBusinessValidation] = useState(true);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [generatingMessage, setGeneratingMessage] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'validation' | 'canonical' | 'api'>('validation');
  const [copied, setCopied] = useState(false);
  const [apiRequest, setApiRequest] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  
  // Sample generation states
  const [scenario, setScenario] = useState('');
  const [scenarios, setScenarios] = useState<any[]>([]);

  const { siteConfig } = useDocusaurusContext();
  const API_BASE_URL = (siteConfig.customFields?.REFRAME_API_URL as string) || 'http://localhost:3000';

  // Load message types on component mount
  // Load scenarios on component mount (reverse transformations for ISO 20022)
  useEffect(() => {
    const loadScenarios = async () => {
      // Load reverse transformation scenarios (MX source messages)
      const scenarioList = await getReframeScenarios('reverse');
      setScenarios(scenarioList);
      // Set default scenario
      if (scenarioList.length > 0 && !scenario) {
        setScenario(scenarioList[0].value);
      }
    };
    loadScenarios();
  }, []);

  const handleGenerateSample = async () => {
    if (!scenario) {
      setError('Please select a scenario');
      return;
    }

    setGeneratingMessage(true);
    setError('');

    // Find the selected scenario to get its source type
    const selectedScenario = scenarios.find(s => s.value === scenario);
    if (!selectedScenario) {
      setError('Selected scenario not found');
      setGeneratingMessage(false);
      return;
    }

    const requestBody = {
      message_type: selectedScenario.source, // Use source from scenario
      config: {
        scenario: scenario
      }
    };

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GENERATE_SAMPLE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      // Handle new API response format
      let generatedMessage = data.result || data.transformed_message || data.message || '';
      
      if (generatedMessage) {
        generatedMessage = formatXML(generatedMessage);
      }

      setInputMessage(generatedMessage);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate sample message. Please check your connection and try again.');
    } finally {
      setGeneratingMessage(false);
    }
  };

  const handleValidate = async () => {
    if (!inputMessage.trim()) {
      setError('Please enter an ISO20022 message to validate');
      return;
    }

    setLoading(true);
    setError('');
    setValidationResult(null);

    const requestBody = {
      message: inputMessage,
      options: {
        canonical: includeCanonical,
        business_validation: includeBusinessValidation
      }
    };

    const apiEndpoint = `${API_BASE_URL}/validate/mx`;
    
    setApiRequest(`POST ${apiEndpoint}
Content-Type: application/json

${JSON.stringify(requestBody, null, 2)}`);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setValidationResult(data);
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Validation error:', err);
      setError(err.message || 'Failed to validate message. Please check your input and try again.');
      setApiResponse(JSON.stringify({ 
        error: err.message,
        timestamp: new Date().toISOString()
      }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputMessage('');
    setValidationResult(null);
    setError('');
    setScenario('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderValidationErrors = () => {
    // Check if the message is valid based on the 'success' field
    const isValid = validationResult?.success === true;

    if (isValid) {
      return (
        <div style={successMessageStyle}>
          <h4 style={{ margin: 0, marginBottom: '8px' }}>✓ Message is Valid</h4>
          <p style={{ margin: 0 }}>The message passed all validation checks successfully.</p>
        </div>
      );
    }

    // Get errors from the 'errors' field
    const errors = validationResult?.errors || [];
    const errorArray = Array.isArray(errors) ? errors : [errors];

    // If no errors but success is false, show generic error
    if (errorArray.length === 0 && validationResult?.success === false) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: 'var(--ifm-color-danger-lightest)', 
          borderRadius: '8px',
          border: '2px solid var(--ifm-color-danger)'
        }}>
          <h4 style={{ color: 'var(--ifm-color-danger-darkest)', marginTop: 0 }}>Validation Failed</h4>
          <div style={{ color: 'var(--ifm-color-danger-darker)' }}>
            {validationResult?.message || 'The message validation failed but no specific errors were provided.'}
          </div>
        </div>
      );
    }

    return (
      <div>
        <h4 style={{ color: 'var(--ifm-color-danger)', marginBottom: '16px' }}>
          Validation Errors ({errorArray.length})
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {errorArray.map((error: any, index: number) => {
            // Handle ReframeError format
            const errorMessage = typeof error === 'string' ? error : 
                                error.message || error.error || error.description || 
                                JSON.stringify(error);
            const errorType = error.error_type || error.code || 'Validation Error';
            const errorCode = error.code || '';

            return (
              <div key={index} style={{ 
                padding: '16px', 
                backgroundColor: 'var(--ifm-color-danger-lightest)', 
                borderLeft: '4px solid var(--ifm-color-danger)',
                borderRadius: '6px'
              }}>
                <div style={{ 
                  fontWeight: 'bold', 
                  marginBottom: '8px', 
                  color: 'var(--ifm-color-danger-darkest)',
                  fontSize: '15px'
                }}>
                  {errorCode ? `${errorType} (${errorCode})` : errorType}
                </div>
                <div style={{ marginBottom: '8px', color: 'var(--ifm-color-danger-darker)' }}>
                  {errorMessage}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'var(--ifm-color-emphasis-700)' }}>
                  {error.location && (
                    <div>
                      <strong>Location:</strong> {error.location}
                    </div>
                  )}
                  {error.field && (
                    <div>
                      <strong>Field:</strong> {error.field}
                    </div>
                  )}
                  {error.field_tag && (
                    <div>
                      <strong>Field Tag:</strong> {error.field_tag}
                    </div>
                  )}
                  {error.field_type && (
                    <div>
                      <strong>Field Type:</strong> {error.field_type}
                    </div>
                  )}
                  {error.position && (
                    <div>
                      <strong>Position:</strong> {error.position}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Component-specific style overrides if needed
  const localTextareaStyle: React.CSSProperties = {
    ...textareaStyle,
    minHeight: '280px', // Slightly taller for validation
  };

  // Scenarios are now loaded dynamically via useEffect

  return (
    <div style={containerStyle}>
      {/* Sample Generation Section */}
      <div style={cardContainerStyle}>
        <h3 style={sectionHeaderStyle}>
          Generate Sample Message
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
              {scenarios.map(sc => (
                <option key={sc.value} value={sc.value}>
                  {sc.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handleGenerateSample}
              disabled={!scenario || generatingMessage}
              style={{
                ...primaryButtonStyle,
                ...(!scenario || generatingMessage ? disabledButtonStyle : {}),
              }}
              {...hoverEffects.primaryButton}
            >
              {generatingMessage ? <><span>⏳</span> Generating...</> : <><span>🚀</span> Generate Sample</>}
            </button>
          </div>
        </div>
      </div>

      {/* Message Input Section */}
      <div style={cardContainerStyle}>
        <div style={headerWithActionsStyle}>
          <h3 style={{ ...sectionHeaderStyle, marginBottom: 0 }}>
            ISO20022 Message Input
          </h3>
          <div style={buttonGroupStyle}>
            {inputMessage && (
              <button
                onClick={handleCopy}
                style={{
                  ...secondaryButtonStyle,
                  ...(copied ? { backgroundColor: 'var(--ifm-color-primary)', color: 'white' } : {}),
                }}
                {...(copied ? {} : hoverEffects.secondaryButton)}
              >
                {copied ? <><span>✓</span> Copied!</> : <><span>📋</span> Copy</>}
              </button>
            )}
            <button
              onClick={handleClear}
              style={utilityButtonStyle}
              {...hoverEffects.utilityButton}
            >
              <><span>🗑️</span> Clear</>
            </button>
          </div>
        </div>
        
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Paste your ISO20022 XML message here or generate a sample using the controls above..."
          style={localTextareaStyle}
          {...hoverEffects.textarea}
        />

        {/* Validation Options */}
        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
          <h4 style={{ 
            marginBottom: '12px', 
            fontSize: '16px',
            color: 'var(--ifm-color-emphasis-700)'
          }}>
            Validation Options
          </h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <label 
              style={checkboxContainerStyle}
              {...hoverEffects.checkbox}
            >
              <input
                type="checkbox"
                checked={includeCanonical}
                onChange={(e) => setIncludeCanonical(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: '500' }}>Include Canonical JSON</span>
            </label>
            
            <label 
              style={checkboxContainerStyle}
              {...hoverEffects.checkbox}
            >
              <input
                type="checkbox"
                checked={includeBusinessValidation}
                onChange={(e) => setIncludeBusinessValidation(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: '500' }}>Include Business Validation</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleValidate}
          disabled={loading || !inputMessage.trim()}
          style={{
            ...primaryButtonStyle,
            width: '100%',
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: loading || !inputMessage.trim() ? 'var(--ifm-color-emphasis-400)' : 'var(--ifm-color-success)',
            ...(loading || !inputMessage.trim() ? disabledButtonStyle : {}),
          }}
          {...hoverEffects.primaryButton}
        >
          {loading ? <><span>⏳</span> Validating...</> : <><span>✓</span> Validate Message</>}
        </button>

        {/* API Details Section - Always visible for documentation purposes */}
        <details style={{ marginTop: '24px' }}>
          <summary style={apiDetailsSummaryStyle}>
            <span>🔍</span> View API Request & Response Details
          </summary>
          <div style={{ marginTop: '16px' }}>
            <h5 style={{ marginBottom: '12px' }}>Request:</h5>
            <CodeBlock language="http">{apiRequest || 'API request will appear here after validating a message'}</CodeBlock>
            
            <h5 style={{ marginTop: '20px', marginBottom: '12px' }}>Response:</h5>
            <CodeBlock language="json">{apiResponse || 'API response will appear here after validating a message'}</CodeBlock>
          </div>
        </details>
      </div>

      {/* Error Display */}
      {error && (
        <div style={errorMessageStyle}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Validation Results */}
      {validationResult && (
        <div style={resultContainerStyle}>
          <div style={{ 
            display: 'flex', 
            gap: '8px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveTab('validation')}
              style={tabStyle(activeTab === 'validation')}
              onMouseEnter={(e) => hoverEffects.tab.onMouseEnter(e, activeTab === 'validation')}
              onMouseLeave={(e) => hoverEffects.tab.onMouseLeave(e, activeTab === 'validation')}
            >
              <span>📋</span> Validation Results
            </button>
            {includeCanonical && validationResult.canonical_json && (
              <button
                onClick={() => setActiveTab('canonical')}
                style={tabStyle(activeTab === 'canonical')}
                onMouseEnter={(e) => hoverEffects.tab.onMouseEnter(e, activeTab === 'canonical')}
                onMouseLeave={(e) => hoverEffects.tab.onMouseLeave(e, activeTab === 'canonical')}
              >
                <span>🔄</span> Canonical JSON
              </button>
            )}
            <button
              onClick={() => setActiveTab('api')}
              style={tabStyle(activeTab === 'api')}
              onMouseEnter={(e) => hoverEffects.tab.onMouseEnter(e, activeTab === 'api')}
              onMouseLeave={(e) => hoverEffects.tab.onMouseLeave(e, activeTab === 'api')}
            >
              <span>🔍</span> API Response
            </button>
          </div>

          <div style={{ marginTop: '20px' }}>
            {activeTab === 'validation' && renderValidationErrors()}

            {activeTab === 'canonical' && validationResult.canonical_json && (
              <div>
                <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>Canonical JSON</h3>
                <CodeBlock language="json" showLineNumbers>
                  {formatJSON(validationResult.canonical_json)}
                </CodeBlock>
              </div>
            )}

            {activeTab === 'api' && (
              <div>
                <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>Full API Response</h3>
                <CodeBlock language="json" showLineNumbers>
                  {formatJSON(validationResult)}
                </CodeBlock>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ISO20022Validator;