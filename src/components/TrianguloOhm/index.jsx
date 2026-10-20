import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import styles from './styles.module.css';

// Triângulo da lei de Ohm: V em cima, I e R embaixo. A linha deitada quer
// dizer “dividido por”, a linha em pé quer dizer “vezes”. Com `cobrir`, o
// desenho vira três triângulos lado a lado, cada um com uma grandeza tapada e,
// embaixo, a forma da lei que sobra à vista.

const CW = 300; // largura de cada triângulo
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
const POS = {V: [150, 80], I: [98, 182], R: [202, 182]};

function Triangulo({dx, rotulos, tapado}) {
  return (
    <g transform={`translate(${dx} 0)`}>
      {tapado && <polygon className={styles.cover} points={REGIOES[tapado]} />}
      <polygon
        className={styles.edge}
        points={`${APEX.join(',')} ${BL.join(',')} ${BR.join(',')}`}
      />
      <line className={styles.edge} x1={ML} y1={MID_Y} x2={MR} y2={MID_Y} />
      <line
        className={styles.edge}
        x1={APEX[0]}
        y1={MID_Y}
        x2={APEX[0]}
        y2={BL[1]}
      />
      {['V', 'I', 'R'].map((k) => (
        <SvgMath
          key={k}
          x={POS[k][0]}
          y={POS[k][1]}
          math={tapado === k ? '?' : rotulos[k]}
          fontSize={40}
          tone={tapado === k ? 2 : undefined}
          space={110}
        />
      ))}
      <SvgMath x={118} y={MID_Y} math="\div" fontSize={24} tone={1} halo />
      <SvgMath x={182} y={MID_Y} math="\div" fontSize={24} tone={1} halo />
      <SvgMath x={150} y={182} math="\times" fontSize={24} tone={1} halo />
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
  const ordem = ['V', 'I', 'R'];
  const W = cobrir ? CW * 3 : CW;
  const H = cobrir ? 290 : 240;

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${cobrir ? 720 : 280}px`}}
        role="img"
        aria-label={caption || 'Triângulo da lei de Ohm.'}
      >
        {cobrir ? (
          ordem.map((k, i) => (
            <g key={k}>
              <Triangulo dx={i * CW} rotulos={r} tapado={k} />
              <SvgMath
                x={i * CW + 150}
                y={264}
                math={formulas[k]}
                fontSize={26}
                space={CW}
              />
            </g>
          ))
        ) : (
          <Triangulo dx={0} rotulos={r} />
        )}
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
