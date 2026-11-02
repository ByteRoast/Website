import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Byte Roast',
  tagline: 'Roasting byte beans until it brings up working code!',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    faster: true, // Rspack + SWC for faster builds
  },

  // Set the production url of your site here
  url: 'https://byteroast.fr',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'byteroast', // Usually your GitHub org/user name.
  projectName: 'website', // Usually your repo name.

  onBrokenLinks: 'throw',

  headTags: [
    {
      tagName: 'script',
      attributes: {type: 'application/ld+json'},
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://byteroast.fr/#organization',
            name: 'Byte Roast',
            url: 'https://byteroast.fr/',
            logo: 'https://byteroast.fr/img/logo.png',
            sameAs: ['https://github.com/byteroast'],
          },
          {
            '@type': 'WebSite',
            '@id': 'https://byteroast.fr/#website',
            name: 'Byte Roast',
            url: 'https://byteroast.fr/',
            publisher: {'@id': 'https://byteroast.fr/#organization'},
            inLanguage: ['en-US', 'fr-FR', 'de-DE'],
          },
        ],
      }),
    },
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'de'],
    localeConfigs: {
      en: {label: 'English', htmlLang: 'en-US'},
      fr: {label: 'Français', htmlLang: 'fr-FR'},
      de: {label: 'Deutsch', htmlLang: 'de-DE'},
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/byteroast/website/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/byteroast/website/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
          ignorePatterns: ['/tags/**'],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/byteroast-social-card.png',
    metadata: [
      {name: 'keywords', content: 'byte roast, roastgate, nginx, docker, self-hosted, reverse proxy, open source'},
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'theme-color', content: '#EE8A26'},
    ],
    colorMode: {
      respectPrefersColorScheme: true,
      defaultMode: 'light',
    },
    navbar: {
      title: 'Byte Roast',
      logo: {
        alt: 'Byte Roast logo',
        src: 'img/logo.svg',
      },
      items: [
        {to: '/docs', label: 'Docs', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/byteroast',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'More',
          items: [
            {
              label: 'Docs',
              to: '/docs',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/byteroast',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Byte Roast. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  markdown: {
    mermaid: true
  },

  themes: ['@docusaurus/theme-mermaid'],
};

export default config;
