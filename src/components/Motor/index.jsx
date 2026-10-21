import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import styles from './styles.module.css';
import LegendaLivro from '../LegendaLivro';

// Motor de um cilindro em corte, visto de frente (olhando para a ponta do
// virabrequim): bloco com galerias de água, pistão com anéis, biela,
// virabrequim, cabeçote com duas válvulas inclinadas, vela no meio e um eixo
// de comando sobre cada válvula. É o motor “de estudo” do capítulo 1 do livro,
// redesenhado.
//
// Tudo sai de uma posição só: `fase`, o ângulo do ciclo de quatro tempos em
// graus (0 a 720, com 0 = pistão no PMS no começo da admissão). Dela saem a
// posição do pistão, a abertura das válvulas, a cor do gás e as setas. O
// virabrequim gira em sentido horário.
//
// Cores: tom 1 (azul) é a mistura fresca, tom 2 (laranja) é o gás queimando ou
// queimado — ou a peça em destaque, nas figuras sem gás —, tom 3 (verde) é o
// líquido de arrefecimento nas galerias de água.

export const W = 460;
export const H = 568;
const X = 230; // eixo do cilindro
const C = [X, 458]; // centro do virabrequim
const RAIO = 44; // raio da manivela: o curso é o dobro, 88
const BIELA = 150;
const PINO_TOPO = 38; // do topo do pistão até o pino
const PISTAO_H = 76;
const FURO = [170, 290]; // paredes do cilindro
const DECK = 214;
const ROOF = 192; // ponta do telhado da câmara
const HEAD_TOP = 120;
const LIFT_MAX = 11;

const rad = (g) => (g * Math.PI) / 180;
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k];
const pt = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

// Telhado da câmara: duas rampas, do furo até a ponta.
const rampa = [X - FURO[0], DECK - ROOF];
const compr = Math.hypot(...rampa);
const U_ADM = [rampa[0] / compr, -rampa[1] / compr]; // ao longo da rampa esquerda, subindo
const U_ESC = [rampa[0] / compr, rampa[1] / compr]; // ao longo da rampa direita, descendo
// eixo de cada válvula: perpendicular à rampa, apontando para dentro do
// cabeçote — para cima e para a esquerda na admissão, para a direita no escape
const N_ADM = [U_ADM[1], -U_ADM[0]];
const N_ESC = [U_ESC[1], -U_ESC[0]];
const SEDE_ADM = [FURO[0] + rampa[0] * 0.45, DECK - rampa[1] * 0.45];
const SEDE_ESC = [2 * X - SEDE_ADM[0], SEDE_ADM[1]];
// meia largura da cabeça da válvula: a de admissão é maior que a de escape
const A_ADM = 18;
const A_ESC = 14;
// distâncias ao longo do eixo da válvula, a partir da sede
const S_TOPO_CAB = (SEDE_ADM[1] - HEAD_TOP) / Math.abs(N_ADM[1]);
const S_MOLA_TOPO = S_TOPO_CAB + 30;
const S_TUCHO = S_MOLA_TOPO + 12;
const R_CAME = 15;
const S_CAME = S_TUCHO + R_CAME + 1;

export function posicaoPistao(fase) {
  const th = rad(fase % 360);
  const pino = C[1] - (RAIO * Math.cos(th) + Math.sqrt(BIELA ** 2 - (RAIO * Math.sin(th)) ** 2));
  return {topo: pino - PINO_TOPO, pino, manivela: [C[0] + RAIO * Math.sin(th), C[1] - RAIO * Math.cos(th)]};
}
export const TOPO_PMS = posicaoPistao(0).topo;
export const TOPO_PMI = posicaoPistao(180).topo;

function lift(fase, inicio) {
  const f = (((fase - inicio) % 720) + 720) % 720;
  return f <= 180 ? LIFT_MAX * Math.sin(rad(f)) : 0;
}

export function estadoCiclo(fase) {
  const f = ((fase % 720) + 720) % 720;
  const tempo = f < 180 ? 'admissao' : f < 360 ? 'compressao' : f < 540 ? 'combustao' : 'escape';
  return {
    f,
    tempo,
    liftAdm: lift(f, 0),
    liftEsc: lift(f, 540),
    gas: f < 360 ? 1 : 2,
    faisca: f >= 345 && f <= 378,
    descendo: f % 360 < 180,
  };
}

function Seta({de, para, tone, largura = 3}) {
  const ang = Math.atan2(para[1] - de[1], para[0] - de[0]);
  const ponta = (a) => [para[0] - 9 * Math.cos(ang + a), para[1] - 9 * Math.sin(ang + a)];
  const cls = tone ? styles[`seta${tone}`] : styles.seta;
  return (
    <g className={cls} style={{strokeWidth: largura}}>
      <line x1={de[0]} y1={de[1]} x2={para[0]} y2={para[1]} />
      <path d={`M ${pt(ponta(0.5))} L ${pt(para)} L ${pt(ponta(-0.5))}`} />
    </g>
  );
}

// Uma válvula com mola, tucho e came. `sede` e `n` definem o eixo; `lift`
// desce a válvula para dentro da câmara.
function Valvula({sede, n, u, a: A_VALV, lift, camAng, destaque}) {
  const desc = add(sede, n, -lift);
  const P = (s, w) => add(add(desc, n, s), u, w);
  const cabeca = [P(0, -A_VALV), P(0, A_VALV), P(5, A_VALV - 1), P(12, 3.5), P(12, -3.5), P(5, -A_VALV + 1)];
  const haste = [P(12, -3), P(12, 3), P(S_MOLA_TOPO + 4, 3), P(S_MOLA_TOPO + 4, -3)];
  // mola: zigue-zague do topo do cabeçote (fixo) até o prato (sobe e desce)
  const base = add(sede, n, S_TOPO_CAB);
  const topoMola = add(desc, n, S_MOLA_TOPO);
  const voltas = 7;
  const mola = [];
  for (let i = 0; i <= voltas * 2; i++) {
    const t = i / (voltas * 2);
    const c = [base[0] + (topoMola[0] - base[0]) * t, base[1] + (topoMola[1] - base[1]) * t];
    const lado = i === 0 || i === voltas * 2 ? 0 : i % 2 ? 1 : -1;
    mola.push(add(c, u, lado * 12));
  }
  const tucho = [P(S_MOLA_TOPO, -12), P(S_MOLA_TOPO, 12), P(S_TUCHO, 12), P(S_TUCHO, -12)];
  const centro = add(sede, n, S_CAME);
  // came: círculo de base com um ressalto apontando na direção camAng
  const came = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * 2 * Math.PI;
    const d = Math.cos(a - camAng);
    const r = R_CAME + (d > 0 ? LIFT_MAX * d ** 3 : 0);
    came.push([centro[0] + r * Math.cos(a), centro[1] + r * Math.sin(a)]);
  }
  const poly = (ps) => ps.map(pt).join(' ');
  return (
    <g>
      <polyline className={styles.mola} points={poly(mola)} />
      <polygon className={destaque ? styles.destaque : styles.metal} points={poly(haste)} />
      <polygon className={destaque ? styles.destaque : styles.metal} points={poly(cabeca)} />
      <polygon className={styles.metal} points={poly(tucho)} />
      <polygon className={styles.came} points={poly(came)} />
      <circle className={styles.eixo} cx={centro[0]} cy={centro[1]} r={4} />
    </g>
  );
}

// Duto do cabeçote: sai da sede da válvula e vai para a lateral.
function duto(sede, u, n, lado, A_VALV) {
  const A = add(sede, u, -A_VALV - 2); // canto de baixo (perto da parede do furo)
  const B = add(sede, u, A_VALV + 2); // canto de cima (perto da vela)
  const xBorda = lado < 0 ? 124 : 336;
  const B2 = add(B, n, 22);
  return `M ${pt(A)} C ${pt([A[0] + lado * 20, A[1] - 12])} ${pt([xBorda - lado * 30, 182])} ${xBorda} 180 L ${xBorda} 140 C ${pt([xBorda - lado * 40, 140])} ${pt([B2[0] + lado * 18, B2[1] - 4])} ${pt(B2)} L ${pt(B)} Z`;
}

const ROTULOS = {
  baixo: [
    {k: 'cylinder head', x: 110, y: 130, anchor: 'end', para: [138, 130]},
    {k: 'water jacket', x: 110, y: 272, anchor: 'end', para: [146, 272]},
    {k: 'cylinder block', x: 110, y: 372, anchor: 'end', para: [150, 372]},
    {k: 'crankcase', x: 110, y: 470, anchor: 'end', para: [148, 470]},
    {k: 'cylinder', x: 350, y: 232, para: [284, 232], fase: true},
    {k: 'piston ring', texto: 'piston rings', x: 350, y: 'anel', para: 'anel'},
    {k: 'piston', x: 350, y: 'pistao', para: 'pistao'},
    {k: 'piston pin', x: 350, y: 'pino', para: 'pino'},
    {k: 'connecting rod', x: 350, y: 'biela', para: 'biela'},
    {k: 'crankshaft', x: 350, y: 510, para: 'vira'},
  ],
  cima: [
    {k: 'camshaft', x: 98, y: 34, anchor: 'end', para: 'cameAdm'},
    {k: 'valve spring', x: 98, y: 96, anchor: 'end', para: 'molaAdm'},
    {k: 'intake port', x: 98, y: 158, anchor: 'end', para: [136, 162]},
    {k: 'intake valve', x: 98, y: 222, anchor: 'end', para: 'valvAdm'},
    {k: 'combustion chamber', texto: 'combustion\nchamber', x: 98, y: 262, anchor: 'end', para: [214, 216]},
    {k: 'spark plug', x: 300, y: -2, para: [234, 62]},
    {k: 'cylinder head', x: 362, y: 96, para: [326, 128]},
    {k: 'exhaust port', x: 362, y: 158, para: [326, 162]},
    {k: 'exhaust valve', x: 362, y: 222, para: 'valvEsc'},
    {k: 'piston', x: 362, y: 'pistao', para: 'pistao'},
  ],
  pontos: [
    {k: 'top dead center', texto: 'TDC', x: 362, y: 'tdc'},
    {k: 'bottom dead center', texto: 'BDC', x: 362, y: 'bdc'},
    {k: 'stroke', x: 380, y: 'curso'},
  ],
};

export default function Motor({
  fase,
  tempo,
  rotulos = 'baixo',
  gas,
  setas,
  marcas = false,
  destaque = [],
  caption,
  ariaLabel,
  embutido = false,
  injetor,
}) {
  const FASES = {admissao: 90, compressao: 270, combustao: 450, escape: 630, pms: 0, pmi: 180};
  // sem fase nem tempo: pistão subindo na compressão, válvulas fechadas
  const f = fase ?? FASES[tempo] ?? 300;
  const e = estadoCiclo(f);
  const mostraGas = gas ?? tempo != null;
  const mostraSetas = setas ?? tempo != null;
  const {topo, pino, manivela} = posicaoPistao(f);
  const d = new Set(destaque);

  // ângulo dos cames: metade do ângulo do ciclo. O ressalto aponta para a
  // válvula (direção −n) no meio do tempo em que ela fica aberta.
  const angN = (n) => Math.atan2(-n[1], -n[0]);
  const camAdm = angN(N_ADM) + rad((e.f - 90) / 2);
  const camEsc = angN(N_ESC) + rad((e.f - 630) / 2);

  // contrapeso: do lado oposto à manivela
  // (perto o bastante do centro para não encostar no pistão no PMI)
  const contra = [C[0] - (manivela[0] - C[0]) * 0.8, C[1] - (manivela[1] - C[1]) * 0.8];

  // pontos de chamada que dependem da posição
  const vivos = {
    anel: [FURO[1] - 1, topo + 12],
    pistao: [FURO[1] - 20, topo + 58],
    pino: [X + 9, pino],
    biela: [(X + manivela[0]) / 2 + 6, (pino + manivela[1]) / 2],
    cameAdm: add(SEDE_ADM, N_ADM, S_CAME + 10),
    molaAdm: add(add(SEDE_ADM, N_ADM, S_TOPO_CAB + 14), U_ADM, -12),
    valvAdm: add(add(SEDE_ADM, N_ADM, 40 - e.liftAdm), U_ADM, -3),
    valvEsc: add(add(SEDE_ESC, N_ESC, 40 - e.liftEsc), U_ESC, 3),
    vira: [contra[0] + 14, contra[1] + 14],
    tdc: TOPO_PMS,
    bdc: TOPO_PMI,
    curso: (TOPO_PMS + TOPO_PMI) / 2,
  };
  // rótulos do lado direito que andam com o pistão: um embaixo do outro,
  // sem encostar
  const lista = (rotulos === 'nenhum' ? [] : ROTULOS[rotulos] || []).map((r) => ({
    ...r,
    y: typeof r.y === 'string' ? [].concat(vivos[r.y]).at(-1) : r.y,
    para: typeof r.para === 'string' ? vivos[r.para] : r.para,
  }));
  const direita = lista.filter((r) => r.anchor !== 'end').sort((a, b) => a.y - b.y);
  for (let i = 1; i < direita.length; i++) {
    const min = direita[i - 1].y + 24 + (String(direita[i - 1].texto ?? '').includes('\n') ? 17 : 0);
    if (direita[i].y < min) direita[i].y = min;
  }
  const marcasLista = marcas ? ROTULOS.pontos.map((r) => ({...r, y: vivos[r.y]})) : [];

  const gasPts = [
    [FURO[0], topo],
    [FURO[1], topo],
    [FURO[1], DECK],
    [X, ROOF],
    [FURO[0], DECK],
  ];
  const corGas = e.gas;

  // biela: do olhal menor (no pino) ao olhal maior (na manivela)
  const ang = Math.atan2(manivela[1] - pino, manivela[0] - X);
  const perp = [-Math.sin(ang), Math.cos(ang)];
  const bielaPts = [
    add([X, pino], perp, 7),
    add(manivela, perp, 12),
    add(manivela, perp, -12),
    add([X, pino], perp, -7),
  ];

  const cls = (nome, base) => (d.has(nome) ? styles.destaque : styles[base]);

  const svg = (
      <svg
        className={styles.svg}
        viewBox={`0 -14 ${W} ${H + 14}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={ariaLabel || caption || 'Motor de um cilindro em corte.'}
      >
        {/* tampa de válvulas */}
        <path className={styles.tampa} d={`M 124 ${HEAD_TOP} L 124 64 Q 124 18 180 18 L 280 18 Q 336 18 336 64 L 336 ${HEAD_TOP}`} />

        {/* bloco: peça cheia, com o furo do cilindro e o espaço do virabrequim
            vazados (fill-rule evenodd) */}
        <path
          className={cls('cylinder block', 'bloco')}
          fillRule="evenodd"
          d={`M 124 ${DECK} H 336 V 476 A 106 80 0 0 1 124 476 Z
              M ${FURO[0]} ${DECK} V 392 L 136 412 V 476 A 94 66 0 0 0 324 476 V 412 L ${FURO[1]} 392 V ${DECK} Z`}
        />
        {/* galerias de água */}
        <rect className={styles.agua} x={137} y={224} width={20} height={118} rx={4} />
        <rect className={styles.agua} x={303} y={224} width={20} height={118} rx={4} />

        {/* cabeçote, com a câmara (telhado) e os dois dutos vazados */}
        <path
          className={cls('cylinder head', 'cabecote')}
          fillRule="evenodd"
          d={`M 124 ${HEAD_TOP} H 336 V ${DECK} H ${FURO[1]} L ${X} ${ROOF} L ${FURO[0]} ${DECK} H 124 Z
              ${duto(SEDE_ADM, U_ADM, N_ADM, -1, A_ADM)} ${duto(SEDE_ESC, U_ESC, N_ESC, 1, A_ESC)}`}
        />
        <rect className={styles.agua} x={150} y={128} width={18} height={10} rx={3} />
        <rect className={styles.agua} x={292} y={128} width={18} height={10} rx={3} />

        {/* gás dentro do cilindro */}
        {mostraGas && (
          <polygon
            className={styles[`gas${corGas}`]}
            points={gasPts.map(pt).join(' ')}
          />
        )}
        {mostraGas && e.liftAdm > 1 && (
          <path className={styles.gas1} d={duto(SEDE_ADM, U_ADM, N_ADM, -1, A_ADM)} />
        )}
        {mostraGas && e.liftEsc > 1 && (
          <path className={styles.gas2} d={duto(SEDE_ESC, U_ESC, N_ESC, 1, A_ESC)} />
        )}

        {/* virabrequim: contrapeso, braço e munhões */}
        <g className={cls('crankshaft', 'vira')}>
          <circle cx={contra[0]} cy={contra[1]} r={28} />
          <line
            x1={contra[0]}
            y1={contra[1]}
            x2={manivela[0]}
            y2={manivela[1]}
            className={styles.braco}
          />
          <circle cx={C[0]} cy={C[1]} r={17} />
        </g>

        {/* biela */}
        <polygon className={cls('connecting rod', 'biela')} points={bielaPts.map(pt).join(' ')} />
        <circle className={cls('connecting rod', 'biela')} cx={manivela[0]} cy={manivela[1]} r={21} />
        <circle className={styles.munhao} cx={manivela[0]} cy={manivela[1]} r={12} />
        <circle className={styles.eixo} cx={C[0]} cy={C[1]} r={6} />

        {/* pistão, anéis e pino */}
        <rect
          className={cls('piston', 'pistao')}
          x={FURO[0] + 2}
          y={topo}
          width={FURO[1] - FURO[0] - 4}
          height={PISTAO_H}
          rx={3}
        />
        {[10, 20, 31].map((dy, i) => (
          <g key={dy} className={cls('piston ring', 'anel')}>
            <rect x={FURO[0] + 0.5} y={topo + dy - 2.5} width={14} height={5} />
            <rect x={FURO[1] - 14.5} y={topo + dy - 2.5} width={14} height={5} />
            {i === 2 && <line x1={FURO[0] + 14} y1={topo + dy} x2={FURO[1] - 14} y2={topo + dy} className={styles.ranhura} />}
            {i < 2 && <line x1={FURO[0] + 14} y1={topo + dy} x2={FURO[1] - 14} y2={topo + dy} className={styles.ranhura} />}
          </g>
        ))}
        <circle className={cls('connecting rod', 'biela')} cx={X} cy={pino} r={14} />
        <circle className={cls('piston pin', 'pino')} cx={X} cy={pino} r={8} />

        {/* válvulas, molas e comandos */}
        <Valvula sede={SEDE_ADM} n={N_ADM} u={U_ADM} a={A_ADM} lift={e.liftAdm} camAng={camAdm} destaque={d.has('intake valve') || d.has('valve')} />
        <Valvula sede={SEDE_ESC} n={N_ESC} u={U_ESC} a={A_ESC} lift={e.liftEsc} camAng={camEsc} destaque={d.has('exhaust valve') || d.has('valve')} />

        {/* fuel injector: no intake port (injeção indireta) ou dentro da
            combustion chamber (injeção direta), com o jato de combustível */}
        {injetor === 'indireto' && (
          <g>
            <path className={styles.metal} d="M 112 96 L 124 90 L 146 136 L 142 146 L 136 148 L 132 142 Z" />
            <path className={styles.jato} d="M 140 150 L 166 182 L 178 170 Z" />
          </g>
        )}
        {injetor === 'direto' && (
          <g>
            <path className={styles.metal} d={`M 112 200 L 116 192 L ${FURO[0] + 4} 205 L ${FURO[0] + 6} 211 L ${FURO[0] + 2} 213 L 110 208 Z`} />
            <path className={styles.jato} d={`M ${FURO[0] + 8} 210 L ${FURO[0] + 52} ${DECK + 34} L ${FURO[0] + 58} ${DECK + 16} Z`} />
          </g>
        )}

        {/* vela */}
        <g className={cls('spark plug', 'vela')}>
          <rect x={X - 7} y={150} width={14} height={ROOF - 150 + 2} />
          <rect x={X - 6} y={74} width={12} height={76} rx={4} />
          <rect x={X - 3} y={56} width={6} height={18} />
          <line x1={X} y1={ROOF + 2} x2={X} y2={ROOF + 8} className={styles.eletrodo} />
        </g>
        {mostraGas && e.faisca && (
          <path
            className={styles.faisca}
            d={`M ${X} ${ROOF + 10} l -10 4 l 7 1 l -9 10 l 13 -8 l -6 -1 l 9 -6 z`}
          />
        )}

        {/* setas: escoamento nos dutos e movimento do pistão */}
        {mostraSetas && e.liftAdm > 2 && (
          <Seta de={[128, 160]} para={[178, 188]} tone={1} />
        )}
        {mostraSetas && e.liftEsc > 2 && (
          <Seta de={[282, 188]} para={[332, 160]} tone={2} />
        )}
        {mostraSetas && (
          <Seta
            de={[X - 30, e.descendo ? topo + 14 : topo + 62]}
            para={[X - 30, e.descendo ? topo + 56 : topo + 20]}
          />
        )}
        {mostraSetas && (
          <path className={styles.giro} d={`M ${C[0] + 64} ${C[1] - 26} A 70 70 0 0 1 ${C[0] + 64} ${C[1] + 26}`} markerEnd="" />
        )}
        {mostraSetas && (
          <path className={styles.giroPonta} d={`M ${C[0] + 56} ${C[1] + 22} L ${C[0] + 64} ${C[1] + 27} L ${C[0] + 67} ${C[1] + 17}`} />
        )}

        {/* PMS, PMI e curso */}
        {marcas && (
          <g>
            <line className={styles.marca} x1={150} y1={TOPO_PMS} x2={352} y2={TOPO_PMS} />
            <line className={styles.marca} x1={150} y1={TOPO_PMI} x2={352} y2={TOPO_PMI} />
            <Seta de={[344, (TOPO_PMS + TOPO_PMI) / 2]} para={[344, TOPO_PMS + 3]} largura={1.5} />
            <Seta de={[344, (TOPO_PMS + TOPO_PMI) / 2]} para={[344, TOPO_PMI - 3]} largura={1.5} />
          </g>
        )}

        {injetor && (
          <RotuloTermo
            k="fuel injector"
            x={104}
            y={injetor === 'direto' ? 236 : 70}
            anchor="end"
            para={injetor === 'direto' ? [114, 204] : [116, 96]}
          />
        )}
        {lista.map((r) => (
          <RotuloTermo key={`${r.k}${r.x}`} {...r} />
        ))}
        {marcasLista.map((r) => (
          <RotuloTermo key={r.texto ?? r.k} {...r} />
        ))}
      </svg>
  );
  // dentro de outro componente (o ciclo interativo), só o desenho
  if (embutido) return svg;
  return (
    <figure className={styles.figure}>
      {svg}
      {caption && <figcaption className={styles.caption}><LegendaLivro texto={caption} /></figcaption>}
    </figure>
  );
}
