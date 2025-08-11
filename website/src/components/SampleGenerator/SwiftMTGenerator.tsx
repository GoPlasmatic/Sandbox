import React, { useState, useEffect } from 'react';
import CodeBlock from '@theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { API_ENDPOINTS } from '../../config/api';
import { 
  getSwiftMTMessageTypes, 
  getSwiftMTScenarios, 
  getSwiftMTDescription,
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

const SwiftMTGenerator: React.FC = () => {
  const [messageType, setMessageType] = useState('');
  const [scenario, setScenario] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [apiRequest, setApiRequest] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messageTypes, setMessageTypes] = useState<MessageTypeOption[]>([]);
  const [scenarios, setScenarios] = useState<DropdownOption[]>([]);
  const [messageDescription, setMessageDescription] = useState<string>('');

  // Get API base URL from Docusaurus config
  const { siteConfig } = useDocusaurusContext();
  const API_BASE_URL = (siteConfig.customFields?.REFRAME_API_URL as string) || 'http://localhost:3000';

  // Load message types on component mount
  useEffect(() => {
    const loadMessageTypes = async () => {
      const types = await getSwiftMTMessageTypes();
      setMessageTypes(types);
      // Auto-select first message type if available
      if (types.length > 0 && !messageType) {
        setMessageType(types[0].value);
      }
    };
    loadMessageTypes();
  }, []);

  // Load scenarios when message type changes
  useEffect(() => {
    const loadScenarios = async () => {
      if (messageType) {
        const scenarioList = await getSwiftMTScenarios(messageType);
        setScenarios(scenarioList);
        // Auto-select first scenario if available
        if (scenarioList.length > 0) {
          setScenario(scenarioList[0].value);
        } else {
          setScenario('');
        }
        
        // Load message description
        const desc = await getSwiftMTDescription(messageType);
        setMessageDescription(desc || '');
      } else {
        setScenarios([]);
        setMessageDescription('');
      }
    };
    loadScenarios();
  }, [messageType]);

  const handleGenerate = async () => {
    if (!messageType || !scenario) {
      alert('Please select both message type and scenario');
      return;
    }

    setLoading(true);
    setCopied(false);

    const requestBody = {
      message_type: messageType, // Use uppercase as stored in dropdown
      scenario: scenario,
      config: {} // API requires config field
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
      
      // Only show the message content, not the entire response
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
          Generate SWIFT MT Message
        </h3>
        
        <div style={formGridStyle}>
          <div>
            <label style={labelStyle}>
              Message Type
            </label>
            <select
              value={messageType}
              onChange={(e) => {
                setMessageType(e.target.value);
                setScenario('');
              }}
              style={selectStyle}
              {...hoverEffects.select}
            >
              <option value="">Select message type...</option>
              {messageTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>
              Scenario
            </label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              disabled={!messageType}
              style={{
                ...selectStyle,
                ...(messageType ? {} : disabledButtonStyle),
              }}
              {...(messageType ? hoverEffects.select : {})}
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
              disabled={loading}
              style={{
                ...primaryButtonStyle,
                ...(loading ? disabledButtonStyle : {}),
              }}
              {...hoverEffects.primaryButton}
            >
              {loading ? <><span>⏳</span> Generating...</> : <><span>🚀</span> Generate Message</>}
            </button>
          </div>
        </div>

        {/* Message description */}
        {messageDescription && (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            backgroundColor: 'var(--ifm-color-emphasis-200)', 
            borderRadius: '8px',
            fontSize: '14px',
            color: 'var(--ifm-color-emphasis-700)'
          }}>
            <strong>Message Type:</strong> {messageDescription}
          </div>
        )}
      </div>

      {/* Result Section - Always Visible */}
      <div style={localResultContainerStyle}>
        <div style={headerWithActionsStyle}>
          <h3 style={{ ...sectionHeaderStyle, marginBottom: 0 }}>
            Generated SWIFT MT Message
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
            <CodeBlock language="swift" showLineNumbers>
              {generatedContent}
            </CodeBlock>
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <div style={iconStyle}>📄</div>
            <p style={{ fontSize: '18px', margin: 0 }}>
              Select a message type and scenario above
            </p>
            <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.8 }}>
              Then click Generate to create a sample SWIFT MT message
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

export default SwiftMTGenerator;