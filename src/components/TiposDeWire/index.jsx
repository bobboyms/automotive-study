import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import RotuloTermo from '../diagramas/RotuloTermo';
import styles from '../Simbolos/styles.module.css';

// Os tipos de wire do capítulo 8, em três figuras:
//
//   condutor — solid wire e stranded wire em corte, com insulation e
//              conductor nomeados. A diferença é o que aguenta vibração.
//   bitola   — 10, 14 e 18 AWG em corte, na mesma escala, com o diâmetro
//              real do cobre. O 18 leva isolamento grosso de propósito:
//              fica com o mesmo diâmetro externo do 14 e mostra que o que
//              conta é o cobre, não a capa.
//   cabos    — coaxial cable em corte e twisted pair wire visto de lado.
//
// Sem tom de cor: as três figuras são anatomia, não caminho de current nem
// defeito. Os tons ficam reservados para as figuras de diagnóstico.

const W = 480;

// Diâmetros reais do cobre, em mm (dado da escala AWG, não especificação de
// veículo). A escala do desenho é px/mm e vale para os três, para que a
// comparação de área seja honesta.
const AWG = [
  {n: 10, mm: 2.588},
  {n: 14, mm: 1.628},
  {n: 18, mm: 1.024},
];
const PX_POR_MM = 23;

// ---------------------------------------------------------------- condutor

const LINHAS = [4, 5, 4]; // 13 strands num feixe hexagonal
const R_STRAND = 6;
const PASSO = 12.6;

const STRANDS = LINHAS.flatMap((n, linha) => {
  const y = (linha - (LINHAS.length - 1) / 2) * PASSO;
  return Array.from({length: n}, (_, i) => ({x: (i - (n - 1) / 2) * PASSO, y}));
});

function Condutor() {
  const cy = 96;
  const rIsol = 52;
  const rCobre = 35;
  return (
    <>
      {/* solid wire */}
      <circle className={styles.parte} cx={120} cy={cy} r={rIsol} />
      <circle className={styles.metal} cx={120} cy={cy} r={rCobre} />

      {/* stranded wire */}
      <circle className={styles.parte} cx={360} cy={cy} r={rIsol} />
      {STRANDS.map((p, i) => (
        <circle
          key={i}
          className={styles.metal}
          cx={360 + p.x}
          cy={cy + p.y}
          r={R_STRAND}
        />
      ))}

      <RotuloTermo k="conductor" x={120} y={24} anchor="middle" para={[120, 70]} />
      <RotuloTermo
        k="insulator"
        texto="insulation"
        x={182}
        y={cy}
        anchor="start"
        para={[120 + (rIsol + rCobre) / 2, cy]}
      />

      <SvgMath x={120} y={180} math="\text{solid wire}" fontSize={15} />
      <SvgMath x={360} y={180} math="\text{stranded wire}" fontSize={15} />
    </>
  );
}

// ------------------------------------------------------------------ bitola

function Bitola() {
  const cy = 92;
  const centros = [95, 240, 385];
  // o 18 AWG ganha a capa do 14: mesmo diâmetro por fora, cobre bem menor
  const rExterno = [38.8, 27.7, 27.7];
  return (
    <>
      {AWG.map((a, i) => (
        <g key={a.n}>
          <circle
            className={styles.parte}
            cx={centros[i]}
            cy={cy}
            r={rExterno[i]}
          />
          <circle
            className={styles.metal}
            cx={centros[i]}
            cy={cy}
            r={(a.mm / 2) * PX_POR_MM}
          />
          <SvgMath
            x={centros[i]}
            y={158}
            math={`${a.n}\\,\\text{AWG}`}
            fontSize={15}
          />
          <SvgMath
            x={centros[i]}
            y={186}
            math={`${a.mm}\\,\\text{mm}`}
            fontSize={15}
          />
        </g>
      ))}
      <RotuloTermo
        texto={'capa grossa: por fora\nele é igual ao 14 AWG'}
        x={330}
        y={20}
        anchor="middle"
        para={[378, cy - (rExterno[2] + (AWG[2].mm / 2) * PX_POR_MM) / 2]}
      />
    </>
  );
}

// ------------------------------------------------------------------- cabos

// Duas senoides entrelaçadas. Em cada cruzamento, um dos dois fios é
// interrompido — e alternadamente: no primeiro cruzamento some o de baixo,
// no seguinte some o de cima. É isso que faz a figura ler como trança, e não
// como dois fios que se cruzam sem ligação (regra do README, seção
// "Conferência obrigatória"). Com os dois inteiros, o desenho parecia uma
// corrente de elos.
const X0 = 250;
const X1 = 454;
const AMP = 16;
const VOLTAS = 3.5; // meias-voltas visíveis
const PASSOS = 224;

function curva(sinal, de, ate) {
  const pts = [];
  for (let i = de; i <= ate; i++) {
    const t = i / PASSOS;
    pts.push(
      `${(X0 + t * (X1 - X0)).toFixed(1)},${(
        100 +
        sinal * AMP * Math.sin(t * VOLTAS * 2 * Math.PI)
      ).toFixed(1)}`,
    );
  }
  return `M ${pts.join(' L ')}`;
}

// os cruzamentos ficam onde o seno zera: t = k / (2 · VOLTAS)
const CRUZAMENTOS = Array.from({length: Math.ceil(VOLTAS * 2)}, (_, k) =>
  Math.round(((k + 1) / (VOLTAS * 2)) * PASSOS),
).filter((p) => p < PASSOS);

// Trechos visíveis de uma das curvas: ela some nos cruzamentos em que a
// outra passa por cima. `paridade` escolhe de qual das duas é a vez.
function trechos(paridade) {
  const corte = 6; // passos omitidos de cada lado do cruzamento
  const partes = [];
  let inicio = 0;
  CRUZAMENTOS.forEach((c, i) => {
    if (i % 2 !== paridade) return;
    partes.push([inicio, c - corte]);
    inicio = c + corte;
  });
  partes.push([inicio, PASSOS]);
  return partes.filter(([a, b]) => b > a);
}

function Cabos() {
  const cy = 100;
  return (
    <>
      {/* coaxial cable em corte. Shield e conductor são os dois metais e
          dividem o mesmo preenchimento; a capa externa e o isolamento de
          dentro são os dois isolantes e dividem o outro. Dois materiais,
          dois preenchimentos — o shield é identificado pelo rótulo, não por
          uma cor própria. */}
      <circle className={styles.parte} cx={120} cy={cy} r={52} />
      <circle className={styles.metal} cx={120} cy={cy} r={42} />
      <circle className={styles.parte} cx={120} cy={cy} r={30} />
      <circle className={styles.metal} cx={120} cy={cy} r={14} />

      <RotuloTermo k="shield" x={120} y={24} anchor="middle" para={[120, cy - 46]} />

      {/* twisted pair wire visto de lado */}
      {trechos(1).map(([a, b], i) => (
        <path key={`c${i}`} className={styles.fio} d={curva(1, a, b)} />
      ))}
      {trechos(0).map(([a, b], i) => (
        <path key={`b${i}`} className={styles.fio} d={curva(-1, a, b)} />
      ))}

      <SvgMath x={120} y={184} math="\text{coaxial cable}" fontSize={15} />
      <SvgMath x={352} y={184} math="\text{twisted pair wire}" fontSize={15} />
    </>
  );
}

const MODOS = {
  condutor: {H: 206, corpo: Condutor, alt: 'Um solid wire e um stranded wire em corte, com a insulation e o conductor nomeados.'},
  bitola: {H: 206, corpo: Bitola, alt: 'Wires de 10, 14 e 18 AWG em corte, na mesma escala, com o diâmetro do cobre de cada um.'},
  cabos: {H: 206, corpo: Cabos, alt: 'Um coaxial cable em corte e um twisted pair wire visto de lado.'},
};

export default function TiposDeWire({modo = 'condutor', caption}) {
  const {H, corpo: Corpo, alt} = MODOS[modo] || MODOS.condutor;
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || alt}
      >
        <Corpo />
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
