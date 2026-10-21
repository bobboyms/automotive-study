import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import {Dentes, Figura, Seta, styles} from '../diagramas/util';

// modo="partida": o starting system visto por trás do engine. A battery manda
// a corrente grande pelo cabo grosso até o solenoid; a ignition switch só
// manda uma corrente pequena, pelo fio fino, para o solenoid fechar o
// contato. O starter motor gira a engrenagem pequena, engatada no ring gear
// do flywheel.
// modo="carga": o charging system visto pela frente. A crankshaft pulley
// move a drive belt, que gira a polia do alternator (e a da water pump). O
// alternator, com o voltage regulator, manda a corrente de volta à battery.
// Tom 2 (laranja): o caminho da corrente grande da partida. Tom 1 (azul): a
// corrente de recarga.

function Partida({caption}) {
  const W = 480;
  const H = 340;
  const C = [190, 190]; // centro do flywheel
  const R = 82;
  const ang = (35 * Math.PI) / 180;
  const pinhao = [C[0] + (R + 18) * Math.cos(ang), C[1] + (R + 18) * Math.sin(ang)];
  return (
    <Figura W={W} H={H} caption={caption}>
      {/* flywheel com o ring gear */}
      <Dentes c={C} r={R} n={48} altura={6} className={styles.escuro} />
      <circle className={styles.metal} cx={C[0]} cy={C[1]} r={R - 4} />
      <circle className={styles.pontos} cx={C[0]} cy={C[1]} r={8} />
      {/* starter motor: engrenagem pequena engatada e o corpo para a direita */}
      <Dentes c={pinhao} r={12} n={9} altura={5} className={styles.metal} />
      <rect className={styles.preenche2} x={pinhao[0] + 18} y={pinhao[1] - 22} width={110} height={44} rx={8} />
      <line className={styles.linha} x1={pinhao[0] + 2} y1={pinhao[1]} x2={pinhao[0] + 18} y2={pinhao[1]} />
      {/* solenoid em cima do starter motor */}
      <rect className={styles.preenche2} x={pinhao[0] + 34} y={pinhao[1] - 50} width={74} height={26} rx={6} />

      {/* battery */}
      <rect className={styles.metal} x={14} y={36} width={92} height={56} rx={4} />
      <rect className={styles.metal} x={26} y={26} width={14} height={10} />
      <rect className={styles.metal} x={80} y={26} width={14} height={10} />
      <text x={33} y={66} textAnchor="middle" style={{fill: 'var(--ifm-font-color-base)', fontSize: 18}}>+</text>
      <text x={87} y={66} textAnchor="middle" style={{fill: 'var(--ifm-font-color-base)', fontSize: 18}}>−</text>

      {/* cabo grosso: + da battery até o solenoid */}
      <path className={styles.traco2} style={{strokeWidth: 7}} d={`M 33 26 V 10 H 452 V ${pinhao[1] - 37} H ${pinhao[0] + 108}`} />
      {/* cabo grosso: − da battery até a massa (o bloco) */}
      <path className={styles.cabo} style={{strokeWidth: 7}} d="M 87 26 V 18 H 120 V 104" />
      <path className={styles.linha} d="M 108 104 H 132 M 113 110 H 127 M 118 116 H 122" />
      {/* ignition switch e o fio fino até o solenoid */}
      <circle className={styles.vazio} cx={300} cy={56} r={13} />
      <rect className={styles.metal} x={296} y={40} width={8} height={18} rx={2} />
      <path className={styles.cabo} style={{strokeWidth: 1.6}} d={`M 300 69 V 110 H ${pinhao[0] + 52} V ${pinhao[1] - 50}`} />

      <RotuloTermo k="battery" x={60} y={114} anchor="middle" />
      <RotuloTermo k="ignition switch" x={320} y={50} />
      <RotuloTermo k="solenoid" x={pinhao[0] + 116} y={pinhao[1] - 62} />
      <RotuloTermo k="starter motor" x={pinhao[0] + 74} y={pinhao[1] + 40} anchor="middle" />
      <RotuloTermo k="flywheel" x={C[0]} y={C[1] - 30} anchor="middle" />
      <RotuloTermo k="ring gear" x={20} y={250} anchor="start" para={[C[0] - R * 0.82, C[1] + R * 0.6]} de={[90, 246]} />
    </Figura>
  );
}

// Correia em volta de polias (círculos em sentido horário): tangentes de
// fora entre polias vizinhas e arcos em volta de cada uma.
function correia(polias, comTangentes = false) {
  const n = polias.length;
  const cx = polias.reduce((s, p) => s + p.c[0], 0) / n;
  const cy = polias.reduce((s, p) => s + p.c[1], 0) / n;
  const tang = [];
  for (let i = 0; i < n; i++) {
    const a = polias[i];
    const b = polias[(i + 1) % n];
    const dx = b.c[0] - a.c[0];
    const dy = b.c[1] - a.c[1];
    const L = Math.hypot(dx, dy);
    const base = Math.atan2(dy, dx);
    const alfa = Math.acos((a.r - b.r) / L);
    const opcoes = [base + alfa, base - alfa].map((t) => {
      const p1 = [a.c[0] + a.r * Math.cos(t), a.c[1] + a.r * Math.sin(t)];
      const p2 = [b.c[0] + b.r * Math.cos(t), b.c[1] + b.r * Math.sin(t)];
      const m = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
      return {p1, p2, d: Math.hypot(m[0] - cx, m[1] - cy)};
    });
    tang.push(opcoes[0].d > opcoes[1].d ? opcoes[0] : opcoes[1]);
  }
  const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  let d = `M ${f(tang[0].p1)}`;
  for (let i = 0; i < n; i++) {
    const t = tang[i];
    const prox = tang[(i + 1) % n];
    const b = polias[(i + 1) % n];
    d += ` L ${f(t.p2)}`;
    // arco em volta da polia b, de t.p2 até prox.p1, por fora
    const a1 = Math.atan2(t.p2[1] - b.c[1], t.p2[0] - b.c[0]);
    const a2 = Math.atan2(prox.p1[1] - b.c[1], prox.p1[0] - b.c[0]);
    let delta = a2 - a1;
    while (delta < 0) delta += 2 * Math.PI;
    d += ` A ${b.r} ${b.r} 0 ${delta > Math.PI ? 1 : 0} 1 ${f(prox.p1)}`;
  }
  return comTangentes ? {d, tang} : d;
}

function Carga({caption}) {
  const W = 480;
  const H = 340;
  const vira = {c: [190, 262], r: 40};
  const bomba = {c: [110, 130], r: 26};
  const alt = {c: [290, 110], r: 22};
  const belt = correia([vira, bomba, alt], true);
  // ponto no meio do trecho de correia entre o crankshaft e a water pump
  const meio = [(belt.tang[0].p1[0] + belt.tang[0].p2[0]) / 2, (belt.tang[0].p1[1] + belt.tang[0].p2[1]) / 2];
  return (
    <Figura W={W} H={H} caption={caption}>
      {/* frente do engine, atrás das polias */}
      <rect className={styles.bloco} x={60} y={70} width={250} height={230} rx={8} opacity={0.6} />
      {/* corpo do alternator, atrás da polia */}
      <circle className={styles.preenche1} cx={alt.c[0]} cy={alt.c[1]} r={48} />
      {/* polias */}
      {[vira, bomba, alt].map((p) => (
        <g key={p.c.join()}>
          <circle className={styles.metal} cx={p.c[0]} cy={p.c[1]} r={p.r} />
          <circle className={styles.pontos} cx={p.c[0]} cy={p.c[1]} r={4} />
        </g>
      ))}
      {/* drive belt, em volta das três polias (sentido horário) */}
      <path className={styles.cabo} style={{strokeWidth: 6, strokeOpacity: 0.85}} d={belt.d} />

      {/* battery e o fio de recarga saindo do alternator */}
      <rect className={styles.metal} x={370} y={230} width={92} height={56} rx={4} />
      <rect className={styles.metal} x={382} y={220} width={14} height={10} />
      <rect className={styles.metal} x={436} y={220} width={14} height={10} />
      <text x={389} y={262} textAnchor="middle" style={{fill: 'var(--ifm-font-color-base)', fontSize: 18}}>+</text>
      <text x={443} y={262} textAnchor="middle" style={{fill: 'var(--ifm-font-color-base)', fontSize: 18}}>−</text>
      <path className={styles.traco1} style={{strokeWidth: 5}} d={`M ${alt.c[0] + 46} ${alt.c[1]} H 389 V 220`} />
      <Seta de={[389, 150]} para={[389, 196]} cls={styles.traco1} />

      <RotuloTermo k="alternator" x={350} y={60} para={[318, 76]} />
      <RotuloTermo k="voltage regulator" x={350} y={92} para={[330, 112]} de={[346, 92]} />
      <RotuloTermo k="water pump" x={20} y={44} anchor="start" para={[100, 108]} de={[60, 54]} />
      <RotuloTermo k="drive belt" x={20} y={210} anchor="start" para={meio} de={[96, 210]} />
      <RotuloTermo k="crankshaft pulley" x={190} y={326} anchor="middle" />
      <RotuloTermo k="battery" x={416} y={306} anchor="middle" />
    </Figura>
  );
}

export default function PartidaCarga({modo = 'partida', caption}) {
  return modo === 'carga' ? <Carga caption={caption} /> : <Partida caption={caption} />;
}
