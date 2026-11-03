import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import RotuloTermo from '../diagramas/RotuloTermo';
import {Seta} from '../diagramas/util';
import s from '../diagramas/pecas.module.css';

// A lead-acid battery em corte, em três figuras.
//
//   celula   uma cell por dentro: positive plates, negative plates,
//            separators e electrolyte, e os 2.1 V que ela produz
//   bateria  as seis cells em série dentro do battery case, com os cell
//            straps e os dois terminals: 6 × 2.1 V = 12.6 V
//   risco    os dois riscos que andam juntos: o hydrogen gas que sai pelo
//            vent cap e a current enorme que uma ferramenta de metal faz
//            passar quando encosta nos dois terminals ao mesmo tempo
//
// Tons: 1 (azul) é o líquido e a current; 2 (laranja) é a positive plate e a
// faísca; 3 (verde) é o gás, que aqui é o perigo.
//
// Três materiais, três preenchimentos, para o aluno distinguir à primeira
// vista: positive plate laranja, negative plate cinza escuro, separator na
// cor do papel. A primeira versão usava cinza claro na negative plate e
// cinza médio no separator, e os dois se confundiam na folha de conferência.

function Figura({W, H, caption, children}) {
  return (
    <figure className={s.figure}>
      <svg
        className={s.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption}
      >
        {children}
      </svg>
      {caption && <figcaption className={s.caption}>{caption}</figcaption>}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* celula                                                              */

const NEG = [139, 203, 267, 331];
const POS = [171, 235, 299];
const SEP = [155, 187, 219, 251, 283, 315];

function Celula({caption}) {
  return (
    <Figura W={470} H={336} caption={caption}>
      {/* a voltage da cell, entre os dois posts */}
      <path className={s.fina} d="M 139 54 L 139 38 L 299 38 L 299 54" />
      <SvgMath x={219} y={22} math="2.1\,\text{V}" fontSize={16} />

      {/* battery case da cell */}
      <rect className={s.vazio} x={110} y={70} width={250} height={188} rx={6} />

      {/* electrolyte: a superfície fica abaixo dos straps */}
      <rect className={s.preenche1} x={116} y={110} width={238} height={142} />

      {/* separators */}
      {SEP.map((x) => (
        <rect key={x} className={s.vazio} x={x - 3} y={112} width={6} height={134} />
      ))}

      {/* negative plates, penduradas no strap de baixo */}
      <rect className={s.escuro} x={132} y={96} width={206} height={8} rx={3} />
      {NEG.map((x) => (
        <rect key={x} className={s.escuro} x={x - 7} y={100} width={14} height={146} />
      ))}
      <rect className={s.escuro} x={132} y={52} width={14} height={50} rx={2} />

      {/* positive plates: elas atravessam o strap negativo sem tocá-lo. O
          retângulo da cor do papel abre o vão por onde cada uma passa. */}
      {POS.map((x) => (
        <rect key={x} x={x - 11} y={92} width={22} height={16} fill="var(--mv-paper)" />
      ))}
      {POS.map((x) => (
        <rect key={x} className={s.preenche2} x={x - 7} y={84} width={14} height={162} />
      ))}
      <rect className={s.preenche2} x={164} y={80} width={142} height={8} rx={3} />
      <rect className={s.preenche2} x={292} y={52} width={14} height={32} rx={2} />

      <SvgMath x={120} y={62} math="-" fontSize={17} />
      <SvgMath x={320} y={62} math="+" fontSize={17} />

      <RotuloTermo k="cell" texto="cell" x={100} y={88} anchor="end" para={[112, 78]} fs={15} />
      <RotuloTermo
        k="electrolyte"
        texto="electrolyte"
        x={100}
        y={200}
        anchor="end"
        para={[123, 200]}
        fs={15}
      />
      <RotuloTermo
        k="negative plate"
        texto="negative plate"
        x={140}
        y={288}
        anchor="middle"
        para={[139, 248]}
        fs={15}
      />
      <RotuloTermo
        k="positive plate"
        texto="positive plate"
        x={320}
        y={288}
        anchor="middle"
        para={[299, 248]}
        fs={15}
      />
      <RotuloTermo
        k="separator"
        texto="separator"
        x={235}
        y={318}
        anchor="middle"
        para={[219, 250]}
        fs={15}
      />
    </Figura>
  );
}

/* ------------------------------------------------------------------ */
/* bateria                                                             */

const CENTROS = [76.7, 150, 223.3, 296.7, 370, 443.3];
const PAREDES = [113.3, 186.7, 260, 333.3, 406.7];

function Doze({caption}) {
  return (
    <Figura W={520} H={288} caption={caption}>
      <rect className={s.vazio} x={40} y={86} width={440} height={140} rx={6} />

      {CENTROS.map((c, i) => (
        <g key={i}>
          {[-24, -12, 0, 12, 24].map((d, j) => (
            <rect
              key={j}
              className={j % 2 ? s.preenche2 : s.escuro}
              x={c + d - 3.5}
              y={110}
              width={7}
              height={92}
            />
          ))}
          <SvgMath x={c} y={214} math="2.1\,\text{V}" fontSize={15} />
        </g>
      ))}

      {PAREDES.map((p) => (
        <line key={p} className={s.linha} x1={p} y1={86} x2={p} y2={226} />
      ))}
      {PAREDES.map((p) => (
        <rect key={`s${p}`} className={s.metal} x={p - 26} y={94} width={52} height={9} rx={3} />
      ))}

      <rect className={s.metal} x={64} y={64} width={13} height={40} rx={2} />
      <rect className={s.metal} x={443} y={64} width={13} height={40} rx={2} />
      <SvgMath x={50} y={78} math="+" fontSize={17} />
      <SvgMath x={470} y={78} math="-" fontSize={17} />

      <RotuloTermo k="terminal" texto="terminal" x={70} y={42} anchor="middle" para={[70, 62]} fs={16} />
      <RotuloTermo
        k="cell strap"
        texto="cell strap"
        x={238}
        y={42}
        anchor="middle"
        para={[187, 92]}
        fs={16}
      />

      <SvgMath x={260} y={258} math="6 \times 2.1\,\text{V} = 12.6\,\text{V}" fontSize={18} />
    </Figura>
  );
}

/* ------------------------------------------------------------------ */
/* risco                                                               */

const PLACAS_RISCO = [170, 206.7, 243.3, 280, 316.7, 353.3, 390];
// bolhas dentro do battery case, acima do electrolyte
const BOLHAS = [
  [168, 182, 5],
  [196, 172, 4],
  [226, 184, 5],
  [258, 174, 4],
  [300, 184, 5],
  [330, 172, 4],
  [364, 183, 5],
  [396, 174, 4],
];
// bolhas saindo pelo vent cap, no canto direito do cover
const ESCAPE = [
  [404, 127, 5],
  [411, 111, 6],
  [401, 95, 5],
  [409, 79, 6],
  [403, 65, 4],
];

function Risco({caption}) {
  return (
    <Figura W={560} H={312} caption={caption}>
      <rect className={s.vazio} x={140} y={150} width={280} height={130} rx={6} />
      <rect className={s.preenche1} x={146} y={196} width={268} height={78} />
      {PLACAS_RISCO.map((x, i) => (
        <rect
          key={i}
          className={i % 2 ? s.preenche2 : s.escuro}
          x={x - 5}
          y={202}
          width={10}
          height={66}
        />
      ))}

      {BOLHAS.map(([cx, cy, r], i) => (
        <circle key={i} className={s.preenche3} cx={cx} cy={cy} r={r} />
      ))}

      {/* vent cap, no canto direito do cover */}
      <path className={s.metal} d="M 388 150 L 392 137 L 412 137 L 416 150 Z" />
      {ESCAPE.map(([cx, cy, r], i) => (
        <circle key={i} className={s.preenche3} cx={cx} cy={cy} r={r} />
      ))}

      {/* os dois posts */}
      <rect className={s.metal} x={182} y={118} width={16} height={34} rx={2} />
      <rect className={s.metal} x={362} y={118} width={16} height={34} rx={2} />

      {/* a ferramenta de metal caída sobre os dois posts */}
      <rect className={s.metal} x={176} y={100} width={208} height={18} rx={4} />
      <rect className={s.metal} x={170} y={94} width={26} height={30} rx={3} />
      <rect className={s.metal} x={364} y={94} width={26} height={30} rx={3} />

      <Seta de={[226, 109]} para={[336, 109]} cls={s.traco1} largura={3.4} />
      <SvgMath x={281} y={80} math="I \approx 400\,\text{A}" fontSize={16} tone={1} />

      {/* faísca no ponto em que a ferramenta encosta no post */}
      <g className={s.traco2} style={{strokeWidth: 3}}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (Math.PI * 2 * (i + 0.25)) / 6;
          return (
            <line
              key={i}
              x1={186 + 6 * Math.cos(a)}
              y1={124 + 6 * Math.sin(a)}
              x2={186 + 15 * Math.cos(a)}
              y2={124 + 15 * Math.sin(a)}
            />
          );
        })}
      </g>

      <RotuloTermo
        texto="chave de boca"
        x={130}
        y={74}
        anchor="end"
        para={[180, 96]}
        fs={16}
      />
      <RotuloTermo k="spark" texto="spark" x={126} y={150} anchor="end" para={[176, 136]} fs={16} tone={2} />
      <RotuloTermo
        k="sulfuric acid"
        texto="sulfuric acid"
        x={130}
        y={236}
        anchor="end"
        para={[152, 236]}
        fs={16}
      />
      <RotuloTermo
        k="hydrogen gas"
        texto="hydrogen gas"
        x={405}
        y={40}
        anchor="middle"
        para={[405, 55]}
        fs={16}
        tone={3}
      />
    </Figura>
  );
}

/* ------------------------------------------------------------------ */

export default function Bateria({modo = 'celula', caption}) {
  if (modo === 'bateria') return <Doze caption={caption} />;
  if (modo === 'risco') return <Risco caption={caption} />;
  return <Celula caption={caption} />;
}
