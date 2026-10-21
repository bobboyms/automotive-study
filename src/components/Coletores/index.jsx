import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import {Figura, Seta, styles} from '../diagramas/util';

// Intake manifold e exhaust manifold, em corte, de lado. O ar entra pelo
// throttle body, passa pelo plenum e pelo intake runner até o intake port do
// cylinder head; o fuel injector borrifa no runner. O gás queimado sai pelo
// exhaust port e pelo exhaust manifold.
// Tom 1 (azul): o ar entrando. Tom 2 (laranja): o gás de escape.

export default function Coletores({caption}) {
  const W = 540;
  const H = 360;
  return (
    <Figura W={W} H={H} caption={caption}>
      {/* intake manifold: throttle body, plenum, descida e runner */}
      <path
        className={styles.preenche1}
        d="M 30 34 H 70 V 56 H 100 V 112 H 90 V 140 H 156 V 170 H 60 V 112 H 10 V 56 H 30 Z"
      />
      <path className={styles.linha} d="M 30 34 H 70 V 56 H 100 V 112 H 90 V 140 H 156" />
      <path className={styles.linha} d="M 156 170 H 60 V 112 H 10 V 56 H 30" />
      {/* throttle valve dentro do throttle body */}
      <line className={styles.linha} x1={36} y1={48} x2={64} y2={40} />
      <circle className={styles.pontos} cx={50} cy={44} r={2.5} />

      {/* fuel injector, de cima, borrifando no runner */}
      <path className={styles.metal} d="M 118 98 L 132 98 L 132 130 L 128 140 L 122 140 L 118 130 Z" />
      <path className={styles.jato} d="M 125 142 L 114 162 L 136 162 Z" />

      {/* cylinder head com os dois ports */}
      <path
        className={styles.bloco}
        fillRule="evenodd"
        d={`M 156 110 H 316 V 224 H 156 Z
            M 156 140 C 196 140 226 176 230 224 L 200 224 C 200 196 180 170 156 170 Z
            M 316 140 C 276 140 246 176 242 224 L 272 224 C 272 196 292 170 316 170 Z`}
      />
      <path className={styles.preenche1} d="M 156 140 C 196 140 226 176 230 224 L 200 224 C 200 196 180 170 156 170 Z" />
      <path className={styles.preenche2} d="M 316 140 C 276 140 246 176 242 224 L 272 224 C 272 196 292 170 316 170 Z" />
      {/* valve cover */}
      <path className={styles.tracejada} d="M 156 110 V 96 Q 156 80 176 80 H 296 Q 316 80 316 96 V 110" />
      {/* valves fechadas (só as hastes e as cabeças) */}
      <line className={styles.linha} x1={215} y1={224} x2={215} y2={92} />
      <line className={styles.linha} x1={257} y1={224} x2={257} y2={92} />
      <line className={styles.linha} x1={202} y1={224} x2={228} y2={224} />
      <line className={styles.linha} x1={246} y1={224} x2={268} y2={224} />

      {/* cylinder e piston */}
      <line className={styles.linha} x1={182} y1={224} x2={182} y2={330} />
      <line className={styles.linha} x1={290} y1={224} x2={290} y2={330} />
      <rect className={styles.metal} x={184} y={280} width={104} height={50} rx={3} />

      {/* exhaust manifold: sai para a direita e desce */}
      <path className={styles.preenche2} d="M 316 140 H 446 V 340 H 416 V 170 H 316 Z" />

      {/* setas */}
      <Seta de={[50, 4]} para={[50, 30]} cls={styles.traco1} />
      <Seta de={[80, 155]} para={[146, 155]} cls={styles.traco1} />
      <Seta de={[340, 155]} para={[400, 155]} cls={styles.traco2} />
      <Seta de={[431, 200]} para={[431, 262]} cls={styles.traco2} />

      <RotuloTermo k="throttle body" x={78} y={22} />
      <RotuloTermo k="fuel injector" x={140} y={66} para={[128, 98]} />
      <RotuloTermo k="intake manifold" x={10} y={200} anchor="start" para={[30, 112]} de={[40, 190]} />
      <RotuloTermo k="intake runner" x={10} y={232} anchor="start" para={[100, 170]} de={[80, 222]} />
      <RotuloTermo k="intake port" x={120} y={262} anchor="end" para={[192, 196]} />
      <RotuloTermo k="valve cover" x={340} y={74} para={[312, 92]} />
      <RotuloTermo k="cylinder head" x={336} y={112} para={[312, 122]} de={[332, 112]} />
      <RotuloTermo k="exhaust manifold" texto={'exhaust\nmanifold'} x={456} y={190} para={[446, 200]} />
      <RotuloTermo k="exhaust port" x={300} y={262} para={[282, 196]} />
    </Figura>
  );
}
