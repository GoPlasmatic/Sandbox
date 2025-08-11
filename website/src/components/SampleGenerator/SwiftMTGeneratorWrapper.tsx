import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const SwiftMTGeneratorWrapper = () => {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        const SwiftMTGenerator = require('./SwiftMTGenerator').default;
        return <SwiftMTGenerator />;
      }}
    </BrowserOnly>
  );
};

export default SwiftMTGeneratorWrapper;