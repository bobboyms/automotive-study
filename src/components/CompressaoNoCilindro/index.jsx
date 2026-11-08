import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import {Figura, Seta, styles} from '../diagramas/util';

// Um cylinder em corte durante o compression test: o compression gauge está
// rosqueado no furo da spark plug, as duas valves estão fechadas e o piston
// sobe, apertando o ar. Tom 1 (azul): o ar que o piston aperta e sobe até o
// gauge. Tom 2 (laranja): o ar que escapa pelos rings.

function Fluxo({d, ponta, cls}) {
  return (
    <g className={cls} style={{strokeWidth: 3.5}}>
      <path d={d} />
      <path d={ponta} />
    </g>
  );
}

export default function CompressaoNoCilindro({caption}) {
  const W = 520;
  const H = 400;
  const dy = 70; // o corte do cylinder desce 70 para abrir espaço ao gauge
  return (
    <Figura W={W} H={H} caption={caption}>
      <g transform={`translate(0 ${dy})`}>
        {/* cylinder head e cylinder block */}
        <rect className={styles.bloco} x={100} y={40} width={290} height={70} />
        <rect className={styles.bloco} x={100} y={110} width={290} height={190} />
        <rect className={styles.escuro} x={100} y={108} width={290} height={4} />

        {/* bore e crankcase */}
        <rect className={styles.vazio} x={180} y={110} width={120} height={150} />
        <rect className={styles.vazio} x={130} y={260} width={220} height={40} />

        {/* furo da spark plug */}
        <rect className={styles.vazio} x={230} y={40} width={20} height={70} />

        {/* intake port e exhaust port */}
        <path className={styles.vazio} d="M180 110 V80 H100 V55 H210 V110 Z" />
        <path className={styles.vazio} d="M300 110 V80 H390 V55 H270 V110 Z" />

        {/* valves fechadas */}
        <rect className={styles.escuro} x={192} y={45} width={6} height={65} />
        <rect className={styles.escuro} x={180} y={108} width={30} height={5} />
        <rect className={styles.escuro} x={282} y={45} width={6} height={65} />
        <rect className={styles.escuro} x={270} y={108} width={30} height={5} />

        {/* piston subindo (no meio do compression stroke), com rings e rod */}
        <rect className={styles.metal} x={186} y={170} width={108} height={80} />
        <rect className={styles.escuro} x={186} y={178} width={108} height={5} />
        <rect className={styles.escuro} x={186} y={192} width={108} height={5} />
        <rect className={styles.escuro} x={233} y={250} width={14} height={45} />
      </g>

      {/* adapter e compression gauge no furo da spark plug */}
      <rect className={styles.escuro} x={234} y={66} width={12} height={dy + 100} />
      <circle className={styles.vazio} cx={240} cy={40} r={26} />
      <line className={styles.linha} x1={240} y1={40} x2={254} y2={26} />
      <circle className={styles.escuro} cx={240} cy={40} r={3} />

      {/* o ar que o piston aperta, subindo até o gauge */}
      <Fluxo cls={styles.traco1} d="M240 232 V196" ponta="M233 206 L240 194 L247 206" />

      {/* o piston sobe */}
      <Seta de={[240, 312]} para={[240, 268]} />

      {/* o ar que escapa pelos rings */}
      <Fluxo cls={styles.traco2} d="M183 258 V332" ponta="M176 322 L183 334 L190 322" />

      <RotuloTermo k="compression gauge" texto={'compression\ngauge'} x={282} y={26} />
      <RotuloTermo k="adapter" x={224} y={90} anchor="end" />
      <RotuloTermo k="intake valve" texto={'intake\nvalve'} x={94} y={220} anchor="end" para={[184, 184]} />
      <RotuloTermo k="exhaust valve" texto={'exhaust\nvalve'} x={398} y={220} para={[296, 184]} />
      <RotuloTermo k="piston ring" texto={'piston\nrings'} x={398} y={262} para={[292, 262]} />
      <RotuloTermo k="piston" x={398} y={302} para={[292, 302]} />
      <RotuloTermo texto="ar que escapa pelos rings" x={104} y={388} tone={2} />
    </Figura>
  );
}
