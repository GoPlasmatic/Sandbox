// API Configuration
// This file manages API endpoints for different environments

export const getApiBaseUrl = (): string => {
  // Try to get the API URL from Docusaurus config (build-time configuration)
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
  
  // Default fallback for development
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
  }
  
  // Production fallback - this should ideally be set via REFRAME_API_URL env var
  return 'https://api.reframe.example.com';
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
  GENERATE_SAMPLE: '/generate/sample',
  VALIDATE: '/validate',
  TRANSFORM_MT_TO_MX: '/transform/mt-to-mx',
  TRANSFORM_MX_TO_MT: '/transform/mx-to-mt',
};