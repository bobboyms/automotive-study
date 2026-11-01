import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import styles from '../Simbolos/styles.module.css';

// O mesmo ponto de teste, medido por dois instrumentos: o digital multimeter,
// que quase não puxa current, e a test light, que puxa uma current de
// verdade. É a ideia central da lição de instrumentos de teste — o
// instrumento escolhido muda o que o circuit faz, e por isso muda a resposta.
//
// Tom 2 (laranja) só na test light, que é a que carrega o circuit; o resto
// fica na cor do texto.

const W = 460;
const H = 286;

const Y_FIO = 46; // o wire do ponto de teste
const Y_CAIXA = 112; // topo dos instrumentos
const Y_MASSA = 196;
const X_DMM = 128;
const X_LUZ = 332;

const FONTE = 15;

function Massa({x, y}) {
  return (
    <g className={styles.fio}>
      <line x1={x - 16} y1={y} x2={x + 16} y2={y} />
      <line x1={x - 10} y1={y + 6} x2={x + 10} y2={y + 6} />
      <line x1={x - 4} y1={y + 12} x2={x + 4} y2={y + 12} />
    </g>
  );
}

export default function Instrumentos({caption}) {
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={
          caption ||
          'O mesmo ponto de teste medido por um multimeter e por uma test light, com a current que cada um puxa.'
        }
      >
        {/* o wire do ponto de teste */}
        <g className={styles.fio}>
          <line x1={28} y1={Y_FIO} x2={432} y2={Y_FIO} />
          <line x1={X_DMM} y1={Y_FIO} x2={X_DMM} y2={Y_CAIXA} />
          <line x1={X_LUZ} y1={Y_FIO} x2={X_LUZ} y2={Y_CAIXA - 4} />
        </g>
        <circle className={styles.contato} cx={X_DMM} cy={Y_FIO} r={3.4} />
        <circle className={styles.contato} cx={X_LUZ} cy={Y_FIO} r={3.4} />
        <SvgMath x={28} y={Y_FIO - 14} math="\text{ponto de teste}" anchor="start" fontSize={FONTE} />

        {/* multimeter: a caixa com o visor */}
        <rect className={styles.parte} x={X_DMM - 42} y={Y_CAIXA} width={84} height={58} rx={6} />
        <rect className={styles.metal} x={X_DMM - 30} y={Y_CAIXA + 10} width={60} height={20} rx={3} />
        <line
          className={styles.fio}
          x1={X_DMM}
          y1={Y_CAIXA + 58}
          x2={X_DMM}
          y2={Y_MASSA}
        />
        <Massa x={X_DMM} y={Y_MASSA} />
        <SvgMath x={X_DMM} y={Y_MASSA + 42} math="\text{multimeter}" fontSize={FONTE} />
        <SvgMath x={X_DMM} y={Y_MASSA + 68} math="1.2\,\mu\text{A}" fontSize={FONTE} />

        {/* test light: a bulb */}
        <g className={styles.lampada}>
          <circle cx={X_LUZ} cy={Y_CAIXA + 16} r={20} />
        </g>
        <g className={styles.fio}>
          <line x1={X_LUZ - 14} y1={Y_CAIXA + 2} x2={X_LUZ + 14} y2={Y_CAIXA + 30} />
          <line x1={X_LUZ + 14} y1={Y_CAIXA + 2} x2={X_LUZ - 14} y2={Y_CAIXA + 30} />
          <line x1={X_LUZ} y1={Y_CAIXA + 36} x2={X_LUZ} y2={Y_MASSA} />
        </g>
        <Massa x={X_LUZ} y={Y_MASSA} />
        <SvgMath x={X_LUZ} y={Y_MASSA + 42} math="\text{test light}" fontSize={FONTE} tone={2} />
        <SvgMath x={X_LUZ} y={Y_MASSA + 68} math="0.25\,\text{A}" fontSize={FONTE} tone={2} />
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
