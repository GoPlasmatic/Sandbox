import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function ISO20022toMTTransformerWrapper() {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        const ISO20022toMTTransformer = require('./ISO20022toMTTransformer').default;
        return <ISO20022toMTTransformer />;
      }}
    </BrowserOnly>
  );
}