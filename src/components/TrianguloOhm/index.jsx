import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import styles from './styles.module.css';

// Triângulo da lei de Ohm: V em cima, I e R embaixo. A linha deitada quer
// dizer “dividido por”, a linha em pé quer dizer “vezes”. Com `cobrir`, o
// desenho vira três triângulos, cada um com uma grandeza tapada e, embaixo, a
// forma da lei que sobra à vista.
//
// Os sinais ficam em selos — um círculo com borda — pousados sobre a linha que
// eles explicam. Um sinal solto em cima da linha, com fundo para ficar legível,
// apagava pedaços da própria linha (foi o defeito da primeira versão).
//
// Com `cobrir`, cada triângulo é um SVG separado num contêiner que quebra
// linha: no celular eles descem em vez de encolher até ficarem ilegíveis.

const CW = 300; // largura de um triângulo
const APEX = [150, 16];
const BL = [20, 226];
const BR = [280, 226];
const MID_Y = 124; // linha deitada
// Onde a linha deitada encontra os lados inclinados.
const edgeX = (y) => ((APEX[0] - BL[0]) * (y - APEX[1])) / (BL[1] - APEX[1]);
const ML = APEX[0] - edgeX(MID_Y);
const MR = APEX[0] + edgeX(MID_Y);

const REGIOES = {
  V: `${APEX[0]},${APEX[1]} ${ML},${MID_Y} ${MR},${MID_Y}`,
  I: `${ML},${MID_Y} ${APEX[0]},${MID_Y} ${APEX[0]},${BL[1]} ${BL[0]},${BL[1]}`,
  R: `${APEX[0]},${MID_Y} ${MR},${MID_Y} ${BR[0]},${BR[1]} ${APEX[0]},${BR[1]}`,
};
const POS = {V: [150, 80], I: [92, 182], R: [208, 182]};
// Selos: dois na linha deitada (um de cada lado do encontro com a linha em
// pé) e um na linha em pé, entre o I e o R.
const SELOS = [
  {x: (ML + APEX[0]) / 2, y: MID_Y, sinal: '\\div'},
  {x: (APEX[0] + MR) / 2, y: MID_Y, sinal: '\\div'},
  {x: APEX[0], y: 182, sinal: '\\times'},
];

function Selo({x, y, sinal}) {
  return (
    <g>
      <circle className={styles.badge} cx={x} cy={y} r={14} />
      <SvgMath x={x} y={y} math={sinal} fontSize={20} tone={1} />
    </g>
  );
}

function Triangulo({rotulos, tapado}) {
  return (
    <g>
      {tapado && <polygon className={styles.cover} points={REGIOES[tapado]} />}
      <polygon
        className={styles.edge}
        points={`${APEX.join(',')} ${BL.join(',')} ${BR.join(',')}`}
      />
      <line className={styles.edge} x1={ML} y1={MID_Y} x2={MR} y2={MID_Y} />
      <line className={styles.edge} x1={APEX[0]} y1={MID_Y} x2={APEX[0]} y2={BL[1]} />
      {['V', 'I', 'R'].map((k) => (
        <SvgMath
          key={k}
          x={POS[k][0]}
          y={POS[k][1]}
          math={tapado === k ? '?' : rotulos[k]}
          fontSize={40}
          tone={tapado === k ? 2 : undefined}
        />
      ))}
      {SELOS.map((s) => (
        <Selo key={`${s.x}-${s.y}`} {...s} />
      ))}
    </g>
  );
}

export default function TrianguloOhm({unidades = false, cobrir = false, caption}) {
  const r = unidades
    ? {V: '\\text{V}', I: '\\text{A}', R: '\\Omega'}
    : {V: 'V', I: 'I', R: 'R'};
  const formulas = {
    V: `${r.V} = ${r.I} \\times ${r.R}`,
    I: `${r.I} = ${r.V} \\div ${r.R}`,
    R: `${r.R} = ${r.V} \\div ${r.I}`,
  };

  if (!cobrir) {
    return (
      <figure className={styles.figure}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${CW} 240`}
          style={{maxWidth: '280px'}}
          role="img"
          aria-label={caption || 'Triângulo da lei de Ohm.'}
        >
          <Triangulo rotulos={r} />
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
    );
  }

  return (
    <figure className={styles.figure}>
      <div className={styles.row} role="img" aria-label={caption || 'As três leituras do triângulo.'}>
        {['V', 'I', 'R'].map((k) => (
          <svg key={k} className={styles.item} viewBox={`0 0 ${CW} 290`}>
            <Triangulo rotulos={r} tapado={k} />
            <SvgMath x={150} y={266} math={formulas[k]} fontSize={30} />
          </svg>
        ))}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
