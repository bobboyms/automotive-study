import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import styles from './styles.module.css';

// Átomo no modelo de camadas: núcleo no centro, elétrons em círculos ao redor.
// O modelo é uma simplificação — os elétrons não giram em órbitas como
// planetas —, mas é o desenho dos livros de mecânica, e o que ele precisa
// mostrar está certo: quantos elétrons há na camada de fora.

const R0 = 36; // raio da primeira camada
const STEP = 24; // distância entre camadas
const PAD = 22;
const LABEL_SPACE = 150; // espaço à direita para o rótulo do elétron livre

export default function Atomo({
  camadas = [2, 8, 18, 1],
  nucleo = '29+',
  destaque = true,
  rotuloExterno = '\\text{elétron livre}',
  caption,
}) {
  const rMax = R0 + STEP * (camadas.length - 1);
  const cx = PAD + rMax;
  const cy = PAD + rMax;
  const W = 2 * (PAD + rMax) + (destaque ? LABEL_SPACE : 0);
  const H = 2 * (PAD + rMax);
  const last = camadas.length - 1;

  // O primeiro elétron de fora fica no alto à direita, onde o rótulo alcança.
  const outerStart = -Math.PI / 5;

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || 'Desenho de um átomo em camadas.'}
      >
        {camadas.map((n, i) => (
          <circle
            key={`shell-${i}`}
            className={styles.shell}
            cx={cx}
            cy={cy}
            r={R0 + STEP * i}
          />
        ))}

        <circle className={styles.nucleus} cx={cx} cy={cy} r={20} />
        <SvgMath x={cx} y={cy} math={nucleo} fontSize={13} />

        {camadas.map((n, i) => {
          const r = R0 + STEP * i;
          const start = i === last ? outerStart : -Math.PI / 2;
          const outer = destaque && i === last;
          return Array.from({length: n}, (_, k) => {
            const a = start + (2 * Math.PI * k) / n;
            return (
              <circle
                key={`e-${i}-${k}`}
                className={outer ? styles.free : styles.electron}
                cx={cx + r * Math.cos(a)}
                cy={cy + r * Math.sin(a)}
                r={outer ? 6 : 4}
              />
            );
          });
        })}

        {destaque && (
          <g>
            <line
              className={styles.leader}
              x1={cx + (rMax + 9) * Math.cos(outerStart)}
              y1={cy + (rMax + 9) * Math.sin(outerStart)}
              x2={cx + rMax + PAD + 14}
              y2={cy + (rMax + 9) * Math.sin(outerStart)}
            />
            <SvgMath
              x={cx + rMax + PAD + 20}
              y={cy + (rMax + 9) * Math.sin(outerStart)}
              math={rotuloExterno}
              anchor="start"
              space={LABEL_SPACE - 30}
              fontSize={14}
              tone={1}
            />
          </g>
        )}
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
