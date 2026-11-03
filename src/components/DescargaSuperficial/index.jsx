import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import RotuloTermo from '../diagramas/RotuloTermo';
import {Seta} from '../diagramas/util';
import s from '../diagramas/pecas.module.css';

// O surface discharge test: a sujeira úmida na tampa da battery liga um
// terminal ao outro por fora, e uma parte da carga escapa por ali.
//
// A ponta vermelha fica no positive terminal e a preta corre pela tampa,
// procurando a leitura mais alta. O caminho pela sujeira sai no tom 3, que
// é o tom do defeito; a ponta vermelha, no tom 2, como no `Medicao`.
//
// A leitura de 0.2 V é ligada ao caminho por um traço, e não solta no canto:
// solta, ela parecia um número sem dono.

const W = 540;
const H = 268;

// sujeira na tampa: posições fixas, para o desenho sair igual em todo build
const SUJEIRA = [
  [96, 133, 2.4],
  [112, 128, 1.8],
  [134, 134, 2.2],
  [152, 127, 1.6],
  [168, 133, 2.6],
  [186, 129, 1.8],
  [204, 134, 2],
  [222, 127, 2.4],
  [240, 133, 1.8],
  [258, 129, 2.2],
  [276, 134, 1.6],
  [294, 128, 2.4],
  [312, 133, 2],
  [330, 129, 1.8],
  [348, 134, 2.4],
  [366, 127, 2],
  [384, 133, 1.8],
  [402, 130, 2.2],
  [420, 134, 2],
  [436, 128, 1.8],
];

export default function DescargaSuperficial({caption}) {
  return (
    <figure className={s.figure}>
      <svg
        className={s.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption}
      >
        {/* a battery vista de frente, fechada */}
        <rect className={s.vazio} x={70} y={140} width={380} height={95} rx={6} />
        <line className={s.fina} x1={70} y1={156} x2={450} y2={156} />

        {/* os dois posts */}
        <rect className={s.metal} x={112} y={106} width={20} height={34} rx={2} />
        <rect className={s.metal} x={388} y={106} width={20} height={34} rx={2} />
        <SvgMath x={96} y={122} math="+" fontSize={17} />
        <SvgMath x={424} y={122} math="-" fontSize={17} />

        {/* sujeira úmida sobre a tampa */}
        {SUJEIRA.map(([cx, cy, r], i) => (
          <circle key={i} className={s.pontos} cx={cx} cy={cy} r={r} />
        ))}

        {/* o caminho que a carga encontra por fora da battery */}
        <line
          className={s.traco3}
          style={{strokeWidth: 2.6, strokeDasharray: '7 5'}}
          x1={126}
          y1={136}
          x2={394}
          y2={136}
        />
        <Seta de={[290, 136]} para={[352, 136]} cls={s.traco3} largura={2.6} />
        {/* o traço que liga a leitura ao caminho medido */}
        <line className={s.traco3} style={{strokeWidth: 1.4}} x1={414} y1={136} x2={458} y2={136} />
        <SvgMath x={464} y={136} math="0.2\,\text{V}" anchor="start" fontSize={16} tone={3} />

        {/* ponta vermelha no positive terminal */}
        <line className={s.traco2} style={{strokeWidth: 3.2}} x1={86} y1={56} x2={120} y2={100} />
        <path className={s.preenche2} d="M 114 96 L 126 102 L 118 110 Z" />

        {/* ponta preta correndo pela tampa */}
        <line className={s.cabo} style={{strokeWidth: 3.2}} x1={300} y1={56} x2={268} y2={124} />
        <path className={s.escuro} d="M 262 120 L 276 124 L 268 136 Z" />

        <RotuloTermo texto="ponta vermelha" x={86} y={34} anchor="middle" fs={16} tone={2} />
        <RotuloTermo texto="ponta preta" x={300} y={34} anchor="middle" fs={16} />
        <RotuloTermo
          texto="corrente de fuga"
          x={190}
          y={82}
          anchor="middle"
          para={[190, 134]}
          fs={16}
          tone={3}
        />
      </svg>
      {caption && <figcaption className={s.caption}>{caption}</figcaption>}
    </figure>
  );
}
