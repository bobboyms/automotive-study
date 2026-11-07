import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import RotuloTermo from '../diagramas/RotuloTermo';
import chaveDoTermo from '../diagramas/termos';
import s from '../diagramas/pecas.module.css';

// As três fases de um smart charger: voltage (tom 1) sobe na fase bulk,
// fica parada no teto durante a absorption enquanto a current (tom 2) cai
// (taper), e as duas caem para o nível baixo da float. As duas curvas usam a
// mesma escala vertical só para comparar o formato — voltage e current não
// têm a mesma unidade, e a legenda da lição avisa isso.
//
// Pontos de controle (t de 0 a 1, fração de 0 a 1 da altura do gráfico).
// Interpolação linear entre eles, como no `Oscilograma`.

// Mesma largura de gráfico do `Oscilograma` (460): num desenho largo demais o
// rótulo encolhe na coluna do celular, onde o SVG é reduzido para 358 px.
const W = 470;
const H = 300;
const X0 = 60;
const Y0 = 236;
const X1 = 390;
const Y1 = 44;
const FONTE = 15;

const V_PONTOS = [
  [0, 0.28],
  [0.4, 0.86],
  [0.44, 0.9],
  [0.75, 0.9],
  [0.78, 0.55],
  [1, 0.55],
];

const I_PONTOS = [
  [0, 0.8],
  [0.42, 0.8],
  [0.47, 0.73],
  [0.6, 0.45],
  [0.75, 0.18],
  [0.78, 0.11],
  [1, 0.11],
];
// A cauda da current não encosta no eixo: o rótulo dela fica na ponta da
// curva, e a 0.06 ele caía em cima da seta do eixo do tempo.

// divisas entre as fases, no meio da transição de cada curva
const DIVISAS = [0.425, 0.765];

function curva(pontos) {
  return (t) => {
    for (let i = 0; i < pontos.length - 1; i++) {
      const [t0, f0] = pontos[i];
      const [t1, f1] = pontos[i + 1];
      if (t >= t0 && t <= t1) {
        const k = t1 === t0 ? 0 : (t - t0) / (t1 - t0);
        return f0 + (f1 - f0) * k;
      }
    }
    return pontos[pontos.length - 1][1];
  };
}

const V = curva(V_PONTOS);
const I = curva(I_PONTOS);

function caminho(fn) {
  const passos = 90;
  const d = [];
  for (let i = 0; i <= passos; i++) {
    const t = i / passos;
    const x = X0 + t * (X1 - X0 - 12);
    const y = Y0 - fn(t) * (Y0 - Y1);
    d.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return d.join(' ');
}

const FASES = [
  {de: 0, ate: 0.425, termo: 'bulk charge', texto: 'bulk'},
  {de: 0.425, ate: 0.765, termo: 'absorption charge', texto: 'absorption'},
  {de: 0.765, ate: 1, termo: 'float charge', texto: 'float'},
];

export default function CurvaCarga({caption}) {
  const larguraUtil = X1 - X0 - 12;

  return (
    <figure className={s.figure}>
      <svg
        className={s.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={
          caption ||
          'As três fases de carga: bulk, absorption e float, com voltage e current ao longo do tempo.'
        }
      >
        <g className={s.eixo}>
          <line x1={X0} y1={Y0} x2={X1} y2={Y0} />
          <line x1={X0} y1={Y0} x2={X0} y2={Y1} />
          <path d={`M ${X1 - 8} ${Y0 - 5} L ${X1} ${Y0} L ${X1 - 8} ${Y0 + 5}`} />
          <path d={`M ${X0 - 5} ${Y1 + 8} L ${X0} ${Y1} L ${X0 + 5} ${Y1 + 8}`} />
        </g>

        <SvgMath x={X0 - 10} y={Y1 + 14} math="\text{alto}" anchor="end" fontSize={FONTE} />
        <SvgMath x={X0 - 10} y={Y0 - 6} math="\text{baixo}" anchor="end" fontSize={FONTE} />
        <SvgMath x={(X0 + X1) / 2} y={Y0 + 48} math="\text{time}" fontSize={FONTE} />

        {/* divisas entre as fases */}
        {DIVISAS.map((t) => {
          const x = X0 + t * larguraUtil;
          return (
            <line
              key={t}
              className={s.tracejada}
              x1={x}
              y1={Y0}
              x2={x}
              y2={Y1}
            />
          );
        })}

        {/* nome de cada fase, embaixo do eixo */}
        {FASES.map((f) => {
          const centro = X0 + ((f.de + f.ate) / 2) * larguraUtil;
          return (
            <RotuloTermo
              key={f.texto}
              k={chaveDoTermo(f.termo)}
              texto={f.texto}
              x={centro}
              y={Y0 + 20}
              anchor="middle"
              fs={FONTE}
            />
          );
        })}

        {/* as duas curvas */}
        <path className={s.curva2} d={caminho(I)} />
        <path className={s.curva1} d={caminho(V)} />

        {/* rótulo no fim de cada curva */}
        <SvgMath
          x={X1 + 6}
          y={Y0 - V(1) * (Y0 - Y1)}
          math="\text{voltage}"
          anchor="start"
          fontSize={FONTE}
          tone={1}
        />
        <SvgMath
          x={X1 + 6}
          y={Y0 - I(1) * (Y0 - Y1) - 2}
          math="\text{current}"
          anchor="start"
          fontSize={FONTE}
          tone={2}
        />
      </svg>
      {caption && <figcaption className={s.caption}>{caption}</figcaption>}
    </figure>
  );
}
