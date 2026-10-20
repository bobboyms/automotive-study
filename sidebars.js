// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  studySidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Roteiro de estudo',
    },
    {
      type: 'category',
      label: 'TRN-120 — Eletricidade básica',
      link: {
        type: 'doc',
        id: 'trn-120-eletricidade/index',
      },
      items: [
        {
          type: 'doc',
          id: 'trn-120-eletricidade/o-que-e-eletricidade',
          label: '1. O que é eletricidade',
        },
        {
          type: 'doc',
          id: 'trn-120-eletricidade/o-circuito-eletrico',
          label: '2. O circuito elétrico',
        },
        {
          type: 'doc',
          id: 'trn-120-eletricidade/tensao-corrente-e-resistencia',
          label: '3. Tensão, corrente e resistência',
        },
        {
          type: 'doc',
          id: 'trn-120-eletricidade/lei-de-ohm',
          label: '4. Lei de Ohm',
        },
        {
          type: 'doc',
          id: 'trn-120-eletricidade/potencia-eletrica',
          label: '5. Potência elétrica',
        },
        {
          type: 'doc',
          id: 'trn-120-eletricidade/circuito-em-serie',
          label: '6. Circuito em série',
        },
        {
          type: 'doc',
          id: 'trn-120-eletricidade/circuito-em-paralelo',
          label: '7. Circuito em paralelo',
        },
      ],
    },
    {
      type: 'doc',
      id: 'glossario',
      label: 'Glossário',
    },
  ],
};

module.exports = sidebars;
