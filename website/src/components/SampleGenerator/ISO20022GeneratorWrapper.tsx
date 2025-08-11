import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const ISO20022GeneratorWrapper = () => {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        const ISO20022Generator = require('./ISO20022Generator').default;
        return <ISO20022Generator />;
      }}
    </BrowserOnly>
  );
};

export default ISO20022GeneratorWrapper;