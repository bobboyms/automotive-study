import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import styles from './styles.module.css';

// O multímetro ligado a um circuito de uma lâmpada, nas cinco medições que a
// oficina usa: tensão da fonte, tensão disponível, queda de tensão, corrente e
// resistência. A ponta vermelha sai no tom 2 e a preta na cor do texto, para
// lembrar a cor dos fios de verdade.
//
// Regras de desenho, conferidas com `npm run figuras`:
// - nenhuma ponta cruza um fio do circuito: um cruzamento sem ponto, para quem
//   está começando, parece uma ligação. Por isso o multímetro muda de lugar
//   conforme o ponto medido: à direita do circuito quando as pontas vão à
//   lâmpada ou à massa; em cima quando vão ao fio de cima;
// - os nomes das entradas (A, COM, VΩ) ficam acima dos furos, porque as pontas
//   saem para baixo e riscariam o texto;
// - quando a vermelha precisa cruzar a preta, ela passa por cima, com uma borda
//   da cor do papel que deixa o cruzamento claro;
// - todo texto tem pelo menos 16 unidades num desenho de 520: no celular, com a
//   figura reduzida a cerca de 358 px, isso dá 11 px.

const W = 520;
const FS = 16; // tamanho dos rótulos
const MW = 150; // largura do multímetro
const MH = 100; // altura do multímetro

// Duas montagens. `direita`: o multímetro ao lado do circuito, para medir na
// lâmpada e na massa. `cima`: o multímetro em cima, para medir no fio de cima.
const LAYOUT = {
  direita: {
    L: 70, R: 300, T: 70, B: 240,
    FUSE_X: 130, SWITCH_X: 200, OXI_X: 250,
    MX: 350, MY: 24,
  },
  cima: {
    L: 70, R: 440, T: 180, B: 320,
    FUSE_X: 130, SWITCH_X: 200, OXI_X: 385,
    MX: 185, MY: 10,
  },
};

const ROT = {right: 0, down: 90, left: 180, up: 270};
function Seta({x, y, dir}) {
  return (
    <path
      className={styles.arrow}
      d="M -6 -7 L 4 0 L -6 7"
      transform={`translate(${x} ${y}) rotate(${ROT[dir]})`}
    />
  );
}

function jacks(MX, MY) {
  const y = MY + 84;
  return {
    y,
    A: MX + 30,
    COM: MX + 75,
    V: MX + 120,
  };
}

// Ponta de prova: curva da entrada até o ponto medido, com uma borda da cor do
// papel por baixo — é ela que separa as duas pontas quando uma cruza a outra.
function Ponta({de, para, c1, c2, cor, J}) {
  const d = `M ${J[de]} ${J.y} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${para[0]} ${para[1]}`;
  const vermelha = cor === 'vermelha';
  return (
    <g>
      {/* só a vermelha precisa da borda: ela é desenhada por cima da preta */}
      {vermelha && <path className={styles.casing} d={d} />}
      <path className={vermelha ? styles.leadRed : styles.leadBlack} d={d} />
      <circle
        className={vermelha ? styles.tipRed : styles.tipBlack}
        cx={para[0]}
        cy={para[1]}
        r={4.5}
      />
    </g>
  );
}

function Multimetro({leitura, vermelhaEm, MX, MY}) {
  const J = jacks(MX, MY);
  return (
    <g>
      <rect className={styles.meter} x={MX} y={MY} width={MW} height={MH} rx={8} />
      <rect
        className={styles.display}
        x={MX + 12}
        y={MY + 10}
        width={MW - 24}
        height={34}
        rx={3}
      />
      <SvgMath x={MX + MW / 2} y={MY + 27} math={leitura} fontSize={22} />
      {['A', 'COM', 'V'].map((k) => (
        <g key={k}>
          <SvgMath
            x={J[k]}
            y={MY + 62}
            math={k === 'V' ? '\\text{V}\\Omega' : `\\text{${k}}`}
            fontSize={15}
          />
          <circle
            className={
              k === 'COM' ? styles.jackBlack : k === vermelhaEm ? styles.jackRed : styles.jack
            }
            cx={J[k]}
            cy={J.y}
            r={6}
          />
        </g>
      ))}
    </g>
  );
}

// Lâmpada em pé (terminais em cima e embaixo) ou deitada (à esquerda e à direita).
function Lampada({x, y, deitada = false}) {
  const t = deitada
    ? [
        [x - 22, y, x - 17, y],
        [x + 17, y, x + 22, y],
      ]
    : [
        [x, y - 22, x, y - 17],
        [x, y + 17, x, y + 22],
      ];
  return (
    <g>
      <circle className={styles.lamp} cx={x} cy={y} r={17} />
      <line className={styles.wire} x1={x - 12} y1={y - 12} x2={x + 12} y2={y + 12} />
      <line className={styles.wire} x1={x + 12} y1={y - 12} x2={x - 12} y2={y + 12} />
      {t.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}`} className={styles.wire} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
    </g>
  );
}

function Figura({H, caption, children}) {
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || 'Multímetro medindo.'}
      >
        {children}
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}

export default function Medicao({
  modo = 'disponivel',
  leitura = '12\\,\\text{V}',
  alvo = 'carga',
  semCarga = false,
  oxidacao = false,
  corrente = true,
  caption,
}) {
  // A ponta preta vai sempre no COM. A vermelha vai no V/Ω, menos na corrente.
  const vermelhaEm = modo === 'corrente' ? 'A' : 'V';

  // Tensão da fonte: a bateria sozinha, embaixo do multímetro. A preta desce
  // para o polo −, à esquerda; a vermelha para o +, à direita: não se cruzam.
  if (modo === 'fonte') {
    const MX = 185;
    const MY = 10;
    const J = jacks(MX, MY);
    return (
      <Figura H={318} caption={caption}>
        <rect className={styles.battery} x={185} y={190} width={150} height={80} rx={6} />
        <rect className={styles.post} x={214} y={180} width={22} height={10} />
        <rect className={styles.post} x={284} y={180} width={22} height={10} />
        <SvgMath x={225} y={208} math="-" fontSize={20} />
        <SvgMath x={295} y={208} math="+" fontSize={20} />
        <SvgMath x={260} y={246} math="\text{bateria}" fontSize={FS} />
        <Ponta J={J} de="COM" para={[225, 180]} c1={[J.COM, 140]} c2={[225, 150]} cor="preta" />
        <Ponta J={J} de="V" para={[295, 180]} c1={[J.V, 140]} c2={[295, 150]} cor="vermelha" />
        <SvgMath x={260} y={296} math="\text{nenhuma carga ligada}" fontSize={FS} />
        <Multimetro leitura={leitura} vermelhaEm={vermelhaEm} MX={MX} MY={MY} />
      </Figura>
    );
  }

  // Resistência: a lâmpada fora do circuito, deitada embaixo do multímetro,
  // com um terminal embaixo de cada entrada. As pontas descem retas.
  if (modo === 'resistencia') {
    const MX = 185;
    const MY = 10;
    const J = jacks(MX, MY);
    const cx = (J.COM + J.V) / 2;
    return (
      <Figura H={262} caption={caption}>
        <Lampada x={cx} y={190} deitada />
        <Ponta J={J} de="COM" para={[cx - 22, 190]} c1={[J.COM, 150]} c2={[cx - 22, 160]} cor="preta" />
        <Ponta J={J} de="V" para={[cx + 22, 190]} c1={[J.V, 150]} c2={[cx + 22, 160]} cor="vermelha" />
        <SvgMath x={cx} y={240} math="\text{lâmpada fora do circuito}" fontSize={FS} />
        <Multimetro leitura={leitura} vermelhaEm={vermelhaEm} MX={MX} MY={MY} />
      </Figura>
    );
  }

  const noFioDeCima = modo === 'corrente' || (modo === 'queda' && alvo === 'oxidacao');
  const G = LAYOUT[noFioDeCima ? 'cima' : 'direita'];
  const {L, R, T, B, FUSE_X, SWITCH_X, OXI_X, MX, MY} = G;
  const J = jacks(MX, MY);
  const BAT_Y = (T + B) / 2;
  const LOAD_Y = BAT_Y;
  const GAP = [255, 305]; // onde o circuito é aberto para o amperímetro
  const aberto = modo === 'corrente' ? false : semCarga;
  const circula = corrente && !semCarga;
  const massaPorBaixo = modo === 'queda' && alvo === 'massa';
  const H = Math.max(MY + MH, B) + (massaPorBaixo ? 66 : 30);

  // Fio de cima, cortado nos elementos.
  const cortes = [
    [FUSE_X - 18, FUSE_X + 18],
    [SWITCH_X - 18, SWITCH_X + 18],
  ];
  if (oxidacao) cortes.push([OXI_X - 16, OXI_X + 16]);
  if (modo === 'corrente') cortes.push(GAP);
  cortes.sort((a, b) => a[0] - b[0]);
  const segs = [];
  let cur = L;
  cortes.forEach(([a, b]) => {
    segs.push([cur, a]);
    cur = b;
  });
  segs.push([cur, R]);

  const topLamp = [R, LOAD_Y - 22];
  const botLamp = [R, LOAD_Y + 22];

  // As pontas. A preta é desenhada primeiro, para a vermelha passar por cima.
  let pontas;
  if (modo === 'corrente') {
    // vermelha no A, à esquerda; preta no COM, à direita: não se cruzam
    pontas = (
      <g>
        <Ponta J={J} de="COM" para={[GAP[1], T]} c1={[J.COM, 140]} c2={[GAP[1], 140]} cor="preta" />
        <Ponta J={J} de="A" para={[GAP[0], T]} c1={[J.A, 140]} c2={[GAP[0], 140]} cor="vermelha" />
      </g>
    );
  } else if (alvo === 'oxidacao') {
    // vermelha no lado da bateria do conector, preta no lado da lâmpada
    pontas = (
      <g>
        <Ponta J={J} de="COM" para={[OXI_X + 16, T]} c1={[J.COM + 40, 122]} c2={[OXI_X + 16, 118]} cor="preta" />
        <Ponta J={J} de="V" para={[OXI_X - 16, T]} c1={[J.V, 160]} c2={[OXI_X - 16, 140]} cor="vermelha" />
      </g>
    );
  } else if (massaPorBaixo) {
    // vermelha no terminal de massa da lâmpada; preta no negativo da bateria,
    // passando por baixo do circuito
    pontas = (
      <g>
        <Ponta J={J} de="COM" para={[L, B]} c1={[J.COM, B + 70]} c2={[L, B + 70]} cor="preta" />
        <Ponta J={J} de="V" para={botLamp} c1={[J.V, botLamp[1] + 10]} c2={[R + 40, botLamp[1]]} cor="vermelha" />
      </g>
    );
  } else if (modo === 'queda') {
    // uma ponta de cada lado da lâmpada, as duas chegando pela direita
    pontas = (
      <g>
        <Ponta J={J} de="COM" para={botLamp} c1={[J.COM, botLamp[1] + 10]} c2={[R + 40, botLamp[1]]} cor="preta" />
        <Ponta J={J} de="V" para={topLamp} c1={[J.V, topLamp[1] + 30]} c2={[R + 40, topLamp[1]]} cor="vermelha" />
      </g>
    );
  } else {
    // tensão disponível: vermelha no terminal positivo da lâmpada, preta na
    // massa (o canto do fio de baixo)
    pontas = (
      <g>
        <Ponta J={J} de="COM" para={[R, B]} c1={[J.COM, B - 10]} c2={[R + 40, B]} cor="preta" />
        <Ponta J={J} de="V" para={topLamp} c1={[J.V, topLamp[1] + 30]} c2={[R + 40, topLamp[1]]} cor="vermelha" />
      </g>
    );
  }

  return (
    <Figura H={H} caption={caption}>
      {/* circuito */}
      {segs.map(([a, b]) => (
        <line key={a} className={styles.wire} x1={a} y1={T} x2={b} y2={T} />
      ))}
      <line className={styles.wire} x1={L} y1={T} x2={L} y2={BAT_Y - 7} />
      <line className={styles.wire} x1={L} y1={BAT_Y + 7} x2={L} y2={B} />
      <line className={styles.plate} x1={L - 20} y1={BAT_Y - 7} x2={L + 20} y2={BAT_Y - 7} />
      <line className={styles.plateShort} x1={L - 11} y1={BAT_Y + 7} x2={L + 11} y2={BAT_Y + 7} />
      <SvgMath x={L + 28} y={BAT_Y - 16} math="+" anchor="start" fontSize={FS} />
      <SvgMath x={L + 28} y={BAT_Y + 16} math="-" anchor="start" fontSize={FS} />
      <SvgMath x={L - 26} y={BAT_Y} math="12\,\text{V}" anchor="end" fontSize={FS} />

      {/* fusível */}
      <rect className={styles.part} x={FUSE_X - 18} y={T - 8} width={36} height={16} rx={3} />
      <path
        className={styles.wireThin}
        d={`M ${FUSE_X - 18} ${T} C ${FUSE_X - 6} ${T - 9}, ${FUSE_X + 6} ${T + 9}, ${FUSE_X + 18} ${T}`}
      />
      {/* interruptor fechado */}
      <line className={styles.wire} x1={SWITCH_X - 18} y1={T} x2={SWITCH_X + 18} y2={T} />
      <circle className={styles.contact} cx={SWITCH_X - 15} cy={T} r={3} />
      <circle className={styles.contact} cx={SWITCH_X + 15} cy={T} r={3} />

      {/* conector oxidado */}
      {oxidacao && (
        <g>
          <path
            className={styles.fault}
            d={`M ${OXI_X - 16} ${T} l 4 -7 l 6 14 l 6 -14 l 6 14 l 6 -14 l 4 7`}
          />
          <SvgMath x={OXI_X} y={T + 24} math="\text{oxidado}" fontSize={FS} tone={3} />
        </g>
      )}

      {/* pontas abertas do circuito, onde entra o amperímetro */}
      {modo === 'corrente' && (
        <g>
          <circle className={styles.openEnd} cx={GAP[0]} cy={T} r={3.5} />
          <circle className={styles.openEnd} cx={GAP[1]} cy={T} r={3.5} />
        </g>
      )}

      {/* lâmpada, ou o soquete vazio */}
      <line className={styles.wire} x1={R} y1={T} x2={R} y2={LOAD_Y - 22} />
      <line className={styles.wire} x1={R} y1={LOAD_Y + 22} x2={R} y2={B} />
      {aberto ? (
        <g>
          <circle className={styles.openEnd} cx={R} cy={LOAD_Y - 22} r={3.5} />
          <circle className={styles.openEnd} cx={R} cy={LOAD_Y + 22} r={3.5} />
          <SvgMath x={R - 14} y={LOAD_Y} math="\text{sem lâmpada}" anchor="end" fontSize={FS} />
        </g>
      ) : (
        <Lampada x={R} y={LOAD_Y} />
      )}

      {/* fio de baixo: o retorno pela massa */}
      <line className={styles.wire} x1={L} y1={B} x2={R} y2={B} />
      <SvgMath x={L + 80} y={B - 18} math="\text{massa}" fontSize={FS} />

      {/* corrente */}
      {circula && (
        <g>
          <Seta x={(FUSE_X + SWITCH_X) / 2} y={T} dir="right" />
          <Seta x={R} y={(LOAD_Y + 22 + B) / 2} dir="down" />
          <Seta x={(L + R) / 2 + 40} y={B} dir="left" />
          <Seta x={L} y={(BAT_Y + B) / 2 + 8} dir="up" />
        </g>
      )}

      {pontas}
      {/* o multímetro por cima das pontas: a caixa esconde o pedaço de cada
          ponta que fica dentro dela, e o furo aparece como o plugue encaixado */}
      <Multimetro leitura={leitura} vermelhaEm={vermelhaEm} MX={MX} MY={MY} />
    </Figura>
  );
}
