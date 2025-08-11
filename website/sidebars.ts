import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main documentation sidebar
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Reframe Documentation',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'index',
      },
      items: [
        {
          type: 'category',
          label: 'Generate Samples',
          collapsed: false,
          items: [
            'reframe/sample-generator/swift-cbpr-mt',
            'reframe/sample-generator/cbpr-iso20022',
          ],
        },
        {
          type: 'category',
          label: 'Validate Messages',
          collapsed: false,
          items: [
            'reframe/validation-converter/swift-cbpr-mt',
            'reframe/validation-converter/cbpr-iso20022',
          ],
        },
        {
          type: 'category',
          label: 'Transform Messages',
          collapsed: false,
          items: [
            'reframe/message-transformation/mt-to-iso20022',
            'reframe/message-transformation/iso20022-to-mt',
          ],
        },
      ],
    },
  ],
};

export default sidebars;