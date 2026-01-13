/**
 * Reframe Playground - Interactive API testing for SWIFT MT and ISO 20022
 * Provides inline widgets and a full playground page
 */

// Google Analytics
(function() {
    const GA_ID = 'G-8S5BQ4NV4C';

    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { 'anonymize_ip': true });
})();

// JSON-LD Structured Data for SEO
(function() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Reframe",
        "applicationCategory": "DeveloperApplication",
        "applicationSubCategory": "Financial Message Transformation",
        "operatingSystem": "Cross-platform",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Open source rules engine for universal message transformation. Transform SWIFT MT to ISO 20022 with auditable JSONLogic rules.",
        "url": "https://sandbox.goplasmatic.io",
        "author": {
            "@type": "Organization",
            "name": "Plasmatic",
            "url": "https://github.com/GoPlasmatic"
        },
        "license": "https://opensource.org/licenses/Apache-2.0",
        "keywords": "SWIFT MT, ISO 20022, CBPR+, message transformation, financial messaging, JSONLogic, open source"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
})();

// Configuration
const DEFAULT_API_URL = 'https://reframeapi.goplasmatic.io';
let apiBaseUrl = DEFAULT_API_URL;

// Scenario data cache
let scenarioData = null;

// Inject sidebar branding (logo with title)
function injectSidebarBranding() {
    const sidebar = document.querySelector('.sidebar-scrollbox');
    if (!sidebar) return;

    // Check if already injected
    if (document.querySelector('.sidebar-brand')) return;

    const basePath = getBasePath();
    const brandHtml = `
        <a href="${basePath}introduction.html" class="sidebar-brand">
            <img src="${basePath}img/Plasmatic_Logo.png" alt="Plasmatic" />
        </a>
    `;

    sidebar.insertAdjacentHTML('afterbegin', brandHtml);
}

// Get the base path for loading data files
function getBasePath() {
    if (typeof path_to_root !== 'undefined') {
        return window.location.href.replace(/[^/]*$/, '') + path_to_root;
    }
    const path = window.location.pathname;
    const parts = path.split('/');
    parts.pop();
    return window.location.origin + parts.join('/') + '/';
}

// Load scenario data
async function loadScenarioData() {
    if (scenarioData) return scenarioData;

    try {
        const basePath = getBasePath();
        const response = await fetch(basePath + 'data/reframe_dropdown.json');
        scenarioData = await response.json();
        return scenarioData;
    } catch (error) {
        console.error('Failed to load scenario data:', error);
        return getDefaultScenarios();
    }
}

// Default scenarios fallback
function getDefaultScenarios() {
    return {
        scenariosByType: {
            forward: [
                { value: 'standard', label: 'MT103: Standard Cross-Border Payment', source: 'MT103' },
                { value: 'high_value', label: 'MT103: High Value Payment', source: 'MT103' },
                { value: 'core', label: 'MT202: Core FI Transfer', source: 'MT202' }
            ],
            reverse: [
                { value: 'standard', label: 'pacs.008: Standard Customer Transfer', source: 'pacs.008' },
                { value: 'core', label: 'pacs.009: FI Transfer', source: 'pacs.009' }
            ]
        }
    };
}

// Get scenarios for a specific message type
function getScenariosForMessageType(data, messageType, format) {
    const direction = format === 'swift-mt' ? 'forward' : 'reverse';
    const scenarios = data.scenariosByType?.[direction] || [];
    return scenarios.filter(s => s.source === messageType);
}

// SWIFT MT Message Types
const swiftMtTypes = [
    'MT101', 'MT103', 'MT104', 'MT107', 'MT110', 'MT111', 'MT112',
    'MT192', 'MT196', 'MT199', 'MT202', 'MT205', 'MT210',
    'MT292', 'MT296', 'MT299', 'MT900', 'MT910', 'MT920',
    'MT935', 'MT940', 'MT941', 'MT942', 'MT950'
];

// ISO 20022 Message Types
const iso20022Types = [
    'pacs.002', 'pacs.003', 'pacs.008', 'pacs.009',
    'pain.001', 'pain.008',
    'camt.025', 'camt.029', 'camt.052', 'camt.053',
    'camt.054', 'camt.056', 'camt.057', 'camt.060'
];

// API Functions
async function generateSample(messageType, scenario) {
    const response = await fetch(`${apiBaseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message_type: messageType,
            scenario: scenario,
            debug: false
        })
    });
    return response.json();
}

async function validateMessage(message, options = {}) {
    const response = await fetch(`${apiBaseUrl}/api/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: message,
            options: {
                canonical: options.canonical !== false,
                business_validation: options.businessValidation !== false
            },
            debug: options.debug || false
        })
    });
    return response.json();
}

async function transformMessage(message, options = {}) {
    const response = await fetch(`${apiBaseUrl}/api/transform`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: message,
            validation: options.validation !== false,
            debug: options.debug || false
        })
    });
    return response.json();
}

// SWIFT MT Syntax Highlighting
function highlightSwiftMT(text) {
    if (!text) return '';

    // Escape HTML first (consistent with XML highlighting)
    let result = escapeHtml(text);

    // 1. Block markers: {1: {2: {3: {4: {5:
    result = result.replace(/(\{[1-5]:)/g, '<span class="swift-block">$1</span>');

    // 2. Block 3 sub-blocks: {119:STP} {121:UUID} {111:001}
    result = result.replace(/(\{)(\d{3}):([^}]+)(\})/g,
        '$1<span class="swift-tag">$2:</span><span class="swift-reference">$3</span>$4');

    // 3. Block end and separators
    result = result.replace(/(-\})/g, '<span class="swift-block">$1</span>');
    result = result.replace(/(\}\{)/g, '<span class="swift-block">$1</span>');

    // 4. Field tags: :20: :23B: :32A: :50K: etc. (pattern :NNL: where N=digit, L=optional letter)
    result = result.replace(/(:[0-9]{2}[A-Z]?:)/g, '<span class="swift-tag">$1</span>');

    // 5. Sub-field indicators: /LEI/ /RFB/ /ACC/ /PURP/ /INS/ /REC/ etc.
    result = result.replace(/(\/[A-Z]{2,}\/)/g, '<span class="swift-subfield">$1</span>');

    // 6. BIC codes after bank-related field tags (:52A: :53A: :54A: :56A: :57A:)
    // BIC pattern: 4 letters + 2 letters + 2 alphanum + optional 3 alphanum
    result = result.replace(/(class="swift-tag">:[0-9]{2}[A-Z]?:<\/span>)([A-Z]{4}[A-Z]{2}[A-Z0-9]{2}(?:[A-Z0-9]{3})?)/g,
        '$1<span class="swift-bic">$2</span>');

    // 7. Amounts with currency after date (YYMMDD pattern): 260112EUR50000,00
    // Match 6 digits followed by 3-letter currency and amount
    result = result.replace(/(\d{6})([A-Z]{3})(\d+[,.]?\d*)/g,
        '$1<span class="swift-amount">$2$3</span>');

    return result;
}

function formatXML(xml) {
    if (!xml) return '';

    // Remove existing whitespace between tags
    xml = xml.replace(/>\s+</g, '><').trim();

    let formatted = '';
    let indent = 0;
    const tab = '  ';

    // Match all tags and text content
    const tokens = xml.match(/<[^>]+>|[^<]+/g) || [];

    for (const token of tokens) {
        if (token.startsWith('</')) {
            // Closing tag - decrease indent first
            indent = Math.max(0, indent - 1);
            formatted += tab.repeat(indent) + token + '\n';
        } else if (token.startsWith('<?') || token.startsWith('<!')) {
            // Processing instruction or doctype
            formatted += tab.repeat(indent) + token + '\n';
        } else if (token.startsWith('<') && token.endsWith('/>')) {
            // Self-closing tag
            formatted += tab.repeat(indent) + token + '\n';
        } else if (token.startsWith('<')) {
            // Opening tag - add then increase indent
            formatted += tab.repeat(indent) + token + '\n';
            indent++;
        } else {
            // Text content
            const trimmed = token.trim();
            if (trimmed) {
                formatted += tab.repeat(indent) + trimmed + '\n';
            }
        }
    }

    return formatted.trim();
}

function highlightXML(xml) {
    if (!xml) return '';

    // Format the XML with proper indentation
    const formatted = formatXML(xml);

    // Process line by line for cleaner highlighting
    const lines = formatted.split('\n');
    const highlightedLines = lines.map(line => {
        // Escape the line first
        let escaped = escapeHtml(line);

        // IMPORTANT: Highlight attributes and values FIRST (before inserting span tags)
        // This prevents matching 'class=' inside our span tags

        // Highlight attributes: attrName= (but not after &lt; which is tag start)
        escaped = escaped.replace(/(&gt;|&quot;|\s)([\w:]+)(=&quot;)/g, '$1<span class="xml-attr">$2</span>$3');

        // Highlight attribute values: &quot;value&quot;
        escaped = escaped.replace(/(&quot;)([^&]*)(&quot;)/g, '$1<span class="xml-value">$2</span>$3');

        // Now highlight tags (our spans won't have attributes to match)

        // Highlight processing instructions: &lt;?xml ... ?&gt;
        escaped = escaped.replace(/(&lt;\?)([\w]+)/g, '$1<span class="xml-tag">$2</span>');

        // Highlight closing tags: &lt;/TagName&gt;
        escaped = escaped.replace(/(&lt;\/)([\w:]+)(&gt;)/g, '$1<span class="xml-tag">$2</span>$3');

        // Highlight self-closing tags: &lt;TagName/&gt;
        escaped = escaped.replace(/(&lt;)([\w:]+)(\/&gt;)/g, '$1<span class="xml-tag">$2</span>$3');

        // Highlight opening tags with attributes: &lt;TagName attr="value"&gt;
        escaped = escaped.replace(/(&lt;)([\w:]+)(\s)/g, '$1<span class="xml-tag">$2</span>$3');

        // Highlight simple opening tags: &lt;TagName&gt;
        escaped = escaped.replace(/(&lt;)([\w:]+)(&gt;)/g, '$1<span class="xml-tag">$2</span>$3');

        return escaped;
    });

    return highlightedLines.join('\n');
}

function highlightJSON(str) {
    if (!str) return '';
    return str
        .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
        .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
        .replace(/: (\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
        .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
        .replace(/: (null)/g, ': <span class="json-null">$1</span>');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatJSON(str) {
    try {
        return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
        return str;
    }
}

// Create Generator Widget
function createGeneratorWidget(container) {
    const format = container.dataset.format || 'swift-mt';
    const types = format === 'swift-mt' ? swiftMtTypes : iso20022Types;

    container.innerHTML = `
        <div class="reframe-widget-container">
            <div class="widget-header">
                <h4>${format === 'swift-mt' ? 'SWIFT MT' : 'ISO 20022'} Sample Generator</h4>
            </div>
            <div class="widget-body">
                <div class="form-row">
                    <label>Message Type</label>
                    <select class="message-type-select">
                        ${types.map(t => `<option value="${t}">${t}</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <label>Scenario</label>
                    <select class="scenario-select">
                        <option value="standard">Standard</option>
                    </select>
                </div>
                <div class="form-row">
                    <button class="btn btn-primary generate-btn">Generate</button>
                </div>
                <div class="result-container" style="display: none;">
                    <div class="result-header">
                        <span>Generated Message</span>
                        <button class="btn btn-small copy-btn">Copy</button>
                    </div>
                    <pre class="result-output"></pre>
                </div>
                <div class="error-container" style="display: none;"></div>
            </div>
            <details class="api-details">
                <summary>API Request & Response</summary>
                <div class="api-content">
                    <div class="api-request"></div>
                    <div class="api-response"></div>
                </div>
            </details>
        </div>
    `;

    const generateBtn = container.querySelector('.generate-btn');
    const resultContainer = container.querySelector('.result-container');
    const resultOutput = container.querySelector('.result-output');
    const errorContainer = container.querySelector('.error-container');
    const copyBtn = container.querySelector('.copy-btn');
    const apiRequest = container.querySelector('.api-request');
    const apiResponse = container.querySelector('.api-response');
    const typeSelect = container.querySelector('.message-type-select');
    const scenarioSelect = container.querySelector('.scenario-select');

    generateBtn.addEventListener('click', async () => {
        const messageType = typeSelect.value;
        const scenario = scenarioSelect.value;

        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        resultContainer.style.display = 'none';
        errorContainer.style.display = 'none';

        const requestBody = { message_type: messageType, scenario: scenario };
        apiRequest.innerHTML = `<strong>POST ${apiBaseUrl}/api/generate</strong><pre>${highlightJSON(escapeHtml(JSON.stringify(requestBody, null, 2)))}</pre>`;

        try {
            const result = await generateSample(messageType, scenario);
            apiResponse.innerHTML = `<pre>${highlightJSON(escapeHtml(JSON.stringify(result, null, 2)))}</pre>`;

            if (result.success && result.result) {
                resultContainer.style.display = 'block';
                const highlighted = format === 'swift-mt'
                    ? highlightSwiftMT(result.result)
                    : highlightXML(result.result);
                resultOutput.innerHTML = highlighted;
            } else {
                errorContainer.style.display = 'block';
                errorContainer.textContent = result.errors?.[0]?.message || 'Generation failed';
            }
        } catch (error) {
            errorContainer.style.display = 'block';
            errorContainer.textContent = `Error: ${error.message}. Is the API running at ${apiBaseUrl}?`;
        }

        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate';
    });

    copyBtn.addEventListener('click', () => {
        const text = resultOutput.textContent;
        navigator.clipboard.writeText(text);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy', 2000);
    });
}

// Create Validator Widget
function createValidatorWidget(container) {
    const format = container.dataset.format || 'swift-mt';

    container.innerHTML = `
        <div class="reframe-widget-container">
            <div class="widget-header">
                <h4>${format === 'swift-mt' ? 'SWIFT MT' : 'ISO 20022'} Validator</h4>
            </div>
            <div class="widget-body">
                <div class="form-row">
                    <label>Message</label>
                    <textarea class="message-input" rows="10" placeholder="Paste your ${format === 'swift-mt' ? 'SWIFT MT' : 'ISO 20022 XML'} message here..."></textarea>
                </div>
                <div class="form-row options-row">
                    <label><input type="checkbox" class="canonical-check" checked> Canonical JSON</label>
                    <label><input type="checkbox" class="business-check" checked> Business Validation</label>
                </div>
                <div class="form-row">
                    <button class="btn btn-primary validate-btn">Validate</button>
                    <button class="btn btn-secondary sample-btn">Load Sample</button>
                </div>
                <div class="result-container" style="display: none;">
                    <div class="result-tabs">
                        <button class="tab-btn active" data-tab="validation">Validation</button>
                        <button class="tab-btn" data-tab="canonical">Canonical JSON</button>
                        <button class="tab-btn" data-tab="response">API Response</button>
                    </div>
                    <div class="tab-content validation-tab"></div>
                    <div class="tab-content canonical-tab" style="display: none;"></div>
                    <div class="tab-content response-tab" style="display: none;"></div>
                </div>
                <div class="error-container" style="display: none;"></div>
            </div>
        </div>
    `;

    const validateBtn = container.querySelector('.validate-btn');
    const sampleBtn = container.querySelector('.sample-btn');
    const messageInput = container.querySelector('.message-input');
    const resultContainer = container.querySelector('.result-container');
    const errorContainer = container.querySelector('.error-container');
    const canonicalCheck = container.querySelector('.canonical-check');
    const businessCheck = container.querySelector('.business-check');
    const tabBtns = container.querySelectorAll('.tab-btn');
    const validationTab = container.querySelector('.validation-tab');
    const canonicalTab = container.querySelector('.canonical-tab');
    const responseTab = container.querySelector('.response-tab');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            container.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
            container.querySelector(`.${btn.dataset.tab}-tab`).style.display = 'block';
        });
    });

    sampleBtn.addEventListener('click', async () => {
        const types = format === 'swift-mt' ? swiftMtTypes : iso20022Types;
        try {
            const result = await generateSample(types[1], 'standard');
            if (result.success && result.result) {
                messageInput.value = result.result;
            }
        } catch (error) {
            errorContainer.style.display = 'block';
            errorContainer.textContent = `Error loading sample: ${error.message}`;
        }
    });

    validateBtn.addEventListener('click', async () => {
        const message = messageInput.value.trim();
        if (!message) {
            errorContainer.style.display = 'block';
            errorContainer.textContent = 'Please enter a message to validate';
            return;
        }

        validateBtn.disabled = true;
        validateBtn.textContent = 'Validating...';
        resultContainer.style.display = 'none';
        errorContainer.style.display = 'none';

        try {
            const result = await validateMessage(message, {
                canonical: canonicalCheck.checked,
                businessValidation: businessCheck.checked
            });

            resultContainer.style.display = 'block';

            // Validation result
            if (result.success) {
                validationTab.innerHTML = `
                    <div class="validation-success">
                        <strong>Valid</strong>
                        <p>Message type: ${result.message_type}</p>
                    </div>
                `;
            } else {
                validationTab.innerHTML = `
                    <div class="validation-error">
                        <strong>Validation Failed</strong>
                        ${result.errors?.map(e => `
                            <div class="error-item">
                                <span class="error-code">${e.code}</span>
                                <span class="error-msg">${e.message}</span>
                                ${e.field ? `<span class="error-field">Field: ${e.field}</span>` : ''}
                            </div>
                        `).join('') || ''}
                    </div>
                `;
            }

            // Canonical JSON
            if (result.canonical_json) {
                canonicalTab.innerHTML = `<pre>${highlightJSON(escapeHtml(JSON.stringify(result.canonical_json, null, 2)))}</pre>`;
            } else {
                canonicalTab.innerHTML = '<p>No canonical JSON available</p>';
            }

            // Full response
            responseTab.innerHTML = `<pre>${highlightJSON(escapeHtml(JSON.stringify(result, null, 2)))}</pre>`;

        } catch (error) {
            errorContainer.style.display = 'block';
            errorContainer.textContent = `Error: ${error.message}. Is the API running at ${apiBaseUrl}?`;
        }

        validateBtn.disabled = false;
        validateBtn.textContent = 'Validate';
    });
}

// Create Transformer Widget
function createTransformerWidget(container) {
    const direction = container.dataset.direction || 'mt-to-mx';
    const isForward = direction === 'mt-to-mx';

    container.innerHTML = `
        <div class="reframe-widget-container">
            <div class="widget-header">
                <h4>${isForward ? 'MT → ISO 20022' : 'ISO 20022 → MT'} Transformer</h4>
            </div>
            <div class="widget-body">
                <div class="form-row">
                    <label>Input Message (${isForward ? 'SWIFT MT' : 'ISO 20022'})</label>
                    <textarea class="message-input" rows="10" placeholder="Paste your ${isForward ? 'SWIFT MT' : 'ISO 20022 XML'} message here..."></textarea>
                </div>
                <div class="form-row options-row">
                    <label><input type="checkbox" class="validation-check" checked> Validate before transform</label>
                </div>
                <div class="form-row">
                    <button class="btn btn-primary transform-btn">Transform</button>
                    <button class="btn btn-secondary sample-btn">Load Sample</button>
                </div>
                <div class="result-container" style="display: none;">
                    <div class="result-header">
                        <span>Transformed Message (${isForward ? 'ISO 20022' : 'SWIFT MT'})</span>
                        <button class="btn btn-small copy-btn">Copy</button>
                    </div>
                    <pre class="result-output"></pre>
                </div>
                <div class="error-container" style="display: none;"></div>
            </div>
            <details class="api-details">
                <summary>API Request & Response</summary>
                <div class="api-content">
                    <div class="api-response"></div>
                </div>
            </details>
        </div>
    `;

    const transformBtn = container.querySelector('.transform-btn');
    const sampleBtn = container.querySelector('.sample-btn');
    const messageInput = container.querySelector('.message-input');
    const resultContainer = container.querySelector('.result-container');
    const resultOutput = container.querySelector('.result-output');
    const errorContainer = container.querySelector('.error-container');
    const validationCheck = container.querySelector('.validation-check');
    const copyBtn = container.querySelector('.copy-btn');
    const apiResponse = container.querySelector('.api-response');

    sampleBtn.addEventListener('click', async () => {
        const types = isForward ? swiftMtTypes : iso20022Types;
        try {
            const result = await generateSample(types[1], 'standard');
            if (result.success && result.result) {
                messageInput.value = result.result;
            }
        } catch (error) {
            errorContainer.style.display = 'block';
            errorContainer.textContent = `Error loading sample: ${error.message}`;
        }
    });

    transformBtn.addEventListener('click', async () => {
        const message = messageInput.value.trim();
        if (!message) {
            errorContainer.style.display = 'block';
            errorContainer.textContent = 'Please enter a message to transform';
            return;
        }

        transformBtn.disabled = true;
        transformBtn.textContent = 'Transforming...';
        resultContainer.style.display = 'none';
        errorContainer.style.display = 'none';

        try {
            const result = await transformMessage(message, {
                validation: validationCheck.checked
            });

            apiResponse.innerHTML = `<pre>${highlightJSON(escapeHtml(JSON.stringify(result, null, 2)))}</pre>`;

            if (result.success && result.result) {
                resultContainer.style.display = 'block';
                const highlighted = isForward
                    ? highlightXML(result.result)
                    : highlightSwiftMT(result.result);
                resultOutput.innerHTML = highlighted;
            } else {
                errorContainer.style.display = 'block';
                errorContainer.innerHTML = result.errors?.map(e =>
                    `<div class="error-item">${e.code}: ${e.message}</div>`
                ).join('') || 'Transformation failed';
            }
        } catch (error) {
            errorContainer.style.display = 'block';
            errorContainer.textContent = `Error: ${error.message}. Is the API running at ${apiBaseUrl}?`;
        }

        transformBtn.disabled = false;
        transformBtn.textContent = 'Transform';
    });

    copyBtn.addEventListener('click', () => {
        const text = resultOutput.textContent;
        navigator.clipboard.writeText(text);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy', 2000);
    });
}

// Get initial tab from URL hash or data attribute
function getInitialTab(container) {
    // Check URL hash first (e.g., #validate, #transform, #generate)
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (['generate', 'validate', 'transform'].includes(hash)) {
        return hash;
    }
    // Check data attribute (e.g., data-tab="validate")
    const dataTab = container.dataset.tab?.toLowerCase();
    if (['generate', 'validate', 'transform'].includes(dataTab)) {
        return dataTab;
    }
    return 'generate';
}

// Create Full Playground
function createFullPlayground(container) {
    const initialTab = getInitialTab(container);
    const showTabs = container.dataset.hideTabs !== 'true';

    container.innerHTML = `
        <div class="reframe-playground">
            <div class="playground-header">
                <span class="playground-header-title">Reframe Playground</span>
                <div class="api-url-config">
                    <label>API:</label>
                    <input type="text" class="api-url-input" value="${apiBaseUrl}">
                    <button class="btn btn-small update-url-btn">Update</button>
                </div>
            </div>

            ${showTabs ? `
            <div class="playground-tabs">
                <button class="playground-tab ${initialTab === 'generate' ? 'active' : ''}" data-section="generate">Generate</button>
                <button class="playground-tab ${initialTab === 'validate' ? 'active' : ''}" data-section="validate">Validate</button>
                <button class="playground-tab ${initialTab === 'transform' ? 'active' : ''}" data-section="transform">Transform</button>
            </div>
            ` : ''}

            <div class="playground-section generate-section" style="${initialTab === 'generate' ? '' : 'display: none;'}">
                <div class="section-row">
                    <div class="form-group">
                        <label>Format</label>
                        <select class="format-select">
                            <option value="swift-mt">SWIFT MT</option>
                            <option value="iso20022">ISO 20022</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Message Type</label>
                        <select class="type-select"></select>
                    </div>
                    <div class="form-group">
                        <label>Scenario</label>
                        <select class="scenario-select">
                            <option value="standard">Standard</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary action-btn">Generate Sample</button>
            </div>

            <div class="playground-section validate-section" style="${initialTab === 'validate' ? '' : 'display: none;'}">
                <div class="sample-generator-inline">
                    <select class="format-select-inline">
                        <option value="swift-mt">SWIFT MT</option>
                        <option value="iso20022">ISO 20022</option>
                    </select>
                    <select class="type-select-inline"></select>
                    <select class="scenario-select-inline"></select>
                    <button class="btn btn-secondary generate-sample-btn">Generate Sample</button>
                </div>
                <div class="section-row">
                    <div class="form-group wide">
                        <label>Message</label>
                        <textarea class="message-textarea" rows="12" placeholder="Paste your message here..."></textarea>
                    </div>
                </div>
                <div class="options-row">
                    <label><input type="checkbox" class="canonical-opt" checked> Canonical JSON</label>
                    <label><input type="checkbox" class="business-opt" checked> Business Validation</label>
                </div>
                <button class="btn btn-primary action-btn">Validate</button>
            </div>

            <div class="playground-section transform-section" style="${initialTab === 'transform' ? '' : 'display: none;'}">
                <div class="sample-generator-inline">
                    <select class="format-select-inline">
                        <option value="swift-mt">SWIFT MT</option>
                        <option value="iso20022">ISO 20022</option>
                    </select>
                    <select class="type-select-inline"></select>
                    <select class="scenario-select-inline"></select>
                    <button class="btn btn-secondary generate-sample-btn">Generate Sample</button>
                </div>
                <div class="section-row">
                    <div class="form-group wide">
                        <label>Input Message</label>
                        <textarea class="message-textarea" rows="12" placeholder="Paste your message here..."></textarea>
                    </div>
                </div>
                <div class="options-row">
                    <label><input type="checkbox" class="validate-opt" checked> Validate before transform</label>
                </div>
                <button class="btn btn-primary action-btn">Transform</button>
            </div>

            <div class="result-panel">
                <div class="result-panel-header">
                    <span>Result</span>
                    <button class="btn btn-small copy-result-btn">Copy</button>
                </div>
                <pre class="result-display"></pre>
            </div>

            <div class="error-panel" style="display: none;"></div>
        </div>
    `;

    const tabs = container.querySelectorAll('.playground-tab');
    const sections = container.querySelectorAll('.playground-section');
    const formatSelect = container.querySelector('.format-select');
    const typeSelect = container.querySelector('.type-select');
    const resultDisplay = container.querySelector('.result-display');
    const resultPanel = container.querySelector('.result-panel');
    const errorPanel = container.querySelector('.error-panel');
    const apiUrlInput = container.querySelector('.api-url-input');
    const updateUrlBtn = container.querySelector('.update-url-btn');
    const copyResultBtn = container.querySelector('.copy-result-btn');

    // Tab switching function
    function switchToTab(tabName) {
        tabs.forEach(t => t.classList.remove('active'));
        const targetTab = container.querySelector(`.playground-tab[data-section="${tabName}"]`);
        if (targetTab) targetTab.classList.add('active');
        sections.forEach(s => s.style.display = 'none');
        const targetSection = container.querySelector(`.${tabName}-section`);
        if (targetSection) targetSection.style.display = 'block';

        // Clear results when switching tabs
        resultDisplay.innerHTML = '';
        errorPanel.style.display = 'none';
    }

    // Tab click handlers
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const section = tab.dataset.section;
            switchToTab(section);
            // Update URL hash without scrolling
            history.replaceState(null, null, `#${section}`);
        });
    });

    // Handle hash changes (browser back/forward)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (['generate', 'validate', 'transform'].includes(hash)) {
            switchToTab(hash);
        }
    });

    // Scenario select
    const scenarioSelect = container.querySelector('.generate-section .scenario-select');

    // Update scenarios based on message type
    async function updateScenarioSelect() {
        const format = formatSelect.value;
        const messageType = typeSelect.value;
        const data = await loadScenarioData();
        const scenarios = getScenariosForMessageType(data, messageType, format);

        if (scenarios.length > 0) {
            scenarioSelect.innerHTML = scenarios.map(s =>
                `<option value="${s.value}">${s.label}</option>`
            ).join('');
        } else {
            scenarioSelect.innerHTML = '<option value="">No scenarios available</option>';
        }
    }

    // Format change - update types then scenarios
    async function updateTypeSelect() {
        const format = formatSelect.value;
        const types = format === 'swift-mt' ? swiftMtTypes : iso20022Types;
        typeSelect.innerHTML = types.map(t => `<option value="${t}">${t}</option>`).join('');
        await updateScenarioSelect();
    }

    formatSelect.addEventListener('change', updateTypeSelect);
    typeSelect.addEventListener('change', updateScenarioSelect);
    updateTypeSelect();

    // API URL update
    updateUrlBtn.addEventListener('click', () => {
        apiBaseUrl = apiUrlInput.value.trim().replace(/\/$/, '');
        updateUrlBtn.textContent = 'Updated!';
        setTimeout(() => updateUrlBtn.textContent = 'Update', 2000);
    });

    // Copy result
    copyResultBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultDisplay.textContent);
        copyResultBtn.textContent = 'Copied!';
        setTimeout(() => copyResultBtn.textContent = 'Copy', 2000);
    });

    // Generate action
    const generateSection = container.querySelector('.generate-section');
    const generateBtn = generateSection.querySelector('.action-btn');
    generateBtn.addEventListener('click', async () => {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        errorPanel.style.display = 'none';

        try {
            const result = await generateSample(typeSelect.value,
                generateSection.querySelector('.scenario-select').value);

            if (result.success && result.result) {
                const format = formatSelect.value;
                const highlighted = format === 'swift-mt'
                    ? highlightSwiftMT(result.result)
                    : highlightXML(result.result);
                resultDisplay.innerHTML = highlighted;
            } else {
                throw new Error(result.errors?.[0]?.message || 'Generation failed');
            }
        } catch (error) {
            errorPanel.style.display = 'block';
            errorPanel.textContent = error.message;
        }

        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Sample';
    });

    // Validate action
    const validateSection = container.querySelector('.validate-section');
    const validateBtn = validateSection.querySelector('.action-btn');
    const validateTextarea = validateSection.querySelector('.message-textarea');

    // Initialize validate section sample generator dropdowns
    const validateFormatSelect = validateSection.querySelector('.format-select-inline');
    const validateTypeSelect = validateSection.querySelector('.type-select-inline');
    const validateScenarioSelect = validateSection.querySelector('.scenario-select-inline');
    const validateGenerateBtn = validateSection.querySelector('.generate-sample-btn');

    async function updateValidateScenarios() {
        const format = validateFormatSelect.value;
        const messageType = validateTypeSelect.value;
        const data = await loadScenarioData();
        const scenarios = getScenariosForMessageType(data, messageType, format);
        if (scenarios.length > 0) {
            validateScenarioSelect.innerHTML = scenarios.map(s =>
                `<option value="${s.value}">${s.label}</option>`
            ).join('');
        } else {
            validateScenarioSelect.innerHTML = '<option value="">No scenarios</option>';
        }
    }

    async function updateValidateTypes() {
        const format = validateFormatSelect.value;
        const types = format === 'swift-mt' ? swiftMtTypes : iso20022Types;
        validateTypeSelect.innerHTML = types.map(t => `<option value="${t}">${t}</option>`).join('');
        await updateValidateScenarios();
    }

    validateFormatSelect.addEventListener('change', updateValidateTypes);
    validateTypeSelect.addEventListener('change', updateValidateScenarios);
    updateValidateTypes();

    validateGenerateBtn.addEventListener('click', async () => {
        validateGenerateBtn.disabled = true;
        validateGenerateBtn.textContent = 'Generating...';
        try {
            const result = await generateSample(validateTypeSelect.value, validateScenarioSelect.value);
            if (result.success) validateTextarea.value = result.result;
        } catch (e) { /* ignore */ }
        validateGenerateBtn.disabled = false;
        validateGenerateBtn.textContent = 'Generate Sample';
    });

    validateBtn.addEventListener('click', async () => {
        validateBtn.disabled = true;
        validateBtn.textContent = 'Validating...';
        errorPanel.style.display = 'none';

        try {
            const result = await validateMessage(validateTextarea.value, {
                canonical: validateSection.querySelector('.canonical-opt').checked,
                businessValidation: validateSection.querySelector('.business-opt').checked
            });

            if (result.success) {
                resultDisplay.innerHTML = `<div class="validation-success">
                    <strong>✓ Valid Message</strong>
                    <p>Message Type: <span class="message-type">${result.message_type || 'Unknown'}</span></p>
                    <p>Package: <span class="package-name">${result.package || 'N/A'}</span></p>
                    <p>Processing Time: ${result.processing_time_ms}ms</p>
                </div>`;
            } else {
                const errorsHtml = result.errors?.map(e => `
                    <div class="error-item">
                        <span class="error-code">${e.code || e.error_type}</span>
                        <span class="error-msg">${e.message}</span>
                        ${e.field ? `<span class="error-field">Field: ${e.field}</span>` : ''}
                    </div>
                `).join('') || '';
                resultDisplay.innerHTML = `<div class="validation-error">
                    <strong>✗ Validation Failed</strong>
                    ${errorsHtml}
                </div>`;
            }
        } catch (error) {
            errorPanel.style.display = 'block';
            errorPanel.textContent = error.message;
        }

        validateBtn.disabled = false;
        validateBtn.textContent = 'Validate';
    });

    // Transform action
    const transformSection = container.querySelector('.transform-section');
    const transformBtn = transformSection.querySelector('.action-btn');
    const transformTextarea = transformSection.querySelector('.message-textarea');

    // Initialize transform section sample generator dropdowns
    const transformFormatSelect = transformSection.querySelector('.format-select-inline');
    const transformTypeSelect = transformSection.querySelector('.type-select-inline');
    const transformScenarioSelect = transformSection.querySelector('.scenario-select-inline');
    const transformGenerateBtn = transformSection.querySelector('.generate-sample-btn');

    async function updateTransformScenarios() {
        const format = transformFormatSelect.value;
        const messageType = transformTypeSelect.value;
        const data = await loadScenarioData();
        const scenarios = getScenariosForMessageType(data, messageType, format);
        if (scenarios.length > 0) {
            transformScenarioSelect.innerHTML = scenarios.map(s =>
                `<option value="${s.value}">${s.label}</option>`
            ).join('');
        } else {
            transformScenarioSelect.innerHTML = '<option value="">No scenarios</option>';
        }
    }

    async function updateTransformTypes() {
        const format = transformFormatSelect.value;
        const types = format === 'swift-mt' ? swiftMtTypes : iso20022Types;
        transformTypeSelect.innerHTML = types.map(t => `<option value="${t}">${t}</option>`).join('');
        await updateTransformScenarios();
    }

    transformFormatSelect.addEventListener('change', updateTransformTypes);
    transformTypeSelect.addEventListener('change', updateTransformScenarios);
    updateTransformTypes();

    transformGenerateBtn.addEventListener('click', async () => {
        transformGenerateBtn.disabled = true;
        transformGenerateBtn.textContent = 'Generating...';
        try {
            const result = await generateSample(transformTypeSelect.value, transformScenarioSelect.value);
            if (result.success) transformTextarea.value = result.result;
        } catch (e) { /* ignore */ }
        transformGenerateBtn.disabled = false;
        transformGenerateBtn.textContent = 'Generate Sample';
    });

    transformBtn.addEventListener('click', async () => {
        transformBtn.disabled = true;
        transformBtn.textContent = 'Transforming...';
        errorPanel.style.display = 'none';

        try {
            const result = await transformMessage(transformTextarea.value, {
                validation: transformSection.querySelector('.validate-opt').checked
            });

            if (result.success && result.result) {
                // Detect output format and highlight accordingly
                const isXml = result.result.trim().startsWith('<?xml') ||
                             result.result.trim().startsWith('<');
                const highlighted = isXml
                    ? highlightXML(result.result)
                    : highlightSwiftMT(result.result);
                resultDisplay.innerHTML = highlighted;
            } else {
                // Show errors
                const errorsHtml = result.errors?.map(e => `
                    <div class="error-item">
                        <span class="error-code">${e.code || e.error_type}</span>
                        <span class="error-msg">${e.message}</span>
                    </div>
                `).join('') || 'Transformation failed';
                resultDisplay.innerHTML = `<div class="validation-error">
                    <strong>✗ Transformation Failed</strong>
                    ${errorsHtml}
                </div>`;
            }
        } catch (error) {
            errorPanel.style.display = 'block';
            errorPanel.textContent = error.message;
        }

        transformBtn.disabled = false;
        transformBtn.textContent = 'Transform';
    });
}

// Initialize all widgets on page load
function initializeWidgets() {
    // Inject sidebar branding (logo + Plasmatic name)
    injectSidebarBranding();

    // Initialize unified playground (by ID or class)
    // Supports: <div id="reframe-playground"></div>
    //      or: <div class="reframe-playground" data-tab="validate"></div>
    //      or: <div class="reframe-playground" data-tab="transform" data-hide-tabs="true"></div>
    const playgroundById = document.getElementById('reframe-playground');
    if (playgroundById) {
        createFullPlayground(playgroundById);
    }

    // Initialize all class-based playgrounds (for embedding in different pages)
    document.querySelectorAll('.reframe-playground').forEach(container => {
        if (!container.id) { // Skip if already initialized by ID
            createFullPlayground(container);
        }
    });

    // Legacy: Initialize individual widgets (for backward compatibility)
    document.querySelectorAll('.reframe-widget[data-type="generator"]').forEach(createGeneratorWidget);
    document.querySelectorAll('.reframe-widget[data-type="validator"]').forEach(createValidatorWidget);
    document.querySelectorAll('.reframe-widget[data-type="transformer"]').forEach(createTransformerWidget);
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidgets);
} else {
    initializeWidgets();
}
