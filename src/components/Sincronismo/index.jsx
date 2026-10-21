import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import styles from './styles.module.css';
import LegendaLivro from '../LegendaLivro';

// Correia dentada ligando a engrenagem do virabrequim (embaixo, pequena) à do
// comando (em cima, com o dobro de dentes). Cada engrenagem tem uma marca;
// `voltas` diz quantas voltas o virabrequim já deu desde a posição inicial. A
// marca do comando anda a metade: com voltas={2}, ela volta ao começo.
//
// Tom 2 (laranja): as duas marcas.

const CAME = [190, 104];
const VIRA = [190, 300];
const R_CAME = 64;
const R_VIRA = 32;
const DENTES_VIRA = 18;

function Engrenagem({c, r, dentes}) {
  const pts = [];
  for (let i = 0; i < dentes * 2; i++) {
    const a = (i / (dentes * 2)) * 2 * Math.PI;
    const rr = i % 2 ? r : r + 5;
    const a1 = a - Math.PI / (dentes * 2) / 2;
    const a2 = a + Math.PI / (dentes * 2) / 2;
    pts.push(`${(c[0] + rr * Math.cos(a1)).toFixed(1)},${(c[1] + rr * Math.sin(a1)).toFixed(1)}`);
    pts.push(`${(c[0] + rr * Math.cos(a2)).toFixed(1)},${(c[1] + rr * Math.sin(a2)).toFixed(1)}`);
  }
  return (
    <g>
      <polygon className={styles.engrenagem} points={pts.join(' ')} />
      <circle className={styles.eixo} cx={c[0]} cy={c[1]} r={6} />
    </g>
  );
}

function Marca({c, r, graus}) {
  // 0° = marca apontando para cima; gira em sentido horário
  const a = ((graus - 90) * Math.PI) / 180;
  const p = [c[0] + (r - 10) * Math.cos(a), c[1] + (r - 10) * Math.sin(a)];
  return (
    <g>
      <line className={styles.marcaLinha} x1={c[0]} y1={c[1]} x2={p[0]} y2={p[1]} />
      <circle className={styles.marca} cx={p[0]} cy={p[1]} r={6} />
    </g>
  );
}

export default function Sincronismo({voltas = 0, caption}) {
  const W = 420;
  const H = 392;
  const grausVira = (voltas * 360) % 360;
  const grausCame = (voltas * 180) % 360;
  // correia: tangentes externas das duas engrenagens (mesmo x, raios
  // diferentes), mais um arco em volta de cada uma
  const rc = R_CAME + 7;
  const rv = R_VIRA + 7;
  const d = VIRA[1] - CAME[1];
  const ang = Math.asin((rc - rv) / d); // inclinação das tangentes
  const tc = (s) => [CAME[0] + s * rc * Math.cos(ang), CAME[1] + rc * Math.sin(ang)];
  const tv = (s) => [VIRA[0] + s * rv * Math.cos(ang), VIRA[1] + rv * Math.sin(ang)];
  const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  const correia = `M ${f(tc(-1))} A ${rc} ${rc} 0 1 1 ${f(tc(1))} L ${f(tv(1))} A ${rv} ${rv} 0 0 1 ${f(tv(-1))} Z`;
  const nVoltas = (n) => (n === 0.5 ? 'meia volta' : `${n} ${n < 2 ? 'volta' : 'voltas'}`);
  const texto =
    voltas === 0
      ? 'posição inicial'
      : `virabrequim: ${nVoltas(voltas)} · comando: ${nVoltas(voltas / 2)}`;
  return (
    <figure className={styles.figure}>
      <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label={caption}>
        <path className={styles.correia} d={correia} />
        <Engrenagem c={CAME} r={R_CAME} dentes={DENTES_VIRA * 2} />
        <Engrenagem c={VIRA} r={R_VIRA} dentes={DENTES_VIRA} />
        <Marca c={CAME} r={R_CAME} graus={grausCame} />
        <Marca c={VIRA} r={R_VIRA} graus={grausVira} />
        <RotuloTermo k="camshaft sprocket" texto={'camshaft\nsprocket'} x={290} y={70} para={[CAME[0] + R_CAME - 4, 86]} />
        <RotuloTermo texto="36 dentes" x={290} y={120} />
        <RotuloTermo k="timing belt" x={290} y={200} para={[CAME[0] + 52, 200]} />
        <RotuloTermo k="crankshaft sprocket" texto={'crankshaft\nsprocket'} x={290} y={280} para={[VIRA[0] + R_VIRA + 2, 292]} />
        <RotuloTermo texto="18 dentes" x={290} y={330} />
        <RotuloTermo texto={texto} x={20} y={378} anchor="start" />
      </svg>
      {caption && <figcaption className={styles.caption}><LegendaLivro texto={caption} /></figcaption>}
    </figure>
  );
}
