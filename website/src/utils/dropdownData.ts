// Simplified utility for loading dropdown data

export interface DropdownOption {
  value: string;
  label: string;
}

export interface MessageTypeOption extends DropdownOption {
  description?: string;
}

export interface SwiftMTDropdownData {
  messageTypes: MessageTypeOption[];
  scenariosByType: Record<string, DropdownOption[]>;
  totalTypes: number;
  totalScenarios: number;
}

export interface MXDropdownData {
  messageTypes: MessageTypeOption[];
  scenariosByType: Record<string, DropdownOption[]>;
  totalTypes: number;
  totalScenarios: number;
}

export interface ReframeDropdownData {
  transformationTypes: MessageTypeOption[];
  scenariosByType: Record<string, DropdownOption[]>;
  totalTypes: number;
  totalScenarios: number;
}

// Cache for loaded data
let swiftMTCache: SwiftMTDropdownData | null = null;
let mxCache: MXDropdownData | null = null;
let reframeCache: ReframeDropdownData | null = null;

/**
 * Load Swift MT dropdown data
 */
export async function loadSwiftMTDropdown(): Promise<SwiftMTDropdownData> {
  if (swiftMTCache) {
    return swiftMTCache;
  }

  try {
    const response = await fetch('/data/swift_mt_dropdown.json');
    if (!response.ok) {
      throw new Error(`Failed to load Swift MT dropdown data: ${response.statusText}`);
    }
    swiftMTCache = await response.json();
    return swiftMTCache!;
  } catch (error) {
    console.error('Error loading Swift MT dropdown data:', error);
    // Return empty structure as fallback
    return {
      messageTypes: [],
      scenariosByType: {},
      totalTypes: 0,
      totalScenarios: 0
    };
  }
}

/**
 * Load ISO 20022 MX dropdown data
 */
export async function loadMXDropdown(): Promise<MXDropdownData> {
  if (mxCache) {
    return mxCache;
  }

  try {
    const response = await fetch('/data/mx_dropdown.json');
    if (!response.ok) {
      throw new Error(`Failed to load MX dropdown data: ${response.statusText}`);
    }
    mxCache = await response.json();
    return mxCache!;
  } catch (error) {
    console.error('Error loading MX dropdown data:', error);
    // Return empty structure as fallback
    return {
      messageTypes: [],
      scenariosByType: {},
      totalTypes: 0,
      totalScenarios: 0
    };
  }
}

/**
 * Get Swift MT message types for dropdown
 */
export async function getSwiftMTMessageTypes(): Promise<MessageTypeOption[]> {
  const data = await loadSwiftMTDropdown();
  return data.messageTypes;
}

/**
 * Get ISO 20022 MX message types for dropdown
 */
export async function getMXMessageTypes(): Promise<MessageTypeOption[]> {
  const data = await loadMXDropdown();
  return data.messageTypes;
}

/**
 * Get scenarios for a specific Swift MT message type
 */
export async function getSwiftMTScenarios(messageType: string): Promise<DropdownOption[]> {
  const data = await loadSwiftMTDropdown();
  return data.scenariosByType[messageType] || [];
}

/**
 * Get scenarios for a specific ISO 20022 MX message type
 */
export async function getMXScenarios(messageType: string): Promise<DropdownOption[]> {
  const data = await loadMXDropdown();
  return data.scenariosByType[messageType] || [];
}

/**
 * Get description for a Swift MT message type
 */
export async function getSwiftMTDescription(messageType: string): Promise<string | undefined> {
  const data = await loadSwiftMTDropdown();
  const msgType = data.messageTypes.find(mt => mt.value === messageType);
  return msgType?.description;
}

/**
 * Get description for an ISO 20022 MX message type
 */
export async function getMXDescription(messageType: string): Promise<string | undefined> {
  const data = await loadMXDropdown();
  const msgType = data.messageTypes.find(mt => mt.value === messageType);
  return msgType?.description;
}

/**
 * Load Reframe transformation dropdown data
 */
export async function loadReframeDropdown(): Promise<ReframeDropdownData> {
  if (reframeCache) {
    return reframeCache;
  }

  try {
    const response = await fetch('/data/reframe_dropdown.json');
    if (!response.ok) {
      throw new Error(`Failed to load Reframe dropdown data: ${response.statusText}`);
    }
    reframeCache = await response.json();
    return reframeCache!;
  } catch (error) {
    console.error('Error loading Reframe dropdown data:', error);
    // Return empty structure as fallback
    return {
      transformationTypes: [],
      scenariosByType: {},
      totalTypes: 0,
      totalScenarios: 0
    };
  }
}

/**
 * Get Reframe transformation types for dropdown
 */
export async function getReframeTransformationTypes(): Promise<MessageTypeOption[]> {
  const data = await loadReframeDropdown();
  return data.transformationTypes;
}

/**
 * Get scenarios for a specific Reframe transformation type
 */
export async function getReframeScenarios(transformationType: string): Promise<DropdownOption[]> {
  const data = await loadReframeDropdown();
  return data.scenariosByType[transformationType] || [];
}

/**
 * Get description for a Reframe transformation type
 */
export async function getReframeDescription(transformationType: string): Promise<string | undefined> {
  const data = await loadReframeDropdown();
  const transType = data.transformationTypes.find(tt => tt.value === transformationType);
  return transType?.description;
}