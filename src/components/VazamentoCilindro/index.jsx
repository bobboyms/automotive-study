import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import {Figura, styles} from '../diagramas/util';

// Um cylinder em corte durante o cylinder leakage test: o piston está no TDC
// do compression stroke, as duas valves estão fechadas e o ar do tester entra
// pelo furo da spark plug. Mostra os quatro caminhos por onde o ar pode sair.
//   intake valve  -> intake port -> throttle body
//   exhaust valve -> exhaust port -> tailpipe
//   piston rings  -> crankcase -> oil filler cap e PCV
//   head gasket   -> cylinder vizinho -> furo da spark plug dele
// Tom 1 (azul): o ar que o tester injeta. Tom 2 (laranja): o ar que vaza.

function Fluxo({d, ponta, cls}) {
  return (
    <g className={cls} style={{strokeWidth: 3.5}}>
      <path d={d} />
      <path d={ponta} />
    </g>
  );
}

export default function VazamentoCilindro({caption}) {
  const W = 520;
  const H = 400;
  return (
    <Figura W={W} H={H} caption={caption}>
      {/* cylinder head e cylinder block */}
      <rect className={styles.bloco} x={100} y={40} width={290} height={70} />
      <rect className={styles.bloco} x={100} y={110} width={290} height={230} />
      <rect className={styles.escuro} x={100} y={108} width={290} height={4} />

      {/* bore, com a câmara em cima do piston, e o crankcase embaixo */}
      <rect className={styles.vazio} x={180} y={110} width={120} height={170} />
      <rect className={styles.vazio} x={130} y={280} width={220} height={50} />

      {/* furo da spark plug (a plug foi tirada) */}
      <rect className={styles.vazio} x={230} y={40} width={20} height={70} />

      {/* intake port e exhaust port */}
      <path className={styles.vazio} d="M180 110 V80 H100 V55 H210 V110 Z" />
      <path className={styles.vazio} d="M300 110 V80 H390 V55 H270 V110 Z" />

      {/* gasket queimada: um vão aberto até o cylinder vizinho */}
      <rect className={styles.vazio} x={300} y={107} width={90} height={7} />

      {/* valves fechadas: haste e disco assentado no seat */}
      <rect className={styles.escuro} x={192} y={45} width={6} height={65} />
      <rect className={styles.escuro} x={180} y={108} width={30} height={5} />
      <rect className={styles.escuro} x={282} y={45} width={6} height={65} />
      <rect className={styles.escuro} x={270} y={108} width={30} height={5} />

      {/* piston no TDC, com rings e rod */}
      <rect className={styles.metal} x={186} y={150} width={108} height={100} />
      <rect className={styles.escuro} x={186} y={160} width={108} height={5} />
      <rect className={styles.escuro} x={186} y={174} width={108} height={5} />
      <rect className={styles.escuro} x={233} y={250} width={14} height={70} />

      {/* ar do tester entrando pelo furo da spark plug */}
      <Fluxo cls={styles.traco1} d="M240 8 V96" ponta="M233 86 L240 98 L247 86" />
      <RotuloTermo k="cylinder leakage tester" texto={'cylinder leakage\ntester'} x={258} y={14} tone={1} />

      {/* vazamento pela intake valve */}
      <Fluxo cls={styles.traco2} d="M204 124 V68 H108" ponta="M118 61 L106 68 L118 75" />
      <RotuloTermo k="throttle body" texto={'throttle\nbody'} x={94} y={60} anchor="end" tone={2} />

      {/* vazamento pela exhaust valve */}
      <Fluxo cls={styles.traco2} d="M276 124 V68 H382" ponta="M372 61 L384 68 L372 75" />
      <RotuloTermo k="tailpipe" x={398} y={68} tone={2} />

      {/* vazamento pela head gasket */}
      <Fluxo cls={styles.traco2} d="M294 130 V110 H382" ponta="M372 103 L384 110 L372 117" />
      <RotuloTermo texto={'adjacent\ncylinder'} x={398} y={104} tone={2} />

      {/* vazamento pelos piston rings */}
      <Fluxo cls={styles.traco2} d="M183 140 V296" ponta="M176 286 L183 298 L190 286" />

      {/* nomes das peças */}
      <RotuloTermo k="head gasket" texto={'head\ngasket'} x={94} y={100} anchor="end" para={[132, 110]} />
      <RotuloTermo k="intake valve" texto={'intake\nvalve'} x={94} y={150} anchor="end" para={[184, 114]} />
      <RotuloTermo k="exhaust valve" texto={'exhaust\nvalve'} x={398} y={150} para={[296, 114]} />
      <RotuloTermo k="piston" x={240} y={206} anchor="middle" />
      <RotuloTermo k="piston ring" texto={'piston\nrings'} x={398} y={206} para={[292, 177]} />
      <RotuloTermo k="crankcase" x={258} y={309} />

      {/* para onde vai o ar que passa pelos rings */}
      <RotuloTermo texto={'piston rings → crankcase →'} x={104} y={362} tone={2} />
      <RotuloTermo texto={'oil filler cap e PCV'} x={104} y={380} tone={2} />
    </Figura>
  );
}
