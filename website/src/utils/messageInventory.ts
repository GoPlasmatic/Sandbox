// Utility functions for loading and using message inventory data

export interface Scenario {
  file: string;
  name: string;
  display_name: string;
}

export interface MessageType {
  description: string;
  scenario_count: number;
  scenarios: Scenario[];
}

export interface SwiftMTInventory {
  swift_mt_messages: {
    description: string;
    total_message_types: number;
    total_scenarios: number;
    message_types: Record<string, MessageType>;
  };
}

export interface ISO20022Inventory {
  iso20022_mx_messages: {
    description: string;
    total_message_types: number;
    total_scenarios: number;
    message_types: Record<string, MessageType>;
  };
}

// Cache for loaded inventory data
let swiftMTInventoryCache: SwiftMTInventory | null = null;
let iso20022InventoryCache: ISO20022Inventory | null = null;

/**
 * Load Swift MT inventory data
 */
export async function loadSwiftMTInventory(): Promise<SwiftMTInventory> {
  if (swiftMTInventoryCache) {
    return swiftMTInventoryCache;
  }

  try {
    const response = await fetch('/data/swift_mt_inventory.json');
    if (!response.ok) {
      throw new Error(`Failed to load Swift MT inventory: ${response.statusText}`);
    }
    swiftMTInventoryCache = await response.json();
    return swiftMTInventoryCache!;
  } catch (error) {
    console.error('Error loading Swift MT inventory:', error);
    // Return empty structure as fallback
    return {
      swift_mt_messages: {
        description: 'Swift MT Message Test Scenarios Inventory',
        total_message_types: 0,
        total_scenarios: 0,
        message_types: {}
      }
    };
  }
}

/**
 * Load ISO 20022 inventory data
 */
export async function loadISO20022Inventory(): Promise<ISO20022Inventory> {
  if (iso20022InventoryCache) {
    return iso20022InventoryCache;
  }

  try {
    const response = await fetch('/data/mx_inventory.json');
    if (!response.ok) {
      throw new Error(`Failed to load ISO 20022 inventory: ${response.statusText}`);
    }
    iso20022InventoryCache = await response.json();
    return iso20022InventoryCache!;
  } catch (error) {
    console.error('Error loading ISO 20022 inventory:', error);
    // Return empty structure as fallback
    return {
      iso20022_mx_messages: {
        description: 'ISO 20022 MX Message Test Scenarios Inventory',
        total_message_types: 0,
        total_scenarios: 0,
        message_types: {}
      }
    };
  }
}

/**
 * Get list of Swift MT message types
 */
export async function getSwiftMTMessageTypes(): Promise<string[]> {
  const inventory = await loadSwiftMTInventory();
  return Object.keys(inventory.swift_mt_messages.message_types).sort();
}

/**
 * Get list of ISO 20022 message types
 */
export async function getISO20022MessageTypes(): Promise<string[]> {
  const inventory = await loadISO20022Inventory();
  return Object.keys(inventory.iso20022_mx_messages.message_types).sort();
}

/**
 * Get scenarios for a specific Swift MT message type
 */
export async function getSwiftMTScenarios(messageType: string): Promise<Scenario[]> {
  const inventory = await loadSwiftMTInventory();
  const msgType = inventory.swift_mt_messages.message_types[messageType];
  return msgType ? msgType.scenarios : [];
}

/**
 * Get scenarios for a specific ISO 20022 message type
 */
export async function getISO20022Scenarios(messageType: string): Promise<Scenario[]> {
  const inventory = await loadISO20022Inventory();
  const msgType = inventory.iso20022_mx_messages.message_types[messageType];
  return msgType ? msgType.scenarios : [];
}

/**
 * Get description for a Swift MT message type
 */
export async function getSwiftMTDescription(messageType: string): Promise<string> {
  const inventory = await loadSwiftMTInventory();
  const msgType = inventory.swift_mt_messages.message_types[messageType];
  return msgType ? msgType.description : '';
}

/**
 * Get description for an ISO 20022 message type
 */
export async function getISO20022Description(messageType: string): Promise<string> {
  const inventory = await loadISO20022Inventory();
  const msgType = inventory.iso20022_mx_messages.message_types[messageType];
  return msgType ? msgType.description : '';
}

/**
 * Convert scenario name to API-compatible format (lowercase without extension)
 */
export function getScenarioApiName(scenario: Scenario): string {
  return scenario.name;
}

/**
 * Get display name for a scenario
 */
export function getScenarioDisplayName(scenario: Scenario): string {
  return scenario.display_name;
}