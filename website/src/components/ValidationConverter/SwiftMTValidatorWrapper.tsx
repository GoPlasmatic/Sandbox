import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const SwiftMTValidatorWrapper: React.FC = () => {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        const SwiftMTValidator = require('./SwiftMTValidator').default;
        return <SwiftMTValidator />;
      }}
    </BrowserOnly>
  );
};

export default SwiftMTValidatorWrapper;