import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import styles from './styles.module.css';
import LegendaLivro from '../LegendaLivro';

// Trem de válvulas com vareta (OHV, *overhead valve*): came → tucho → vareta
// → balancim → válvula. Com `aberta`, o ressalto do came aponta para cima,
// empurra o tucho e a vareta, o balancim gira no eixo e o outro lado desce a
// válvula, que sai da sede. Sem `aberta`, o ressalto está para baixo e a mola
// mantém a válvula fechada.
//
// Tom 2 (laranja): as setas do movimento.

const LIFT = 16;
const PIVO = [205, 104];
const BRACO = 55;
const SEDE_Y = 334;
const CAME = [282, 398];
const R_CAME = 26;

function Seta({de, para}) {
  const ang = Math.atan2(para[1] - de[1], para[0] - de[0]);
  const p = (a) => `${para[0] - 9 * Math.cos(ang + a)} ${para[1] - 9 * Math.sin(ang + a)}`;
  return (
    <g className={styles.seta}>
      <line x1={de[0]} y1={de[1]} x2={para[0]} y2={para[1]} />
      <path d={`M ${p(0.5)} L ${para[0]} ${para[1]} L ${p(-0.5)}`} />
    </g>
  );
}

export default function ComandoValvula({aberta = false, caption}) {
  const W = 460;
  const H = 450;
  const l = aberta ? LIFT : 0;
  const t = Math.asin(l / BRACO); // giro do balancim
  const esq = [PIVO[0] - BRACO * Math.cos(t), PIVO[1] + BRACO * Math.sin(t)];
  const dir = [PIVO[0] + BRACO * Math.cos(t), PIVO[1] - BRACO * Math.sin(t)];
  const vx = esq[0];
  const ponta = esq[1] + 6; // topo da haste da válvula
  const sede = SEDE_Y + l;
  // came: círculo de base + ressalto para cima (aberta) ou para baixo
  const angRessalto = aberta ? -Math.PI / 2 : Math.PI / 2;
  const came = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * 2 * Math.PI;
    const d = Math.cos(a - angRessalto);
    const r = R_CAME + (d > 0 ? LIFT * d ** 3 : 0);
    came.push(`${(CAME[0] + r * Math.cos(a)).toFixed(1)},${(CAME[1] + r * Math.sin(a)).toFixed(1)}`);
  }
  const tuchoBase = CAME[1] - R_CAME - l;
  const tuchoTopo = tuchoBase - 30;
  // mola: do topo do cabeçote (y 176) até o prato na haste
  const prato = ponta + 22;
  const mola = [];
  const voltas = 7;
  for (let i = 0; i <= voltas * 2; i++) {
    const y = 176 + (prato - 176) * (i / (voltas * 2));
    const lado = i === 0 || i === voltas * 2 ? 0 : i % 2 ? 1 : -1;
    mola.push(`${vx + lado * 14},${y.toFixed(1)}`);
  }
  return (
    <figure className={styles.figure}>
      <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label={caption}>
        {/* cabeçote em volta da válvula, com o duto vazado */}
        <path
          className={styles.cabecote}
          fillRule="evenodd"
          d={`M 40 176 H 200 V ${SEDE_Y} H 40 Z
              M 40 250 C 90 250 112 270 ${vx - 20} ${SEDE_Y} H ${vx + 20} C ${vx + 26} 290 ${vx + 10} 218 40 214 Z`}
        />
        {/* guia de válvula */}
        <rect className={styles.guia} x={vx - 7} y={176} width={14} height={50} />
        {/* válvula */}
        <path
          className={styles.metal}
          d={`M ${vx - 3} ${ponta} H ${vx + 3} V ${sede - 14} L ${vx + 20} ${sede} H ${vx - 20} L ${vx - 3} ${sede - 14} Z`}
        />
        <polyline className={styles.mola} points={mola.join(' ')} />
        <rect className={styles.metal} x={vx - 16} y={prato - 4} width={32} height={6} />
        {/* balancim */}
        <line className={styles.balancim} x1={esq[0]} y1={esq[1]} x2={dir[0]} y2={dir[1]} />
        <circle className={styles.pivo} cx={PIVO[0]} cy={PIVO[1]} r={8} />
        {/* vareta */}
        <line className={styles.vareta} x1={dir[0]} y1={dir[1] + 6} x2={CAME[0]} y2={tuchoTopo} />
        {/* tucho */}
        <rect className={styles.metal} x={CAME[0] - 12} y={tuchoTopo} width={24} height={30} rx={3} />
        {/* came */}
        <polygon className={styles.came} points={came.join(' ')} />
        <circle className={styles.eixo} cx={CAME[0]} cy={CAME[1]} r={5} />

        {aberta && (
          <g>
            <Seta de={[CAME[0] + 34, 330]} para={[CAME[0] + 34, 300]} />
            <Seta de={[vx - 34, 300]} para={[vx - 34, 330]} />
          </g>
        )}

        <RotuloTermo k="rocker arm" x={262} y={50} para={[232, 100]} />
        <RotuloTermo k="valve spring" x={20} y={130} anchor="start" para={[vx - 13, 150]} de={[60, 136]} />
        <RotuloTermo k="valve guide" x={20} y={196} anchor="start" para={[vx - 6, 205]} de={[96, 202]} />
        <RotuloTermo k="intake port" texto="port" x={50} y={232} anchor="start" />
        <RotuloTermo k="valve seat" x={20} y={372} anchor="start" para={[vx - 21, SEDE_Y - 2]} de={[60, 362]} />
        <RotuloTermo
          k="valve"
          texto={aberta ? 'valve (open)' : 'valve (closed)'}
          x={160}
          y={404}
          para={[vx + 6, sede - 4]}
        />
        <RotuloTermo k="pushrod" x={340} y={200} para={[269, 200]} />
        <RotuloTermo k="lifter" x={340} y={tuchoTopo + 15} para={[CAME[0] + 12, tuchoTopo + 15]} />
        <RotuloTermo k="cam lobe" x={340} y={420} para={[CAME[0] + 20, aberta ? 380 : 420]} />
      </svg>
      {caption && <figcaption className={styles.caption}><LegendaLivro texto={caption} /></figcaption>}
    </figure>
  );
}
