import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import {Figura, Seta, styles} from '../diagramas/util';

// O lubrication system, de frente. O oil pickup puxa o óleo do fundo do oil
// pan; a oil pump o empurra pelo oil filter e daí para as oil galleries, que
// levam o óleo até as main bearings do crankshaft e, subindo, até o camshaft
// e o valve train. Depois de lubrificar, o óleo escorre de volta para o pan.
// Tom 1 (azul): o óleo — cheio onde está sob pressão, pontilhado onde volta.

export default function Lubrificacao({caption}) {
  const W = 480;
  const H = 430;
  return (
    <Figura W={W} H={H} caption={caption}>
      {/* bloco e cylinder head */}
      <rect className={styles.bloco} x={110} y={50} width={230} height={260} rx={6} />
      <rect className={styles.vazio} x={180} y={110} width={80} height={110} />
      {/* camshaft e rocker arm em cima */}
      <circle className={styles.metal} cx={220} cy={74} r={14} />
      {/* crankshaft com a main bearing */}
      <circle className={styles.preenche1} cx={220} cy={262} r={34} />
      <circle className={styles.escuro} cx={220} cy={262} r={26} />

      {/* oil pan com o óleo no fundo */}
      <path className={styles.metal} d="M 120 310 V 390 Q 120 400 130 400 H 320 Q 330 400 330 390 V 310" />
      <rect className={styles.preenche1} x={122} y={352} width={206} height={46} />

      {/* oil pickup com a tela */}
      <path className={styles.traco1} style={{strokeWidth: 6}} d="M 170 380 V 330 L 150 306" />
      <rect className={styles.metal} x={154} y={378} width={32} height={10} rx={2} />
      {/* oil pump */}
      <rect className={styles.metal} x={128} y={284} width={30} height={24} rx={4} />
      {/* da pump para o oil filter (fora do bloco) */}
      <path className={styles.traco1} style={{strokeWidth: 6}} d="M 128 296 H 70 V 270" />
      <rect className={styles.metal} x={50} y={210} width={40} height={60} rx={8} />
      {/* do filter para a oil gallery principal */}
      <path className={styles.traco1} style={{strokeWidth: 6}} d="M 70 210 V 190 H 300" />
      {/* ramos: para a main bearing e, subindo, para o camshaft */}
      <path className={styles.traco1} style={{strokeWidth: 5}} d="M 220 190 V 228" />
      <path className={styles.traco1} style={{strokeWidth: 5}} d="M 300 190 V 74 H 234" />

      {/* óleo escorrendo de volta para o pan */}
      <path className={styles.traco1} style={{strokeWidth: 3, strokeDasharray: '2 7'}} d="M 220 300 V 348" />
      <path className={styles.traco1} style={{strokeWidth: 3, strokeDasharray: '2 7'}} d="M 274 90 V 348" />

      {/* dipstick, mergulhando no óleo */}
      <line className={styles.linha} x1={318} y1={30} x2={318} y2={380} />
      <circle className={styles.vazio} cx={318} cy={24} r={7} />

      <Seta de={[100, 296]} para={[80, 296]} cls={styles.traco1} />
      <Seta de={[150, 190]} para={[180, 190]} cls={styles.traco1} />

      <RotuloTermo k="camshaft" x={350} y={74} para={[300, 74]} de={[346, 74]} />
      <RotuloTermo k="dipstick" x={350} y={30} para={[326, 26]} />
      <RotuloTermo k="oil galleries" x={350} y={140} para={[300, 140]} de={[346, 140]} />
      <RotuloTermo k="main bearing" x={350} y={262} para={[254, 262]} de={[346, 262]} />
      <RotuloTermo k="oil pan" x={350} y={390} para={[330, 380]} />
      <RotuloTermo k="oil filter" x={10} y={190} anchor="start" />
      <RotuloTermo k="oil pump" x={10} y={330} anchor="start" para={[132, 306]} de={[74, 326]} />
      <RotuloTermo k="oil pickup" x={10} y={410} anchor="start" para={[160, 386]} de={[84, 406]} />
      <RotuloTermo k="crankshaft" x={350} y={304} para={[244, 284]} de={[346, 304]} />
    </Figura>
  );
}
