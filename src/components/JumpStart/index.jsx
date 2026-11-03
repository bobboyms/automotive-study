import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import RotuloTermo from '../diagramas/RotuloTermo';
import s from '../diagramas/pecas.module.css';

// Onde cada clamp do jump pack vai, num veículo de negative ground: o
// vermelho no positive terminal da battery (1) e o preto num ponto de metal
// do engine block, longe da battery (2). Para desligar, a ordem é ao
// contrário: 2 e depois 1.
//
// Tons: 2 (laranja) é o clamp positivo, como a ponta vermelha do `Medicao`;
// 3 (verde) marca o lugar onde o clamp preto NÃO vai — o negative terminal.
// O clamp preto fica na cor do texto.
//
// Duas decisões de desenho que as versões anteriores erraram: os clamps
// ficam ENCOSTADOS no post, e não por cima dele — tapando o post, a figura
// deixava de mostrar justamente o que ela ensina —, e o rótulo "não aqui"
// recebe `anchor="start"`, para a linha de chamada sair da esquerda do texto
// em direção ao post, em vez de atravessá-lo por trás.

const W = 560;
const H = 292;

function Numero({x, y, n}) {
  return (
    <g>
      <circle className={s.vazio} cx={x} cy={y} r={13} />
      <SvgMath x={x} y={y} math={n} fontSize={16} />
    </g>
  );
}

export default function JumpStart({caption}) {
  return (
    <figure className={s.figure}>
      <svg
        className={s.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption}
      >
        {/* o metal do motor, que é o ground do veículo */}
        <rect className={s.bloco} x={290} y={226} width={230} height={48} rx={8} />

        {/* a battery do veículo */}
        <rect className={s.vazio} x={300} y={102} width={170} height={84} rx={6} />
        <line className={s.fina} x1={300} y1={116} x2={470} y2={116} />
        <rect className={s.metal} x={322} y={66} width={20} height={38} rx={2} />
        <rect className={s.metal} x={436} y={66} width={20} height={38} rx={2} />
        <SvgMath x={332} y={48} math="+" fontSize={18} />
        <SvgMath x={446} y={48} math="-" fontSize={18} />

        {/* o jump pack */}
        <rect className={s.vazio} x={26} y={50} width={140} height={150} rx={10} />
        <path className={s.linha} d="M 58 50 C 62 22, 130 22, 134 50" />
        <rect className={s.metal} x={54} y={72} width={84} height={34} rx={4} />
        <circle className={s.vazio} cx={68} cy={144} r={13} />
        <circle className={s.vazio} cx={124} cy={144} r={13} />

        {/* cabo vermelho: do pack ao positive terminal */}
        <path
          className={s.traco2}
          style={{strokeWidth: 4}}
          d="M 166 88 C 206 64, 252 54, 296 80"
          fill="none"
        />
        {/* cabo preto: do pack ao metal do motor, longe da battery */}
        <path
          className={s.cabo}
          style={{strokeWidth: 4}}
          d="M 166 164 C 220 192, 272 206, 332 222"
          fill="none"
        />

        {/* os dois clamps, encostados e não por cima */}
        <rect className={s.preenche2} x={292} y={72} width={32} height={24} rx={5} />
        <rect className={s.escuro} x={330} y={216} width={46} height={22} rx={5} />

        {/* onde o clamp preto não vai */}
        <g className={s.traco3} style={{strokeWidth: 3.4}}>
          <line x1={432} y1={71} x2={460} y2={99} />
          <line x1={460} y1={71} x2={432} y2={99} />
        </g>

        <Numero x={288} y={40} n="1" />
        <Numero x={262} y={248} n="2" />

        <RotuloTermo k="jump pack" texto="jump pack" x={96} y={220} anchor="middle" fs={16} />
        <RotuloTermo
          k="battery"
          texto="battery"
          x={388}
          y={204}
          anchor="middle"
          para={[400, 188]}
          fs={16}
        />
        <RotuloTermo k="cylinder block" texto="engine block" x={440} y={250} anchor="middle" fs={16} />
        <RotuloTermo
          texto="não aqui"
          x={478}
          y={128}
          anchor="start"
          para={[452, 106]}
          fs={16}
          tone={3}
        />
      </svg>
      {caption && <figcaption className={s.caption}>{caption}</figcaption>}
    </figure>
  );
}
