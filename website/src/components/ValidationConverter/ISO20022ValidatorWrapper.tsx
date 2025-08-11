import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const ISO20022ValidatorWrapper: React.FC = () => {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        const ISO20022Validator = require('./ISO20022Validator').default;
        return <ISO20022Validator />;
      }}
    </BrowserOnly>
  );
};

export default ISO20022ValidatorWrapper;