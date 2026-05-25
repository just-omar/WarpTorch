import type {Config} from '@docusaurus/types';
import type {Options as PresetOptions} from '@docusaurus/preset-classic';

const config: Config = {
  title: 'WarpTorch Documentation',
  tagline: 'GPU-accelerated General Relativity toolkit',
  favicon: 'img/favicon.ico',

  url: 'https://just-omar.github.io',
  baseUrl: '/WarpTorch/',

  organizationName: 'just-omar',
  projectName: 'WarpTorch',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/just-omar/WarpTorch/tree/main/documentation/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/just-omar/WarpTorch/tree/main/documentation/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies PresetOptions,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'WarpTorch',
      logo: {
        alt: 'WarpTorch Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: '/team', label: 'Team', position: 'left'},
        {
          href: 'https://github.com/just-omar/WarpTorch',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    authors: {
      omar: {
        name: 'Omar',
        title: 'WarpTorch Developer',
        url: 'https://github.com/just-omar',
        image_url: 'https://github.com/just-omar.png',
        email: 'omar@warptorch.org',
        twitter: 'just_omar',
        linkedin: 'just-omar',
        github: 'just-omar',
      },
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/just-omar/WarpTorch',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/just-omar/WarpTorch',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} WarpTorch. Built with Docusaurus.`,
    },
    prism: {
      additionalLanguages: ['python', 'bash', 'typescript', 'javascript'],
    },
    math: {
      // KaTeX configuration
      katex: {
        version: '0.16.9',
        strict: false,
      },
    },
  },
};

export default config;