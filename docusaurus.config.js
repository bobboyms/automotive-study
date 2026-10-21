// @ts-check

const remarkMath = require('remark-math').default;
const rehypeKatex = require('rehype-katex').default;
const remarkTermos = require('./src/plugins/remark-termos');
const remarkFigurasLivro = require('./src/plugins/remark-figuras-livro');

// Figuras do livro salvas pelo aluno em material/livro/ (fora do git). Só o
// servidor local (`npm run start`) as serve, em /livro/1-13.png; o build — o
// site publicado — nunca as inclui, porque o livro tem direitos autorais.
const DEV = process.env.NODE_ENV !== 'production';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Automotive Study',
  tagline:
    'Estudo do programa Automotive Systems Technology da Wake Tech, em português e com os termos em inglês.',
  favicon: 'img/favicon.svg',

  url: 'https://bobboyms.github.io',
  baseUrl: '/automotive-study/',
  organizationName: 'bobboyms',
  projectName: 'automotive-study',

  onBrokenLinks: 'throw',

  staticDirectories: DEV ? ['static', 'material'] : ['static'],

  customFields: {figurasLocais: DEV},

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          remarkPlugins: [remarkMath, remarkFigurasLivro, remarkTermos],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Automotive Study',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'studySidebar',
            position: 'left',
            label: 'Estudos',
          },
        ],
      },
      footer: {
        style: 'light',
        copyright: `Automotive Study — ${new Date().getFullYear()}`,
      },
    }),
};

module.exports = config;
