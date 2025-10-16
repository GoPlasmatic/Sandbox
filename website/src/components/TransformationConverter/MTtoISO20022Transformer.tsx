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
  emptyStateStyle,
  apiDetailsSummaryStyle,
  headerWithActionsStyle,
  buttonGroupStyle,
  checkboxContainerStyle,
  tabStyle,
  successMessageStyle,
  errorMessageStyle,
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

const formatJSON = (json: any): string => {
  try {
    return JSON.stringify(json, null, 2);
  } catch (e) {
    console.error('Error formatting JSON:', e);
    return JSON.stringify(json);
  }
};

// Add fadeIn animation CSS
const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const MTtoISO20022Transformer: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [outputMessage, setOutputMessage] = useState('');
  const [includeValidation, setIncludeValidation] = useState(true);
  const [includeDebug, setIncludeDebug] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatingMessage, setGeneratingMessage] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'output' | 'canonical' | 'api'>('output');
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [apiRequest, setApiRequest] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [transformationResult, setTransformationResult] = useState<any>(null);
  const [scenario, setScenario] = useState('');
  const [scenarios, setScenarios] = useState<any[]>([]);

  const { siteConfig } = useDocusaurusContext();
  const API_BASE_URL = (siteConfig.customFields?.REFRAME_API_URL as string) || 'http://localhost:3000';

  const handleTransform = async () => {
    if (!inputMessage.trim()) {
      setError('Please enter a SWIFT MT message to transform');
      return;
    }

    setLoading(true);
    setError('');
    setOutputMessage('');
    setTransformationResult(null);

    const requestBody = {
      message: inputMessage,
      validation: includeValidation,
      debug: includeDebug
    };

    const apiEndpoint = `${API_BASE_URL}${API_ENDPOINTS.TRANSFORM}`;
    
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
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      // Check if the API returned success: false
      if (data.success === false) {
        throw new Error(data.error || data.message || 'Transformation failed');
      }

      setTransformationResult(data);
      setApiResponse(JSON.stringify(data, null, 2));

      // Extract the transformed message
      // Handle both string and array results
      let transformedMessage = '';
      if (Array.isArray(data.result)) {
        transformedMessage = data.result.join('');
      } else {
        transformedMessage = data.result || data.transformed_message || '';
      }
      
      if (transformedMessage) {
        transformedMessage = formatXML(transformedMessage);
      }

      setOutputMessage(transformedMessage);
    } catch (err: any) {
      console.error('Transformation error:', err);
      setError(err.message || 'Failed to transform message. Please check your input and try again.');
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
    setOutputMessage('');
    setTransformationResult(null);
    setError('');
    setApiRequest('');
    setApiResponse('');
  };

  const handleCopyInput = () => {
    navigator.clipboard.writeText(inputMessage);
    setCopiedInput(true);
    setTimeout(() => setCopiedInput(false), 2000);
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(outputMessage);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  // Load scenarios on component mount (forward transformations)
  useEffect(() => {
    const loadScenarios = async () => {
      // Load forward transformation scenarios (MT to MX)
      const scenarioList = await getReframeScenarios('forward');
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
      setError('Please select a transformation scenario');
      return;
    }

    setGeneratingMessage(true);
    setError('');

    try {
      // Find the selected scenario to get its source type
      const selectedScenario = scenarios.find(s => s.value === scenario);
      if (!selectedScenario) {
        throw new Error('Selected scenario not found');
      }
      
      const sourceType = selectedScenario.source; // e.g., MT103
      
      // Generate a sample message using the Reframe API
      const requestBody = {
        message_type: sourceType,
        scenario: scenario,
        debug: false
      };

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

      // Handle API response
      let generatedMessage = data.result || data.transformed_message || data.message || '';
      
      if (generatedMessage) {
        setInputMessage(generatedMessage);
      } else {
        throw new Error('No message generated');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate sample message. Please check your connection and try again.');
    } finally {
      setGeneratingMessage(false);
    }
  };

  // Component-specific style overrides
  const localTextareaStyle: React.CSSProperties = {
    ...textareaStyle,
    minHeight: '200px',
  };

  const transformationInfoStyle: React.CSSProperties = {
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: 'var(--ifm-color-info-lightest)',
    borderRadius: '8px',
    border: '1px solid var(--ifm-color-info)',
  };

  return (
    <>
      <style>{fadeInAnimation}</style>
      <div style={containerStyle}>
      {/* Sample Generation Section */}
      <div style={cardContainerStyle}>
        <h3 style={sectionHeaderStyle}>
          Load Transformation Scenario
        </h3>
        
        <div style={formGridStyle}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>
              MT to MX Transformation Scenario
            </label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              style={selectStyle}
              {...hoverEffects.select}
            >
              <option value="">Select transformation scenario...</option>
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
              {generatingMessage ? <><span>⏳</span> Loading...</> : <><span>📥</span> Load Sample</>}
            </button>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div style={cardContainerStyle}>
        <div style={headerWithActionsStyle}>
          <h3 style={{ ...sectionHeaderStyle, marginBottom: 0 }}>
            SWIFT MT Message Input
          </h3>
          <div style={buttonGroupStyle}>
            {inputMessage && (
              <button
                onClick={handleCopyInput}
                style={{
                  ...secondaryButtonStyle,
                  ...(copiedInput ? { backgroundColor: 'var(--ifm-color-primary)', color: 'white' } : {}),
                }}
                {...(copiedInput ? {} : hoverEffects.secondaryButton)}
              >
                {copiedInput ? <><span>✓</span> Copied!</> : <><span>📋</span> Copy</>}
              </button>
            )}
            <button
              onClick={handleClear}
              style={utilityButtonStyle}
              {...hoverEffects.utilityButton}
            >
              <span>🗑️</span> Clear All
            </button>
          </div>
        </div>
        
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Paste your SWIFT MT message here (e.g., MT103, MT202, MT900)..."
          style={localTextareaStyle}
          {...hoverEffects.textarea}
        />

        {/* Transformation Options */}
        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
          <h4 style={{ 
            marginBottom: '12px', 
            fontSize: '16px',
            color: 'var(--ifm-color-emphasis-700)'
          }}>
            Transformation Options
          </h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <label 
              style={checkboxContainerStyle}
              {...hoverEffects.checkbox}
            >
              <input
                type="checkbox"
                checked={includeValidation}
                onChange={(e) => setIncludeValidation(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: '500' }}>Validate before transformation</span>
            </label>
            
            <label 
              style={checkboxContainerStyle}
              {...hoverEffects.checkbox}
            >
              <input
                type="checkbox"
                checked={includeDebug}
                onChange={(e) => setIncludeDebug(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: '500' }}>Include debug information</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleTransform}
          disabled={loading || !inputMessage.trim()}
          style={{
            ...primaryButtonStyle,
            width: '100%',
            padding: '12px 24px',
            fontSize: '16px',
            ...(loading || !inputMessage.trim() ? disabledButtonStyle : {}),
          }}
          {...hoverEffects.primaryButton}
        >
          {loading ? <><span>⏳</span> Transforming...</> : <><span>🔄</span> Transform to ISO 20022</>}
        </button>
      </div>

      {/* Error Display - Prominently placed after transform button */}
      {error && (
        <div style={{
          ...errorMessageStyle,
          marginTop: '16px',
          marginBottom: '16px',
          fontSize: '16px',
          fontWeight: '500',
          animation: 'fadeIn 0.3s ease-in',
          boxShadow: '0 2px 8px rgba(255, 0, 0, 0.1)'
        }}>
          <strong style={{ fontSize: '18px' }}>⚠️ Error:</strong> {error}
        </div>
      )}

      {/* Output/API Section - Always visible for documentation purposes */}
      <div style={resultContainerStyle}>
          <div style={headerWithActionsStyle}>
            <div style={{ 
              display: 'flex', 
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setActiveTab('output')}
                style={tabStyle(activeTab === 'output')}
                onMouseEnter={(e) => hoverEffects.tab.onMouseEnter(e, activeTab === 'output')}
                onMouseLeave={(e) => hoverEffects.tab.onMouseLeave(e, activeTab === 'output')}
              >
                <span>📄</span> ISO 20022 Output
              </button>
              {transformationResult?.canonical_json && (
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
                <span>🔍</span> API Details
              </button>
            </div>
            {activeTab === 'output' && outputMessage && (
              <button
                onClick={handleCopyOutput}
                style={{
                  ...secondaryButtonStyle,
                  ...(copiedOutput ? { backgroundColor: 'var(--ifm-color-primary)', color: 'white' } : {}),
                }}
                {...(copiedOutput ? {} : hoverEffects.secondaryButton)}
              >
                {copiedOutput ? <><span>✓</span> Copied!</> : <><span>📋</span> Copy Output</>}
              </button>
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            {activeTab === 'output' && (
              <>
                {transformationResult?.success && (
                  <div style={transformationInfoStyle}>
                    <h4 style={{ margin: 0, marginBottom: '8px', color: 'var(--ifm-color-info-darkest)' }}>
                      Transformation Details
                    </h4>
                    <div style={{ fontSize: '14px', color: 'var(--ifm-color-info-darker)' }}>
                      {transformationResult.source_type && (
                        <div><strong>Source:</strong> {transformationResult.source_type}</div>
                      )}
                      {transformationResult.target_type && (
                        <div><strong>Target:</strong> {transformationResult.target_type}</div>
                      )}
                      {transformationResult.message_type && (
                        <div><strong>Message Type:</strong> {transformationResult.message_type}</div>
                      )}
                      {transformationResult.debug_info && (
                        <div><strong>Debug Info:</strong> Available in API response</div>
                      )}
                    </div>
                  </div>
                )}
                {outputMessage ? (
                  <CodeBlock language="xml" showLineNumbers>
                    {outputMessage}
                  </CodeBlock>
                ) : (
                  <div style={emptyStateStyle}>
                    <div style={iconStyle}>📄</div>
                    <p style={{ fontSize: '16px', margin: 0 }}>
                      No output available
                    </p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'canonical' && transformationResult?.canonical_json && (
              <div>
                <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>Canonical JSON</h3>
                <CodeBlock language="json" showLineNumbers>
                  {formatJSON(transformationResult.canonical_json)}
                </CodeBlock>
              </div>
            )}

            {activeTab === 'api' && (
              <div>
                <h5 style={{ marginBottom: '12px' }}>Request:</h5>
                <CodeBlock language="http">{apiRequest}</CodeBlock>
                
                {apiResponse && (
                  <>
                    <h5 style={{ marginTop: '20px', marginBottom: '12px' }}>Response:</h5>
                    <CodeBlock language="json">{apiResponse}</CodeBlock>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MTtoISO20022Transformer;