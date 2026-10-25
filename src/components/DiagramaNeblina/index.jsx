import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import RotuloTermo from '../diagramas/RotuloTermo';
import {Peca, Massa, Rele} from '../Simbolos/desenhos';
import styles from '../Simbolos/styles.module.css';

// Wiring diagram das fog lamps, no jeito dos manuais: power em cima, ground
// embaixo, cada wire com a cor, cada splice, connector e ground com o código.
// Usado na lição Electrical symbols para ler um diagram inteiro. Cores de
// wire, códigos e a amperagem do fuse são ilustrativos.
//
//   <DiagramaNeblina caption="..." />
//
// Tons: laranja (2) é a load (as fog lamps).

const FS = 13; // códigos e cores dos wires
const FS_NOME = 18; // nomes das peças, como nos outros desenhos

function Conector({x, y, nome, pino}) {
  return (
    <g>
      <g className={styles.fio}>
        <path d={`M ${x - 8} ${y - 7} Q ${x} ${y + 1} ${x + 8} ${y - 7}`} />
        <path d={`M ${x - 8} ${y + 7} Q ${x} ${y - 1} ${x + 8} ${y + 7}`} />
      </g>
      <SvgMath x={x - 14} y={y} math={`\\text{${nome}}`} anchor="end" fontSize={FS} />
      <SvgMath x={x + 14} y={y} math={pino} anchor="start" fontSize={FS} />
    </g>
  );
}

function Lampada({x, lado}) {
  return (
    <g>
      <g className={styles.fio}>
        <line x1={x} y1={396} x2={x} y2={409} />
        <line x1={x} y1={423} x2={x} y2={426} />
        <line x1={x} y1={486} x2={x} y2={506} />
      </g>
      <Conector x={x} y={416} nome={lado === 'LH' ? 'C101' : 'C102'} pino="1" />
      <Peca tipo="lampada" x={x} y={456} rot={90} />
      <RotuloTermo k="fog lamp" texto={`fog lamp\n${lado}`} x={x - 26} y={448} anchor="end" fs={FS_NOME} tone={2} />
      <Massa x={x} y={506} />
      <SvgMath x={x} y={530} math={`\\text{${lado === 'LH' ? 'G101' : 'G102'}}`} fontSize={FS} />
    </g>
  );
}

export default function DiagramaNeblina({caption}) {
  const W = 470;
  const H = 546;
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || 'Wiring diagram das fog lamps.'}
      >
        {/* fuse block: tracejado porque só o fuse F12 aparece nesta página */}
        <rect className={styles.tracejado} x={226} y={26} width={176} height={94} rx={4} />
        <SvgMath x={236} y={42} math="\text{fuse block}" anchor="start" fontSize={15} />
        <SvgMath x={330} y={12} math="\text{B+}" fontSize={FS} />
        <Peca tipo="fusivelS" x={330} y={80} rot={90} />
        <SvgMath x={346} y={70} math="\text{F12}" anchor="start" fontSize={FS} />
        <SvgMath x={346} y={90} math="15\,\text{A}" anchor="start" fontSize={FS} />

        <g className={styles.fio}>
          <line x1={330} y1={24} x2={330} y2={50} />
          <line x1={330} y1={110} x2={330} y2={246} />
          {/* S100 → switch */}
          <line x1={330} y1={140} x2={150} y2={140} />
          <line x1={150} y1={140} x2={150} y2={161} />
          {/* switch → coil */}
          <line x1={150} y1={221} x2={150} y2={234} />
          <line x1={150} y1={234} x2={250} y2={234} />
          <line x1={250} y1={234} x2={250} y2={246} />
          {/* coil → ground */}
          <line x1={250} y1={334} x2={250} y2={356} />
          {/* 87 → S101 → fog lamps */}
          <line x1={330} y1={334} x2={330} y2={396} />
          <line x1={190} y1={396} x2={410} y2={396} />
        </g>
        <circle className={styles.ponto} cx={330} cy={140} r={4.5} />
        <circle className={styles.ponto} cx={330} cy={396} r={4.5} />
        <SvgMath x={344} y={150} math="\text{S100}" anchor="start" fontSize={FS} />
        <SvgMath x={344} y={380} math="\text{S101}" anchor="start" fontSize={FS} />

        {/* cores dos wires */}
        <SvgMath x={240} y={128} math="\text{RED}" fontSize={FS} />
        <SvgMath x={344} y={196} math="\text{RED}" anchor="start" fontSize={FS} />
        <SvgMath x={200} y={222} math="\text{GRN}" fontSize={FS} />
        <SvgMath x={262} y={346} math="\text{BLK}" anchor="start" fontSize={FS} />
        <SvgMath x={344} y={356} math="\text{GRN/RED}" anchor="start" fontSize={FS} />

        {/* fog lamp switch: caixa contínua, componente completo */}
        <rect className={styles.fino} x={118} y={166} width={64} height={50} rx={3} />
        <Peca tipo="interruptor" x={150} y={191} rot={90} />
        <RotuloTermo k="fog lamp switch" texto={'fog lamp\nswitch'} x={110} y={182} anchor="end" fs={FS_NOME} />

        <Rele x={290} y={290} dx={40} />
        <SvgMath x={290} y={248} math="\text{relay}" fontSize={15} />
        <Massa x={250} y={356} />
        <SvgMath x={228} y={362} math="\text{G100}" anchor="end" fontSize={FS} />

        <Lampada x={190} lado="LH" />
        <Lampada x={410} lado="RH" />
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
