import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import styles from '../Simbolos/styles.module.css';

// O sinal de um sensor desenhado pelo oscilloscope: a voltage (vertical)
// ao longo do tempo (horizontal). A linha sobe como a do TPS abrindo, e no
// meio há uma queda curta — o ponto morto da trilha.
//
// `falha={false}` desenha o mesmo sinal sem a queda, para comparar.
// Os pontos do scan tool mostram por que ele não enxerga a queda: ele lê de
// vez em quando, e entre duas leituras cabe a falha inteira.
//
// Tom 2 (laranja) é o sinal; tom 3 (verde) marca o defeito, como no
// `Circuito`.

const W = 460;
const H = 292;
const X0 = 62; // origem dos eixos
const Y0 = 214;
const X1 = 436;
const Y1 = 40;

const FONTE = 14;

// O sinal sobe de 0.5 V a 4.5 V ao longo do tempo; a queda fica no meio.
const SOBE = (t) => Y0 - (0.08 + 0.84 * t) * (Y0 - Y1);

export default function Oscilograma({falha = true, pontos = false, caption}) {
  const passos = 60;
  const d = [];
  for (let i = 0; i <= passos; i++) {
    const t = i / passos;
    // a queda ocupa uma fatia estreita do tempo: é o ponto morto da trilha
    const naFalha = falha && t > 0.46 && t < 0.52;
    const y = naFalha ? Y0 - 6 : SOBE(t);
    const x = X0 + t * (X1 - X0 - 14);
    d.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  // as leituras do scan tool: espaçadas, e nenhuma cai dentro da queda
  const amostras = [0.08, 0.26, 0.44, 0.62, 0.8, 0.96];

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={
          caption || 'Sinal de um sensor ao longo do tempo, visto no oscilloscope.'
        }
      >
        <g className={styles.eixo}>
          <line x1={X0} y1={Y0} x2={X1} y2={Y0} />
          <line x1={X0} y1={Y0} x2={X0} y2={Y1} />
          <path d={`M ${X1 - 8} ${Y0 - 5} L ${X1} ${Y0} L ${X1 - 8} ${Y0 + 5}`} />
          <path d={`M ${X0 - 5} ${Y1 + 8} L ${X0} ${Y1} L ${X0 + 5} ${Y1 + 8}`} />
        </g>
        <SvgMath x={X0 + 8} y={Y1 - 14} math="\text{voltage}" anchor="start" fontSize={FONTE} />
        <SvgMath x={X0 - 10} y={Y1 + 20} math="\text{alta}" anchor="end" fontSize={13} />
        <SvgMath x={X0 - 10} y={Y0 - 6} math="\text{baixa}" anchor="end" fontSize={13} />
        <SvgMath x={352} y={Y0 + 30} math="\text{tempo}" fontSize={FONTE} />

        {/* o sinal */}
        <path className={styles.curva2} d={d.join(' ')} />

        {/* as leituras do scan tool */}
        {pontos &&
          amostras.map((t) => {
            const x = X0 + t * (X1 - X0 - 14);
            return <circle key={t} className={styles.ponto} cx={x} cy={SOBE(t)} r={4.5} />;
          })}

        {/* o defeito */}
        {falha && (
          <g>
            <circle
              className={styles.campo}
              cx={X0 + 0.49 * (X1 - X0 - 14)}
              cy={Y0 - 6}
              r={15}
            />
            <SvgMath
              x={188}
              y={Y0 + 56}
              math="\text{o ponto morto}"
              fontSize={FONTE}
              tone={3}
            />
          </g>
        )}
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
