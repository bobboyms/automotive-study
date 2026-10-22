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
      label: 'TRN-120 — Basic Transportation Electricity',
      link: {
        type: 'doc',
        id: 'trn-120-eletricidade/index',
      },
      items: [
        {
          type: 'category',
          label: "Tópico 1 — Electrical theory e Ohm's law",
          items: [
            {
              type: 'doc',
              id: 'trn-120-eletricidade/o-que-e-eletricidade',
              label: '1. O que é eletricidade',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/o-circuito-eletrico',
              label: '2. O electrical circuit',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/tensao-corrente-e-resistencia',
              label: '3. Voltage, current e resistance',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/lei-de-ohm',
              label: "4. Ohm's law",
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/potencia-eletrica',
              label: '5. Electrical power',
            },
          ],
        },
        {
          type: 'category',
          label: 'Tópico 2 — Circuit construction',
          items: [
            {
              type: 'doc',
              id: 'trn-120-eletricidade/circuito-em-serie',
              label: '6. Series circuit',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/circuito-em-paralelo',
              label: '7. Parallel circuit',
            },
          ],
        },
        {
          type: 'category',
          label: 'Tópico 3 — Test equipment',
          items: [
            {
              type: 'doc',
              id: 'trn-120-eletricidade/medicoes-com-multimetro',
              label: '8. Medições com o multimeter',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'AUT-116 — Engine Repair',
      link: {
        type: 'doc',
        id: 'aut-116-motor/index',
      },
      items: [
        {
          type: 'category',
          label: 'Cap. 1 — Review of Engine Operation',
          link: {
            type: 'doc',
            id: 'aut-116-motor/funcionamento-do-motor/index',
          },
          items: [
            {
              type: 'doc',
              id: 'aut-116-motor/funcionamento-do-motor/motor-de-combustao-interna',
              label: '1. O motor de combustão interna',
            },
            {
              type: 'doc',
              id: 'aut-116-motor/funcionamento-do-motor/bloco-pistao-biela-e-virabrequim',
              label: '2. Block, piston, rod e crankshaft',
            },
            {
              type: 'doc',
              id: 'aut-116-motor/funcionamento-do-motor/cabecote-e-valvulas',
              label: '3. Cylinder head e valves',
            },
            {
              type: 'doc',
              id: 'aut-116-motor/funcionamento-do-motor/ciclo-de-quatro-tempos',
              label: '4. O four-stroke cycle',
            },
            {
              type: 'doc',
              id: 'aut-116-motor/funcionamento-do-motor/ignicao-partida-e-carga',
              label: '5. Ignition, starting e charging',
            },
            {
              type: 'doc',
              id: 'aut-116-motor/funcionamento-do-motor/arrefecimento-e-lubrificacao',
              label: '6. Cooling e lubrication',
            },
            {
              type: 'doc',
              id: 'aut-116-motor/funcionamento-do-motor/combustivel-computador-e-emissoes',
              label: '7. Fuel, computer e emissions',
            },
            {
              type: 'doc',
              id: 'aut-116-motor/funcionamento-do-motor/trem-de-forca',
              label: '8. Drive train',
            },
          ],
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
