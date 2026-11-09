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
            {
              type: 'doc',
              id: 'trn-120-eletricidade/prova-pratica',
              label: '9. As seis medições na bancada',
            },
          ],
        },
        {
          type: 'category',
          label: 'Tópico 4 — Componentes do circuit',
          items: [
            {
              type: 'doc',
              id: 'trn-120-eletricidade/eletromagnetismo-e-rele',
              label: '10. Electromagnetism e o relay',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/resistencias-variaveis-e-diodo',
              label: '11. Resistances que mudam e o diode',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/resistor-fixo',
              label: '12. O resistor fixo',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/switches',
              label: '13. Switches',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/protecao-do-circuito',
              label: '14. Circuit protection',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/cargas-bulbs-e-motores',
              label: '15. Loads: bulbs e motores',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/capacitor-e-transformer',
              label: '16. Capacitor e transformer',
            },
          ],
        },
        {
          type: 'category',
          label: 'Tópico 5 — Wiring diagrams',
          items: [
            {
              type: 'doc',
              id: 'trn-120-eletricidade/simbolos-eletricos',
              label: '17. Electrical symbols',
            },
          ],
        },
        {
          type: 'category',
          label: 'Tópico 6 — Ferramentas e reparo',
          items: [
            {
              type: 'doc',
              id: 'trn-120-eletricidade/instrumentos-de-teste',
              label: '18. Outros instrumentos de teste',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/scan-tool-e-osciloscopio',
              label: '19. Scan tool e oscilloscope',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/reparar-um-wire',
              label: '20. Reparar um wire',
            },
          ],
        },
        {
          type: 'category',
          label: 'Tópico 7 — Battery',
          items: [
            {
              type: 'doc',
              id: 'trn-120-eletricidade/seguranca-da-battery',
              label: '21. Segurança com a battery',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/a-battery-por-dentro',
              label: '22. A battery por dentro',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/manutencao-da-battery',
              label: '23. Manutenção da battery',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/jump-start-e-memory-saver',
              label: '24. Jump start e memory saver',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/carregar-a-battery',
              label: '25. Carregar a battery',
            },
          ],
        },
        {
          type: 'category',
          label: 'Tópico 8 — Wiring e wiring repairs',
          items: [
            {
              type: 'doc',
              id: 'trn-120-eletricidade/tipos-de-wire-e-bitola',
              label: '26. Tipos de wire e wire gauge',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/chicote-terminals-e-connectors',
              label: '27. O wiring harness',
            },
          ],
        },
        {
          type: 'category',
          label: 'Tópico 9 — Restraint systems (SRS)',
          items: [
            {
              type: 'doc',
              id: 'trn-120-eletricidade/restraint-system-e-air-bag',
              label: '28. O restraint system',
            },
            {
              type: 'doc',
              id: 'trn-120-eletricidade/sensores-srs-e-servico-seguro',
              label: '29. Sensors do SRS e serviço',
            },
          ],
        },
        {
          type: 'category',
          label: 'Tópico 10 — Relay testing',
          items: [
            {
              type: 'doc',
              id: 'trn-120-eletricidade/testar-relay-com-service-manual',
              label: '30. Testar um relay com o manual',
            },
          ],
        },
        {
          type: 'doc',
          id: 'trn-120-eletricidade/laboratorio-de-circuitos',
          label: 'Laboratório de circuits',
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
          label: 'Fasteners & Torque (aula)',
          link: {
            type: 'doc',
            id: 'aut-116-motor/fixadores-e-torque/index',
          },
          items: [
            {
              type: 'doc',
              id: 'aut-116-motor/fixadores-e-torque/fixadores-e-torque',
              label: 'Fasteners e torque',
            },
          ],
        },
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
        {
          type: 'category',
          label: 'Compression e leakage tests (lab)',
          link: {
            type: 'doc',
            id: 'aut-116-motor/vazamento-do-cilindro/index',
          },
          items: [
            {
              type: 'doc',
              id: 'aut-116-motor/vazamento-do-cilindro/teste-de-compressao',
              label: 'Compression test',
            },
            {
              type: 'doc',
              id: 'aut-116-motor/vazamento-do-cilindro/teste-de-vazamento-do-cilindro',
              label: 'Cylinder leakage test',
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
