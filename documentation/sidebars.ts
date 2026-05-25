import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'quick-start',
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/metrics',
        'api/solvers',
        'api/analyzers',
        'api/autodiff',
      ],
    },
  ],
};

export default sidebars;