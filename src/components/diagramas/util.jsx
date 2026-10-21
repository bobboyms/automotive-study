import React from 'react';
import styles from './pecas.module.css';
import LegendaLivro from '../LegendaLivro';

// Peças comuns dos desenhos da AUT-116.

// Seta reta com ponta em V. `cls` escolhe a cor (styles.seta, traco1...).
export function Seta({de, para, cls = styles.seta, largura = 3}) {
  const ang = Math.atan2(para[1] - de[1], para[0] - de[0]);
  const p = (a) => `${para[0] - 9 * Math.cos(ang + a)} ${para[1] - 9 * Math.sin(ang + a)}`;
  return (
    <g className={cls} style={{strokeWidth: largura}}>
      <line x1={de[0]} y1={de[1]} x2={para[0]} y2={para[1]} />
      <path d={`M ${p(0.5)} L ${para[0]} ${para[1]} L ${p(-0.5)}`} />
    </g>
  );
}

// Figura padrão: SVG com viewBox W×H e legenda com os links do livro.
export function Figura({W, H, caption, children}) {
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption}
      >
        {children}
      </svg>
      {caption && (
        <figcaption className={styles.caption}>
          <LegendaLivro texto={caption} />
        </figcaption>
      )}
    </figure>
  );
}

// Engrenagem simples: dentes retangulares em volta de um círculo.
export function Dentes({c, r, n, altura = 6, className}) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a1 = ((i - 0.25) / (n * 2)) * 2 * Math.PI;
    const a2 = ((i + 0.25) / (n * 2)) * 2 * Math.PI;
    const rr = i % 2 ? r : r + altura;
    pts.push(`${(c[0] + rr * Math.cos(a1)).toFixed(1)},${(c[1] + rr * Math.sin(a1)).toFixed(1)}`);
    pts.push(`${(c[0] + rr * Math.cos(a2)).toFixed(1)},${(c[1] + rr * Math.sin(a2)).toFixed(1)}`);
  }
  return <polygon className={className} points={pts.join(' ')} />;
}

export {styles};
