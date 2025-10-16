// API Configuration
// This file manages API endpoints for different environments

export const getApiBaseUrl = (): string => {
  // Try to get the API URL from Docusaurus config (build-time configuration)
  // This should be the primary source of the API URL
  try {
    if (typeof window !== 'undefined') {
      // Client-side: try to get from Docusaurus context
      // Note: This only works in React components, not in plain functions
      // For non-component usage, we'll fall back to the default
      const context = (window as any).docusaurus?.customFields;
      if (context?.REFRAME_API_URL) {
        return context.REFRAME_API_URL;
      }
    }
  } catch (e) {
    // Fallback if context is not available
  }
  
  // Fallback - only use localhost default if no build-time config was provided
  // This ensures Docker containers respect the REFRAME_API_URL build arg
  return 'http://localhost:3000';
};

// For use in React components where we can access Docusaurus context
// This function should be called from within a React component
// where useDocusaurusContext can be properly imported and used
export const useApiBaseUrl = (siteConfig?: any): string => {
  try {
    const apiUrl = siteConfig?.customFields?.REFRAME_API_URL as string;
    if (apiUrl) {
      return apiUrl;
    }
  } catch (e) {
    // Fallback if config is not available
  }
  return getApiBaseUrl();
};

export const API_ENDPOINTS = {
  GENERATE_SAMPLE: '/api/generate',
  VALIDATE: '/api/validate',
  TRANSFORM: '/api/transform',
};