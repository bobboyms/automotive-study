import React from 'react';

// Rótulo de figura com um termo técnico em inglês. Clicável: o balão de
// `src/theme/Root.js` mostra o português, igual ao termo no texto.
//
//   k       chave do termo em src/data/termos.json (o `en`)
//   texto   o que aparece escrito (padrão: k). `\n` quebra a linha.
//   x, y    ponto de referência do texto (meio da primeira linha)
//   anchor  'start' | 'middle' | 'end'
//   para    [x, y] — ponta da linha de chamada, na peça
//   de      [x, y] — começo da linha de chamada (padrão: ao lado do texto)
//   fs      tamanho da fonte
//
// Sem `k`, o rótulo é texto comum, sem clique.
export default function RotuloTermo({
  k,
  texto,
  x,
  y,
  anchor = 'start',
  para,
  de,
  fs = 15,
  tone,
}) {
  const linhas = String(texto ?? k).split('\n');
  const altura = fs * 1.15;
  let inicio = de;
  if (para && !inicio) {
    const meio = y + ((linhas.length - 1) * altura) / 2;
    if (anchor === 'end') inicio = [x + 4, meio];
    else if (anchor === 'start') inicio = [x - 4, meio];
    else inicio = [x, para[1] > y ? y + (linhas.length - 1) * altura + fs * 0.55 : y - fs * 0.85];
  }
  const cor = tone ? `var(--mv-tone-${tone})` : 'var(--ifm-font-color-base)';
  return (
    <g>
      {para && (
        <g style={{stroke: 'var(--ifm-font-color-base)', strokeWidth: 1, fill: 'none'}}>
          <line x1={inicio[0]} y1={inicio[1]} x2={para[0]} y2={para[1]} />
          <circle cx={para[0]} cy={para[1]} r={2} style={{fill: 'var(--ifm-font-color-base)', stroke: 'none'}} />
        </g>
      )}
      <text
        x={x}
        y={y + fs * 0.34}
        textAnchor={anchor}
        fontSize={fs}
        data-termo={k}
        tabIndex={k ? 0 : undefined}
        role={k ? 'button' : undefined}
        aria-label={k ? `${linhas.join(' ')} — ver em português` : undefined}
        style={{
          fill: cor,
          fontFamily: 'var(--ifm-font-family-base)',
          cursor: k ? 'pointer' : undefined,
          textDecoration: k ? 'underline dotted' : undefined,
          textDecorationColor: k ? 'var(--ifm-color-primary)' : undefined,
          // contorno na cor do papel: o texto continua legível quando passa
          // sobre um traço do desenho
          stroke: 'var(--mv-paper)',
          strokeWidth: fs * 0.22,
          strokeLinejoin: 'round',
          paintOrder: 'stroke',
        }}
      >
        {linhas.map((l, i) => (
          <tspan key={i} x={x} dy={i === 0 ? 0 : altura}>
            {l}
          </tspan>
        ))}
      </text>
    </g>
  );
}
