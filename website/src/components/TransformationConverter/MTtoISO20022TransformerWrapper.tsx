import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function MTtoISO20022TransformerWrapper() {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        const MTtoISO20022Transformer = require('./MTtoISO20022Transformer').default;
        return <MTtoISO20022Transformer />;
      }}
    </BrowserOnly>
  );
}