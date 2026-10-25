import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import styles from '../Simbolos/styles.module.css';

// Como a resistance de um thermistor muda com a temperatura: no NTC ela cai
// quando a peça esquenta; no PTC, sobe. As curvas são só a forma — sem
// números, porque cada sensor tem a sua tabela, que vem do manual.
//
// Tons: azul (1) é o NTC, laranja (2) é o PTC.

const W = 420;
const H = 290;
const X0 = 64; // origem dos eixos
const Y0 = 228;
const X1 = 392;
const Y1 = 36;

export default function CurvaTermistor({caption, mostrar = 'ambos'}) {
  const ntc = mostrar !== 'ptc';
  const ptc = mostrar !== 'ntc';
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || 'Resistance de um thermistor em função da temperatura.'}
      >
        {/* eixos */}
        <g className={styles.eixo}>
          <line x1={X0} y1={Y0} x2={X1} y2={Y0} />
          <line x1={X0} y1={Y0} x2={X0} y2={Y1} />
          <path d={`M ${X1 - 8} ${Y0 - 5} L ${X1} ${Y0} L ${X1 - 8} ${Y0 + 5}`} />
          <path d={`M ${X0 - 5} ${Y1 + 8} L ${X0} ${Y1} L ${X0 + 5} ${Y1 + 8}`} />
        </g>
        <SvgMath x={X0 + 10} y={Y1 - 16} math="\text{resistance}" anchor="start" fontSize={15} />
        <SvgMath x={X0 - 10} y={Y1 + 22} math="\text{alta}" anchor="end" fontSize={13} />
        <SvgMath x={X0 - 10} y={Y0 - 14} math="\text{baixa}" anchor="end" fontSize={13} />
        <SvgMath x={X0 + 22} y={Y0 + 20} math="\text{frio}" fontSize={13} />
        <SvgMath x={X1 - 26} y={Y0 + 20} math="\text{quente}" fontSize={13} />
        <SvgMath x={(X0 + X1) / 2} y={Y0 + 44} math="\text{temperatura}" fontSize={15} />

        {ntc && (
          <g>
            <path className={styles.curva1} d="M 82 56 C 150 150, 230 196, 380 206" />
            <SvgMath x={98} y={46} math="\text{NTC}" anchor="start" fontSize={15} tone={1} />
          </g>
        )}
        {ptc && (
          <g>
            <path className={styles.curva2} d="M 82 204 C 220 198, 300 170, 378 64" />
            <SvgMath x={356} y={56} math="\text{PTC}" anchor="end" fontSize={15} tone={2} />
          </g>
        )}
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
