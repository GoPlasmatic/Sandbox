import { CSSProperties } from 'react';

// Common container styles
export const containerStyle: CSSProperties = {
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  padding: '16px 0',
};

// Form/card container with consistent shadow and padding
export const cardContainerStyle: CSSProperties = {
  backgroundColor: 'var(--ifm-color-emphasis-100)',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

// Section header style
export const sectionHeaderStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: '20px',
  fontSize: '24px',
  fontWeight: '600',
  color: 'var(--ifm-font-color-base)',
};

// Form grid layout
export const formGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px',
  marginBottom: '20px',
};

// Label style
export const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '600',
  fontSize: '14px',
  color: 'var(--ifm-color-emphasis-800)',
};

// Select/dropdown style
export const selectStyle: CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid var(--ifm-color-emphasis-300)',
  backgroundColor: 'var(--ifm-background-color)',
  color: 'var(--ifm-font-color-base)',
  fontSize: '15px',
  fontWeight: '400',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  outline: 'none',
};

// Primary button style
export const primaryButtonStyle: CSSProperties = {
  padding: '12px 24px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: 'var(--ifm-color-primary)',
  color: 'white',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '15px',
  transition: 'all 0.2s ease',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

// Secondary button style
export const secondaryButtonStyle: CSSProperties = {
  padding: '10px 20px',
  borderRadius: '8px',
  border: '1px solid var(--ifm-color-primary)',
  backgroundColor: 'transparent',
  color: 'var(--ifm-color-primary)',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'all 0.2s ease',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
};

// Small utility button style
export const utilityButtonStyle: CSSProperties = {
  padding: '8px 16px',
  borderRadius: '6px',
  border: '1px solid var(--ifm-color-emphasis-400)',
  backgroundColor: 'transparent',
  color: 'var(--ifm-color-emphasis-700)',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.2s ease',
};

// Textarea style
export const textareaStyle: CSSProperties = {
  width: '100%',
  minHeight: '280px',
  padding: '14px',
  fontFamily: 'var(--ifm-font-family-monospace)',
  fontSize: '13px',
  lineHeight: '1.5',
  borderRadius: '8px',
  border: '1px solid var(--ifm-color-emphasis-300)',
  backgroundColor: 'var(--ifm-background-color)',
  color: 'var(--ifm-font-color-base)',
  resize: 'vertical',
  transition: 'all 0.2s ease',
  outline: 'none',
};

// Result container style
export const resultContainerStyle: CSSProperties = {
  backgroundColor: 'var(--ifm-color-emphasis-100)',
  borderRadius: '12px',
  padding: '24px',
  minHeight: '400px',
};

// Tab button style generator
export const tabStyle = (isActive: boolean): CSSProperties => ({
  padding: '10px 20px',
  backgroundColor: isActive ? 'var(--ifm-color-primary)' : 'transparent',
  color: isActive ? 'white' : 'var(--ifm-color-emphasis-700)',
  border: isActive ? 'none' : '1px solid var(--ifm-color-emphasis-300)',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  transition: 'all 0.2s ease',
});

// Checkbox container style
export const checkboxContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px',
  backgroundColor: 'var(--ifm-color-emphasis-200)',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};

// Empty state style
export const emptyStateStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '350px',
  color: 'var(--ifm-color-emphasis-600)',
  textAlign: 'center',
  padding: '40px 20px',
};

// Success message style
export const successMessageStyle: CSSProperties = {
  padding: '16px 20px',
  backgroundColor: 'var(--ifm-color-success-lightest)',
  borderRadius: '8px',
  border: '1px solid var(--ifm-color-success-light)',
  color: 'var(--ifm-color-success-darkest)',
};

// Error message style
export const errorMessageStyle: CSSProperties = {
  padding: '16px 20px',
  backgroundColor: 'var(--ifm-color-danger-lightest)',
  borderRadius: '8px',
  border: '1px solid var(--ifm-color-danger-light)',
  color: 'var(--ifm-color-danger-darker)',
};

// Warning message style
export const warningMessageStyle: CSSProperties = {
  padding: '16px 20px',
  backgroundColor: 'var(--ifm-color-warning-lightest)',
  borderRadius: '8px',
  border: '1px solid var(--ifm-color-warning-light)',
  color: 'var(--ifm-color-warning-darkest)',
};

// API details summary style
export const apiDetailsSummaryStyle: CSSProperties = {
  cursor: 'pointer',
  fontWeight: '600',
  padding: '14px 18px',
  backgroundColor: 'var(--ifm-color-emphasis-200)',
  borderRadius: '8px',
  userSelect: 'none',
  transition: 'background-color 0.2s ease',
};

// Header with actions container
export const headerWithActionsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  flexWrap: 'wrap',
  gap: '12px',
};

// Button group style
export const buttonGroupStyle: CSSProperties = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
};

// Hover effects for interactive elements
export const hoverEffects = {
  select: {
    onMouseEnter: (e: React.MouseEvent<HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
      e.currentTarget.style.boxShadow = '0 0 0 2px var(--ifm-color-primary-lightest)';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-300)';
      e.currentTarget.style.boxShadow = 'none';
    },
    onFocus: (e: React.FocusEvent<HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
      e.currentTarget.style.boxShadow = '0 0 0 2px var(--ifm-color-primary-lightest)';
    },
    onBlur: (e: React.FocusEvent<HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-300)';
      e.currentTarget.style.boxShadow = 'none';
    },
  },
  textarea: {
    onFocus: (e: React.FocusEvent<HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
      e.currentTarget.style.boxShadow = '0 0 0 2px var(--ifm-color-primary-lightest)';
    },
    onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-300)';
      e.currentTarget.style.boxShadow = 'none';
    },
  },
  primaryButton: {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!e.currentTarget.disabled) {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    },
  },
  secondaryButton: {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!e.currentTarget.disabled) {
        e.currentTarget.style.backgroundColor = 'var(--ifm-color-primary-lightest)';
        e.currentTarget.style.borderColor = 'var(--ifm-color-primary-dark)';
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
    },
  },
  utilityButton: {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = 'var(--ifm-color-emphasis-200)';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = 'transparent';
    },
  },
  checkbox: {
    onMouseEnter: (e: React.MouseEvent<HTMLLabelElement>) => {
      e.currentTarget.style.backgroundColor = 'var(--ifm-color-emphasis-300)';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLLabelElement>) => {
      e.currentTarget.style.backgroundColor = 'var(--ifm-color-emphasis-200)';
    },
  },
  tab: {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>, isActive: boolean) => {
      if (!isActive) {
        e.currentTarget.style.backgroundColor = 'var(--ifm-color-emphasis-200)';
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>, isActive: boolean) => {
      if (!isActive) {
        e.currentTarget.style.backgroundColor = 'transparent';
      }
    },
  },
};

// Disabled button style modifier
export const disabledButtonStyle: CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
};

// Icon styles for consistency
export const iconStyle: CSSProperties = {
  fontSize: '48px',
  marginBottom: '16px',
  opacity: 0.8,
};

// Consistent spacing
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};