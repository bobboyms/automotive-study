import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import {Figura, styles} from '../diagramas/util';

// A connecting rod desmontada, de frente: small end com a bushing, a haste, o
// big end, as duas metades da rod bearing, a rod cap e os rod bolts, e o
// piston pin ao lado. As linhas tracejadas mostram como as peças se encaixam.
// Tom 2 (laranja): as rod bearings e a bushing, as superfícies em que algo gira.

const X = 230;
const PE = 74; // centro do small end
const BE = 296; // centro do big end (metade de cima)
const CAP = 352; // centro da rod cap (metade de baixo, afastada)

const meiaArg = (cx, cy, R, r, cima) =>
  cima
    ? `M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 0 0 ${cx - r} ${cy} Z`
    : `M ${cx - R} ${cy} A ${R} ${R} 0 0 0 ${cx + R} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx - r} ${cy} Z`;

export default function Biela({caption}) {
  const W = 460;
  const H = 480;
  return (
    <Figura W={W} H={H} caption={caption}>
      {/* piston pin, à esquerda do small end, com a linha de montagem */}
      <rect className={styles.metal} x={40} y={PE - 12} width={86} height={24} rx={12} />
      <line className={styles.tracejada} x1={130} y1={PE} x2={X - 30} y2={PE} />

      {/* haste */}
      <path className={styles.escuro} d={`M ${X - 11} ${PE + 22} L ${X + 11} ${PE + 22} L ${X + 22} ${BE - 50} L ${X - 22} ${BE - 50} Z`} />
      {/* small end com a bushing */}
      <circle className={styles.escuro} cx={X} cy={PE} r={28} />
      <circle className={styles.preenche2} cx={X} cy={PE} r={19} />
      <circle className={styles.vazio} cx={X} cy={PE} r={13} />

      {/* big end (metade de cima, presa na haste) */}
      <path className={styles.escuro} d={meiaArg(X, BE, 60, 38, true)} />
      <rect className={styles.escuro} x={X - 74} y={BE - 12} width={28} height={12} />
      <rect className={styles.escuro} x={X + 46} y={BE - 12} width={28} height={12} />

      {/* as duas metades da rod bearing */}
      <path className={styles.preenche2} d={meiaArg(X, BE + 14, 37, 30, true)} />
      <path className={styles.preenche2} d={meiaArg(X, CAP - 14, 37, 30, false)} />

      {/* rod cap */}
      <path className={styles.escuro} d={meiaArg(X, CAP, 60, 38, false)} />
      <rect className={styles.escuro} x={X - 74} y={CAP} width={28} height={12} />
      <rect className={styles.escuro} x={X + 46} y={CAP} width={28} height={12} />

      {/* rod bolts, embaixo, com o caminho até os furos */}
      {[X - 60, X + 60].map((x) => (
        <g key={x}>
          <line className={styles.tracejada} x1={x} y1={CAP + 14} x2={x} y2={404} />
          <line className={styles.tracejada} x1={x} y1={CAP - 2} x2={x} y2={BE - 10} />
          <rect className={styles.metal} x={x - 4} y={404} width={8} height={48} />
          <rect className={styles.metal} x={x - 10} y={452} width={20} height={9} rx={2} />
        </g>
      ))}

      <RotuloTermo k="piston pin" x={83} y={PE - 32} anchor="middle" />
      <RotuloTermo k="small end" x={300} y={40} para={[X + 22, PE - 18]} />
      <RotuloTermo k="bushing" x={300} y={80} para={[X + 17, PE + 8]} />
      <RotuloTermo k="connecting rod" x={300} y={170} para={[X + 16, 170]} />
      <RotuloTermo k="big end" x={316} y={250} para={[X + 50, BE - 26]} />
      <RotuloTermo k="rod bearing" texto="rod bearings" x={316} y={322} para={[X + 34, BE + 8]} />
      <line className={styles.fina} x1={312} y1={326} x2={X + 34} y2={CAP - 8} />
      <circle className={styles.pontos} cx={X + 34} cy={CAP - 8} r={2} />
      <RotuloTermo k="rod cap" x={316} y={392} para={[X + 52, CAP + 26]} />
      <RotuloTermo k="rod bolt" texto="rod bolts" x={316} y={436} para={[X + 64, 430]} />
    </Figura>
  );
}
