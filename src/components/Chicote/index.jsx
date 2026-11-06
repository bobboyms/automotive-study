import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import styles from '../Simbolos/styles.module.css';

// O wiring harness e suas conexões, em três figuras:
//
//   conector — as duas connector halves e a locking tab que as segura, com
//              a seta no ponto em que o dedo aperta para soltar;
//   terminal — o mesmo conector em corte: o terminal preso pela locking tab
//              interna e o terminal removal tool entrando para soltá-la;
//   protecao — um trecho de chicote com conduit, wire tie, grommet na chapa
//              e clip.
//
// Um tom só, o 1 (azul), e sempre para a mesma coisa: o que a mão faz.
// Peça e chapa ficam na cor do texto, como nos outros desenhos da TRN-120.

const W = 480;
const FS = 15;

// Seta de ação, no tom 1.
function Seta({de, para}) {
  const ang = Math.atan2(para[1] - de[1], para[0] - de[0]);
  const p = (a) =>
    `${para[0] - 10 * Math.cos(ang + a)} ${para[1] - 10 * Math.sin(ang + a)}`;
  return (
    <g className={styles.seta}>
      <line x1={de[0]} y1={de[1]} x2={para[0]} y2={para[1]} />
      <path d={`M ${p(0.5)} L ${para[0]} ${para[1]} L ${p(-0.5)}`} />
    </g>
  );
}

// --------------------------------------------------------------- conector

const PINOS = [85, 105, 125];

function Conector() {
  return (
    <>
      {/* wires que chegam */}
      {PINOS.map((y) => (
        <line key={`a${y}`} className={styles.fio} x1={20} y1={y} x2={60} y2={y} />
      ))}
      {/* male connector half */}
      <rect className={styles.parte} x={60} y={70} width={120} height={70} rx={6} />
      {PINOS.map((y) => (
        <line key={`p${y}`} className={styles.fio} x1={180} y1={y} x2={205} y2={y} />
      ))}
      {/* o tracejado liga cada pino à sua cavidade: as duas metades estão
          desenhadas separadas para que pinos e cavidades apareçam, mas é
          nessa direção que elas se encaixam */}
      {PINOS.map((y) => (
        <line key={`t${y}`} className={styles.tracejado} x1={205} y1={y} x2={230} y2={y} />
      ))}

      {/* female connector half */}
      <rect className={styles.parte} x={230} y={62} width={120} height={86} rx={6} />
      {PINOS.map((y) => (
        <rect
          key={`c${y}`}
          className={styles.contato}
          x={230}
          y={y - 6}
          width={26}
          height={12}
        />
      ))}
      {/* locking tab */}
      <polygon className={styles.parte} points="255,62 300,62 295,48 260,48" />

      {/* wires que saem */}
      {PINOS.map((y) => (
        <line key={`s${y}`} className={styles.fio} x1={350} y1={y} x2={420} y2={y} />
      ))}

      <Seta de={[277, 16]} para={[277, 44]} />
      <RotuloTermo texto="aperte aqui" x={252} y={28} anchor="end" fs={FS} tone={1} />
      <RotuloTermo k="locking tab" x={312} y={28} anchor="start" para={[292, 54]} fs={FS} />
      <RotuloTermo
        k="male connector half"
        texto={'male\nconnector half'}
        x={120}
        y={168}
        anchor="middle"
        para={[120, 140]}
        fs={FS}
      />
      <RotuloTermo
        k="female connector half"
        texto={'female\nconnector half'}
        x={290}
        y={168}
        anchor="middle"
        para={[290, 148]}
        fs={FS}
      />
    </>
  );
}

// --------------------------------------------------------------- terminal

function Terminal() {
  return (
    <>
      {/* corpo do conector em corte, com a frente aberta à esquerda: é por
          ela que a ferramenta entra, e deixar a parede fechada fazia a
          ferramenta parecer atravessar o plástico */}
      <path
        className={styles.parte}
        d="M 120 68 L 334 68 Q 340 68 340 74 L 340 146 Q 340 152 334 152 L 120 152"
        style={{fill: 'none'}}
      />
      <line className={styles.fino} x1={120} y1={68} x2={120} y2={82} />
      <line className={styles.fino} x1={120} y1={128} x2={120} y2={152} />
      {/* terminal dentro, e o wire que sai por trás */}
      <rect className={styles.metal} x={150} y={92} width={150} height={26} rx={4} />
      {/* a janela do terminal, em que a ponta da tab se encaixa */}
      <rect className={styles.parte} x={206} y={92} width={18} height={12} />
      <line className={styles.fio} x1={300} y1={105} x2={440} y2={105} />
      {/* locking tab interna: desce do teto e entra na janela do terminal.
          Antes ela só encostava no topo do metal, e a figura não mostrava o
          que prende o terminal no lugar */}
      <path className={styles.fio} d="M 215 68 L 215 102" />

      {/* terminal removal tool: entra pela frente, por cima do terminal, e
          levanta a tab */}
      <line className={styles.correnteFio} x1={54} y1={86} x2={208} y2={86} />

      <Seta de={[392, 140]} para={[448, 140]} />

      <RotuloTermo
        k="terminal removal tool"
        texto={'terminal\nremoval tool'}
        x={40}
        y={32}
        anchor="start"
        de={[106, 60]}
        para={[122, 87]}
        fs={FS}
      />
      <RotuloTermo k="locking tab" x={252} y={36} anchor="start" para={[216, 74]} fs={FS} />
      <RotuloTermo k="terminal" x={178} y={138} anchor="middle" para={[178, 118]} fs={FS} />
      <RotuloTermo texto="puxe o wire" x={360} y={166} anchor="start" fs={FS} tone={1} />
    </>
  );
}

// --------------------------------------------------------------- protecao

const FIOS = [100, 111, 122];

function Protecao() {
  const nervuras = [];
  for (let x = 54; x < 205; x += 14) nervuras.push(x);
  return (
    <>
      {/* chapa da carroceria, em corte, com o furo por onde o chicote passa.
          Ela vai de borda a borda do desenho de propósito: recortada no meio
          da altura, lia como dois postes, e não como uma parede */}
      <rect className={styles.escuro} x={288} y={-2} width={22} height={80} />
      <rect className={styles.escuro} x={288} y={132} width={22} height={70} />

      {/* conduit sobre o primeiro trecho */}
      <rect className={styles.parte} x={40} y={92} width={165} height={38} rx={5} />
      {nervuras.map((x) => (
        <line key={x} className={styles.fino} x1={x} y1={93} x2={x} y2={129} />
      ))}
      {/* wire tie por cima do conduit */}
      <rect className={styles.parte} x={155} y={88} width={12} height={46} rx={2} />

      {/* o chicote segue inteiro pelo furo; o grommet é a borracha que
          forra a borda da chapa de um lado e do outro do furo */}
      {FIOS.map((y) => (
        <line key={`a${y}`} className={styles.fio} x1={205} y1={y} x2={460} y2={y} />
      ))}
      <rect className={styles.parte} x={276} y={70} width={46} height={16} rx={5} />
      <rect className={styles.parte} x={276} y={124} width={46} height={16} rx={5} />

      {/* clip: cinta que abraça o chicote e sobe até uma base da carroceria.
          Desenhado opaco como o wire tie, e não como um quadro em volta dos
          wires: o quadro cruzava os três wires nas laterais e lia como
          ligação */}
      <rect className={styles.parte} x={424} y={88} width={12} height={46} rx={2} />
      <line className={styles.fio} x1={430} y1={88} x2={430} y2={74} />
      <rect className={styles.escuro} x={414} y={64} width={32} height={10} />

      <RotuloTermo k="conduit" x={90} y={62} anchor="middle" para={[90, 92]} fs={FS} />
      <RotuloTermo k="wire tie" x={161} y={166} anchor="middle" para={[161, 134]} fs={FS} />
      <RotuloTermo k="grommet" x={326} y={60} anchor="start" para={[318, 78]} fs={FS} />
      <RotuloTermo k="clip" x={430} y={44} anchor="middle" para={[430, 64]} fs={FS} />
    </>
  );
}

const MODOS = {
  conector: {
    H: 200,
    corpo: Conector,
    alt: 'As duas metades de um connector encaixadas, com a locking tab em cima e a seta no ponto em que se aperta para soltar.',
  },
  terminal: {
    H: 200,
    corpo: Terminal,
    alt: 'O connector em corte: o terminal preso pela locking tab interna e a ferramenta entrando para levantá-la.',
  },
  protecao: {
    H: 200,
    corpo: Protecao,
    alt: 'Um trecho de chicote com conduit, wire tie, grommet na chapa e clip.',
  },
};

export default function Chicote({modo = 'conector', caption}) {
  const {H, corpo: Corpo, alt} = MODOS[modo] || MODOS.conector;
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
