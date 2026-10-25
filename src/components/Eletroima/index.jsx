import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import {pontaSeta} from '../Simbolos/desenhos';
import styles from '../Simbolos/styles.module.css';

// O magnetic field da current, em três passos: um wire reto (campo fraco, em
// anéis em volta do wire), o mesmo wire enrolado numa coil (os anéis se somam
// e o campo atravessa a coil de ponta a ponta) e a coil com um iron core
// (campo mais forte, que puxa um pedaço de ferro).
//
//   <Eletroima tipo="fio" caption="..." />
//   <Eletroima tipo="bobina" caption="..." />
//   <Eletroima tipo="nucleo" caption="..." />
//
// Tons: azul (1) é a current; verde (3) é o magnetic field, tracejado. Os
// wires passam por cima das linhas do campo com uma borda da cor do papel,
// para não parecer que se ligam a elas.

const W = 440;
const CY = 105; // eixo do wire e da coil
const XL = 150; // primeira volta da coil
const XR = 290; // última volta
const VOLTAS = 8;
const RY = 32; // meia altura de uma volta

const ROT = {right: 0, down: 90, left: 180, up: 270};
function Seta({x, y, dir, className = styles.seta}) {
  return (
    <path
      className={className}
      d="M -6 -7 L 4 0 L -6 7"
      transform={`translate(${x} ${y}) rotate(${ROT[dir]})`}
    />
  );
}

// wire com borda da cor do papel por baixo
function FioPorCima({d}) {
  return (
    <g>
      <path d={d} style={{fill: 'none', stroke: 'var(--mv-paper)', strokeWidth: 8}} />
      <path d={d} className={styles.fio} />
    </g>
  );
}

// linhas do campo de uma coil: por dentro, da esquerda para a direita; por
// fora, voltando pela direita, em cima e embaixo
function Campo({alturas}) {
  const xl = XL - 22;
  const xr = XR + 22;
  const meio = (XL + XR) / 2;
  return (
    <g>
      <line className={styles.campo} x1={xl} y1={CY} x2={xr} y2={CY} />
      {alturas.flatMap((h) =>
        [-1, 1].map((s) => (
          <path
            key={`${h}${s}`}
            className={styles.campo}
            d={`M ${xr} ${CY} C ${xr + 48} ${CY}, ${xr + 48} ${CY + s * h}, ${meio} ${CY + s * h} C ${xl - 48} ${CY + s * h}, ${xl - 48} ${CY}, ${xl} ${CY}`}
          />
        )),
      )}
      {/* o sentido: por fora, as linhas voltam para a esquerda */}
      {alturas.map((h) => (
        <g key={h}>
          <Seta x={meio - 30} y={CY - h} dir="left" className={styles.campoSeta} />
          <Seta x={meio - 30} y={CY + h} dir="left" className={styles.campoSeta} />
        </g>
      ))}
    </g>
  );
}

function Bobina({nucleo}) {
  const passo = (XR - XL) / (VOLTAS - 1);
  const alturas = nucleo ? [44, 56, 68] : [46, 64];
  const fundo = 202;
  return (
    <g>
      {nucleo && (
        <rect className={styles.nucleo} x={XL - 16} y={CY - 13} width={XR - XL + 32} height={26} rx={2} />
      )}
      <Campo alturas={alturas} />
      {/* as voltas: cada elipse é uma volta do wire em torno do eixo */}
      {Array.from({length: VOLTAS}, (_, i) => (
        <ellipse
          key={i}
          className={styles.fio}
          cx={XL + i * passo}
          cy={CY}
          rx={7}
          ry={RY}
        />
      ))}
      {/* os dois wires que levam a current até a coil */}
      <FioPorCima d={`M ${XL} ${CY + RY} L ${XL} ${fundo}`} />
      <FioPorCima d={`M ${XR} ${CY + RY} L ${XR} ${fundo}`} />
      <Seta x={XL} y={fundo - 14} dir="up" />
      <Seta x={XR} y={fundo - 14} dir="down" />
      <SvgMath x={(XL + XR) / 2} y={fundo - 8} math="\text{current}" fontSize={15} tone={1} />
      <SvgMath x={(XL + XR) / 2} y={CY - alturas[alturas.length - 1] - 20} math="\text{magnetic field}" fontSize={15} tone={3} />
      {nucleo && (
        <g>
          {/* pedaço de ferro puxado pelo eletroímã */}
          <rect className={styles.metal} x={364} y={CY - 19} width={14} height={38} rx={2} />
          <g className={styles.fino}>
            <line x1={406} y1={CY + 36} x2={364} y2={CY + 36} />
            <path d={pontaSeta([406, CY + 36], [364, CY + 36], 7)} />
          </g>
        </g>
      )}
    </g>
  );
}

function FioReto() {
  return (
    <g>
      {[180, 220, 260].map((x) => (
        <ellipse key={x} className={styles.campo} cx={x} cy={CY} rx={9} ry={34} />
      ))}
      <FioPorCima d={`M 40 ${CY} L 400 ${CY}`} />
      <Seta x={84} y={CY} dir="right" />
      <Seta x={356} y={CY} dir="right" />
      <SvgMath x={84} y={CY - 26} math="\text{current}" fontSize={15} tone={1} />
      <SvgMath x={220} y={CY + 58} math="\text{magnetic field}" fontSize={15} tone={3} />
    </g>
  );
}

export default function Eletroima({tipo = 'fio', caption}) {
  const H = tipo === 'fio' ? 182 : 214;
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || 'Magnetic field de uma current.'}
      >
        {tipo === 'fio' ? <FioReto /> : <Bobina nucleo={tipo === 'nucleo'} />}
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
