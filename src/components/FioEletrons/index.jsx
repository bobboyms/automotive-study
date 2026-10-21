import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import styles from './styles.module.css';

// Um trecho de fio de cobre visto por dentro: os átomos fixos (com a carga
// positiva que sobra quando o elétron livre sai) e os elétrons livres entre
// eles. Sem fonte, cada elétron anda para um lado; com fonte, todos andam
// juntos para o polo positivo. A diferença entre as duas figuras é a ideia de
// corrente.

const X0 = 50;
const X1 = 470;
const Y0 = 34;
const Y1 = 134;
const COLS = 7;
const ROWS = 2;
const W = 520;
const H = 170;

// Gerador pseudoaleatório com semente fixa: o desenho sai igual no servidor e
// no navegador, e igual a cada build.
function lcg(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function Seta({x, y, angle}) {
  return (
    <path
      className={styles.arrow}
      d="M 0 0 L 15 0 M 10.5 -4 L 15 0 L 10.5 4"
      transform={`translate(${x} ${y}) rotate(${angle})`}
    />
  );
}

export default function FioEletrons({corrente = false, caption}) {
  const dx = (X1 - X0) / COLS;
  const dy = (Y1 - Y0) / ROWS;
  const rand = lcg(7);

  const ions = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ions.push({x: X0 + dx * (c + 0.5), y: Y0 + dy * (r + 0.5)});
    }
  }

  // Os elétrons ficam nos vãos: entre dois átomos da mesma fileira, e no
  // corredor entre as duas fileiras. Assim nenhuma seta cai em cima de um átomo
  // nem sai do fio.
  const spots = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 1; c < COLS; c++) {
      spots.push({x: X0 + dx * c, y: Y0 + dy * (r + 0.5)});
    }
  }
  for (let c = 0; c < COLS; c++) {
    spots.push({x: X0 + dx * (c + 0.5), y: Y0 + dy});
  }
  const electrons = spots.map(({x, y}) => {
    const jx = (rand() - 0.5) * 10;
    const jy = (rand() - 0.5) * 6;
    const angle = corrente ? 0 : Math.round(rand() * 360);
    // com corrente, a seta sai para a direita; recua o ponto para ela caber
    return {x: x + jx - (corrente ? 7 : 0), y: y + jy, angle};
  });

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || 'Elétrons livres dentro de um fio de cobre.'}
      >
        <rect
          className={styles.wire}
          x={X0}
          y={Y0}
          width={X1 - X0}
          height={Y1 - Y0}
          rx={14}
        />

        {ions.map(({x, y}) => (
          <g key={`i-${x}-${y}`}>
            <circle className={styles.ion} cx={x} cy={y} r={9} />
            <path
              className={styles.plus}
              d={`M ${x - 4} ${y} L ${x + 4} ${y} M ${x} ${y - 4} L ${x} ${y + 4}`}
            />
          </g>
        ))}

        {electrons.map(({x, y, angle}) => (
          <g key={`e-${x}-${y}`}>
            <circle className={styles.electron} cx={x} cy={y} r={4.5} />
            <Seta x={x} y={y} angle={angle} />
          </g>
        ))}

        {corrente && (
          <g>
            <SvgMath x={X0 - 22} y={(Y0 + Y1) / 2} math="-" fontSize={22} />
            <SvgMath x={X1 + 22} y={(Y0 + Y1) / 2} math="+" fontSize={22} />
            <SvgMath
              x={X0 + 10}
              y={Y1 + 22}
              math="\text{polo }-"
              fontSize={16}
            />
            <SvgMath
              x={X1 - 10}
              y={Y1 + 22}
              math="\text{polo }+"
              fontSize={16}
            />
          </g>
        )}

        <SvgMath
          x={(X0 + X1) / 2}
          y={Y0 - 16}
          math={
            corrente
              ? '\\text{com bateria: todos andam para o polo }+'
              : '\\text{sem bateria: cada um para um lado}'
          }
          fontSize={16}
          tone={1}
        />
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
