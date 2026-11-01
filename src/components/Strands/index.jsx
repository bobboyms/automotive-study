import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import styles from '../Simbolos/styles.module.css';

// O wire automotivo em corte: um feixe de fios finos, os strands. À esquerda
// o feixe inteiro; à direita, o mesmo wire depois de um descasque que cortou
// parte dos fios. Os cortados ficam no tom 3, que é o tom do defeito.
//
// A figura ensina duas coisas de uma vez: sobrou menos cobre para conduzir
// (a resistance sobe) e sobrou menos fio para aguentar a vibração (nasce um
// ponto de quebra).

const W = 440;
const H = 246;
const R_STRAND = 10;
const PASSO = 23;
const LINHAS = [4, 5, 5, 4]; // 18 strands: duas linhas são metade exata
const FONTE = 15;

// Posições de um feixe hexagonal de 18 strands, em volta de (0, 0).
const POSICOES = LINHAS.flatMap((n, linha) => {
  const y = (linha - (LINHAS.length - 1) / 2) * PASSO;
  return Array.from({length: n}, (_, i) => ({
    x: (i - (n - 1) / 2) * PASSO,
    y,
    linha,
  }));
});

function Feixe({cx, cy, cortados}) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {/* o isolamento em volta */}
      <circle className={styles.parte} cx={0} cy={0} r={66} />
      {POSICOES.map((p, i) => {
        // "cortados" corta as duas primeiras linhas: 9 dos 18, metade exata
        const cortado = cortados && p.linha < 2;
        return (
          <circle
            key={i}
            className={cortado ? styles.campo : styles.metal}
            cx={p.x}
            cy={p.y}
            r={R_STRAND}
          />
        );
      })}
    </g>
  );
}

export default function Strands({caption}) {
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={
          caption ||
          'Um wire em corte com todos os strands, e o mesmo wire com metade dos strands cortados.'
        }
      >
        <Feixe cx={118} cy={92} />
        <Feixe cx={322} cy={92} cortados />

        <SvgMath x={118} y={188} math="\text{wire inteiro}" fontSize={FONTE} />
        <SvgMath x={322} y={188} math="\text{strands cortados}" fontSize={FONTE} tone={3} />
        <SvgMath x={118} y={216} math="0.02\,\Omega" fontSize={FONTE} />
        <SvgMath x={322} y={216} math="0.04\,\Omega" fontSize={FONTE} tone={3} />
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
