import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import styles from './styles.module.css';

// O circuit do midterm practical da TRN-120 e as seis medições que o instrutor
// pede nele. O circuit é um laço em série: battery, fuse, switch, primeira bulb,
// segunda bulb e volta pelo ground.
//
// Por que o circuit é desenhado em pé, e não deitado como no `Medicao`: o
// instrutor chama **top** o terminal por onde a power entra numa peça e
// **bottom** aquele por onde ela sai. Esses dois nomes só ficam óbvios se a
// power realmente descer na página. Num desenho deitado o aluno teria de
// decorar que "top" quer dizer "o lado da esquerda".
//
// Regras de desenho, conferidas com `npm run figuras`:
// - nenhuma ponta de prova cruza um fio do circuit: o circuit ocupa a faixa
//   até x = C, e o meter fica todo à direita dela, então as pontas chegam
//   sempre pelo lado livre;
// - quando a ponta vermelha precisa cruzar a preta, passa por cima com uma
//   borda da cor do fundo (`casing`);
// - os nomes das entradas (A, COM, VΩ) ficam acima dos furos, porque as pontas
//   saem para baixo e riscariam um nome que estivesse embaixo;
// - cada modo tem a sua largura, encostada no desenho. Sobra à direita encolhe
//   a figura no celular sem motivo: a primeira versão desenhava tudo em 520 e
//   o circuit sozinho ocupava 360 deles.

const FS = 16;
const FS_MENOR = 15;

// Largura por modo, do tamanho do que cada um desenha.
const W_CIRCUITO = 470; // circuit mais meter ao lado
const W_FLUXO = 362; // só o circuit, com top e bottom
const W_SOZINHO = 360; // só o meter, ou o meter e uma peça

// Multímetro
const MW = 150;
const MH = 134;
const MX = 300; // nas figuras com circuit, o meter fica à direita dele

// Circuit em pé
const L = 86; // battery, no alto à esquerda
const C = 252; // a coluna por onde a power desce
const RAIL_Y = 34; // o wire que sai do + da battery
const PLATE_POS_Y = 58;
const PLATE_NEG_Y = 78;
const BAT_GND_Y = 120;
const COL_GND_Y = 540;

// Cada peça da coluna: centro e meia-altura (a distância do centro até o
// terminal). Os nomes `top` e `bottom` saem daqui.
const PECAS = [
  {id: 'fuse', nome: '\\text{fuse}', cy: 130, meia: 22},
  {id: 'switch', nome: '\\text{switch}', cy: 240, meia: 32},
  {id: 'bulb1', nome: '\\text{first bulb}', cy: 360, meia: 26},
  {id: 'bulb2', nome: '\\text{second bulb}', cy: 470, meia: 26},
];
const peca = (id) => PECAS.find((p) => p.id === id);
const topo = (p) => p.cy - p.meia;
const base = (p) => p.cy + p.meia;

// O vão aberto na coluna quando o wire é retirado para medir current: fica
// entre o bottom do switch e o top da primeira bulb.
const VAO = [base(peca('switch')) + 14, topo(peca('bulb1')) - 14];

const FUNCOES = {
  'volts DC': {rot: -55, texto: '\\text{volts DC}'},
  ohms: {rot: 0, texto: '\\text{ohms}'},
  amps: {rot: 55, texto: '\\text{amps}'},
};

// Entradas do meter. `y` é a linha dos furos; os nomes ficam 18 acima deles.
function jacks(mx, my) {
  return {y: my + 119, A: mx + 32, COM: mx + 75, V: mx + 118};
}

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

// Ponta de prova: curva da entrada do meter até o ponto medido. A vermelha leva
// uma borda da cor do fundo por baixo, que abre um vão na preta onde as duas se
// cruzam e mostra qual passa por cima.
function Ponta({de, para, c1, c2, cor, J}) {
  const d = `M ${J[de]} ${J.y} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${para[0]} ${para[1]}`;
  const vermelha = cor === 'vermelha';
  return (
    <g>
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

function Multimetro({leitura, funcao, vermelhaEm, mx, my}) {
  const J = jacks(mx, my);
  const f = FUNCOES[funcao];
  const dx = mx + 30;
  const dy = my + 67;
  return (
    <g>
      <rect className={styles.meter} x={mx} y={my} width={MW} height={MH} rx={8} />
      <rect className={styles.display} x={mx + 12} y={my + 10} width={MW - 24} height={36} rx={3} />
      <SvgMath x={mx + MW / 2} y={my + 28} math={leitura} fontSize={22} />
      {/* o seletor: a posição do ponteiro muda com a função escolhida */}
      <circle className={styles.dial} cx={dx} cy={dy} r={14} />
      <line
        className={styles.pointer}
        x1={dx}
        y1={dy}
        x2={dx}
        y2={dy - 11}
        transform={`rotate(${f.rot} ${dx} ${dy})`}
      />
      <SvgMath x={dx + 22} y={dy} math={f.texto} anchor="start" fontSize={FS_MENOR} />
      {['A', 'COM', 'V'].map((k) => (
        <g key={k}>
          <SvgMath
            x={J[k]}
            y={J.y - 18}
            math={k === 'V' ? '\\text{V}\\Omega' : `\\text{${k}}`}
            fontSize={FS_MENOR}
          />
          <circle
            className={
              k === 'COM' ? styles.jackBlack : k === vermelhaEm ? styles.jackRed : styles.jack
            }
            cx={J[k]}
            cy={J.y}
            r={7}
          />
        </g>
      ))}
    </g>
  );
}

function Ground({x, y}) {
  return (
    <g>
      <line className={styles.wire} x1={x - 17} y1={y} x2={x + 17} y2={y} />
      <line className={styles.wire} x1={x - 11} y1={y + 7} x2={x + 11} y2={y + 7} />
      <line className={styles.wire} x1={x - 5} y1={y + 14} x2={x + 5} y2={y + 14} />
    </g>
  );
}

// Bulb em pé (terminais em cima e embaixo) ou deitada (à esquerda e à direita).
function Bulb({x, y, deitada = false, r = 21}) {
  const d = r * 0.6;
  const t = deitada
    ? [
        [x - r - 5, y, x - r, y],
        [x + r, y, x + r + 5, y],
      ]
    : [
        [x, y - r - 5, x, y - r],
        [x, y + r, x, y + r + 5],
      ];
  return (
    <g>
      <circle className={styles.lamp} cx={x} cy={y} r={r} />
      <line className={styles.wire} x1={x - d} y1={y - d} x2={x + d} y2={y + d} />
      <line className={styles.wire} x1={x + d} y1={y - d} x2={x - d} y2={y + d} />
      {t.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}`} className={styles.wire} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
    </g>
  );
}

// Switch em pé ou deitado, no símbolo da casa (o mesmo de `Simbolos`): dois
// contatos e a lâmina entre eles. Fechado, a lâmina liga os dois; aberto, ela
// sai para o lado e o caminho fica interrompido.
//
// Os contatos ficam 6 para dentro dos terminais, e um pedacinho de wire os liga
// à ponta. É esse recuo que mantém o switch reconhecível na figura da voltage
// drop: sem ele, as duas pontas de prova pousam em cima dos contatos, tapam os
// dois, e o que sobra na tela é uma linha reta igual à de um wire.
const RECUO = 14;
function Switch({x, cy, meia, fechado, deitado = false}) {
  const d = meia - RECUO;
  const a = deitado ? [x - d, cy] : [x, cy - d];
  const b = deitado ? [x + d, cy] : [x, cy + d];
  const ponta = fechado ? b : deitado ? [b[0] - 6, b[1] - 17] : [b[0] + 17, b[1] - 6];
  const stubs = deitado
    ? [[x - meia, cy, a[0], cy], [b[0], cy, x + meia, cy]]
    : [[x, cy - meia, x, a[1]], [x, b[1], x, cy + meia]];
  return (
    <g>
      {stubs.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}`} className={styles.wire} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
      <line className={styles.wire} x1={a[0]} y1={a[1]} x2={ponta[0]} y2={ponta[1]} />
      <circle className={styles.contact} cx={a[0]} cy={a[1]} r={4} />
      <circle className={styles.contact} cx={b[0]} cy={b[1]} r={4} />
    </g>
  );
}

// Fuse em pé: a caixinha com o S dentro, o mesmo símbolo das outras figuras.
function Fuse({x, cy, meia}) {
  return (
    <g>
      <rect className={styles.part} x={x - 10} y={cy - meia} width={20} height={meia * 2} rx={3} />
      <path
        className={styles.wireThin}
        d={`M ${x} ${cy - meia} C ${x + 10} ${cy - meia / 2}, ${x - 10} ${cy + meia / 2}, ${x} ${cy + meia}`}
      />
    </g>
  );
}

function Figura({W, H, caption, children}) {
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || 'Multímetro medindo no circuit da bancada.'}
      >
        {children}
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}

export default function BancadaPratica({modo = 'fluxo', alvo = 'bulb1', leitura, caption}) {
  // Nas figuras sem circuit, o meter fica no meio da largura.
  const mxSozinho = (W_SOZINHO - MW) / 2;

  // ----------------------------------------------------------- meter fuses
  // O meter sozinho: a ponta vermelha sai do VΩ e encosta em cada entrada de
  // amps, uma de cada vez. A preta não entra nesta conferência.
  if (modo === 'fusiveis') {
    const my = 30;
    const J = jacks(mxSozinho, my);
    const base = J.y + 34; // de onde a ponta de prova sobe até a entrada A
    // a seta tracejada passa por baixo do meter, ligando as duas entradas
    const d = `M ${J.V} ${J.y} C ${J.V + 55} ${base + 54}, ${J.A - 55} ${base + 54}, ${J.A} ${base}`;
    return (
      <Figura W={W_SOZINHO} H={J.y + 130} caption={caption}>
        <Multimetro leitura={leitura ?? '0.4'} funcao="ohms" vermelhaEm="V" mx={mxSozinho} my={my} />
        {/* por cima do meter: é uma anotação, não um fio */}
        <path className={styles.guide} d={d} />
        {/* a ponta de prova encostando na entrada A. Ela é desenhada como uma
            cunha, e não como um furo preenchido: um furo vermelho no A leria
            como "a lead está plugada aqui também", que é o contrário do que a
            conferência manda fazer. */}
        <path
          className={styles.tipRed}
          d={`M ${J.A - 6} ${base + 4} L ${J.A + 6} ${base + 4} L ${J.A} ${J.y + 3} Z`}
        />
        <SvgMath x={W_SOZINHO / 2} y={J.y + 104} math="\text{a red lead só, do VΩ ao A}" fontSize={FS} />
      </Figura>
    );
  }

  // --------------------------------------------------------- source voltage
  // A battery sozinha: nada ligada nela, nenhuma current passando. As pontas
  // descem retas, a preta no negativo e a vermelha no positivo.
  if (modo === 'fonte') {
    const my = 20;
    const J = jacks(mxSozinho, my);
    const bx = W_SOZINHO / 2;
    const by = 248;
    return (
      <Figura W={W_SOZINHO} H={374} caption={caption}>
        <rect className={styles.battery} x={bx - 85} y={by} width={170} height={74} rx={6} />
        <rect className={styles.post} x={bx - 52} y={by - 11} width={24} height={11} />
        <rect className={styles.post} x={bx + 28} y={by - 11} width={24} height={11} />
        <SvgMath x={bx - 40} y={by + 22} math="-" fontSize={20} />
        <SvgMath x={bx + 40} y={by + 22} math="+" fontSize={20} />
        <SvgMath x={bx} y={by + 52} math="\text{battery}" fontSize={FS} />
        <Ponta
          J={J}
          de="COM"
          para={[bx - 40, by - 11]}
          c1={[J.COM, J.y + 50]}
          c2={[bx - 40, by - 60]}
          cor="preta"
        />
        <Ponta
          J={J}
          de="V"
          para={[bx + 40, by - 11]}
          c1={[J.V, J.y + 50]}
          c2={[bx + 40, by - 60]}
          cor="vermelha"
        />
        <SvgMath x={bx} y={352} math="\text{switch desligado, nenhuma load acesa}" fontSize={FS} />
        <Multimetro
          leitura={leitura ?? '12\\,\\text{V}'}
          funcao="volts DC"
          vermelhaEm="V"
          mx={mxSozinho}
          my={my}
        />
      </Figura>
    );
  }

  // ------------------------------------------------------------- resistance
  // A peça fora do circuit, deitada embaixo do meter, com um terminal embaixo
  // de cada entrada. O switch aparece fechado: é o detalhe que mais derruba
  // gente nesta medição.
  if (modo === 'resistencia') {
    const my = 20;
    const J = jacks(mxSozinho, my);
    const cx = W_SOZINHO / 2; // a peça no meio da figura, alinhada com o texto
    const cy = 250;
    const eSwitch = alvo === 'switch';
    // a bulb deitada tem os terminais em x ± (raio + 5); o switch, em x ± meia
    const meia = eSwitch ? 30 : 26;
    return (
      <Figura W={W_SOZINHO} H={346} caption={caption}>
        {eSwitch ? (
          <Switch x={cx} cy={cy} meia={meia} fechado deitado />
        ) : (
          <Bulb x={cx} y={cy} deitada />
        )}
        <Ponta
          J={J}
          de="COM"
          para={[cx - meia, cy]}
          c1={[J.COM, J.y + 50]}
          c2={[cx - meia, cy - 56]}
          cor="preta"
        />
        <Ponta
          J={J}
          de="V"
          para={[cx + meia, cy]}
          c1={[J.V, J.y + 50]}
          c2={[cx + meia, cy - 56]}
          cor="vermelha"
        />
        <SvgMath
          x={W_SOZINHO / 2}
          y={cy + 50}
          math={eSwitch ? '\\text{switch isolado e ligado}' : '\\text{bulb fora do circuit}'}
          fontSize={FS}
        />
        <SvgMath
          x={W_SOZINHO / 2}
          y={cy + 76}
          math="\text{nenhuma power chegando na peça}"
          fontSize={FS}
        />
        <Multimetro
          leitura={leitura ?? '1.4\\,\\Omega'}
          funcao="ohms"
          vermelhaEm="V"
          mx={mxSozinho}
          my={my}
        />
      </Figura>
    );
  }

  // ---------------------------------------------- as medições no circuit
  const H = 580;
  const fluxo = modo === 'fluxo';
  const W = fluxo ? W_FLUXO : W_CIRCUITO;
  const eCorrente = modo === 'corrente';
  const circula = !eCorrente;

  // Onde vão as duas pontas.
  let tips = null;
  if (modo === 'disponivel') {
    tips = {vermelha: [C, topo(peca(alvo))], preta: [C, COL_GND_Y - 24]};
  } else if (modo === 'queda') {
    tips = {vermelha: [C, topo(peca(alvo))], preta: [C, base(peca(alvo))]};
  } else if (eCorrente) {
    tips = {vermelha: [C, VAO[0]], preta: [C, VAO[1]]};
  }

  // O meter sempre acima do ponto mais alto que as pontas tocam, para as pontas
  // saírem das entradas para baixo. No fuse, que é a peça mais alta da coluna,
  // não cabe tudo isso: aí o meter encosta no topo do desenho.
  const my = tips ? Math.max(10, Math.min(tips.vermelha[1], tips.preta[1]) - 169) : 0;
  const J = jacks(MX, my);
  const vermelhaEm = eCorrente ? 'A' : 'V';
  const funcao = eCorrente ? 'amps' : 'volts DC';

  // Os pedaços do wire da coluna, cortados onde há peça (e no vão, quando o
  // wire é retirado para o amperímetro entrar no lugar dele).
  const cortes = PECAS.map((p) => [topo(p), base(p)]);
  if (eCorrente) cortes.push(VAO);
  cortes.sort((a, b) => a[0] - b[0]);
  const segs = [];
  let cur = RAIL_Y;
  cortes.forEach(([a, b]) => {
    segs.push([cur, a]);
    cur = b;
  });
  segs.push([cur, COL_GND_Y]);

  // Em toda medição com as duas pontas no circuit, a preta sai do meter pela
  // direita e desce por fora, para não cruzar a vermelha, que vai ao ponto
  // mais alto. Na current é o contrário: a vermelha está no A, que é a entrada
  // mais à esquerda, e aí quem desce reto é ela.
  let pontas = null;
  if (tips && !eCorrente) {
    pontas = (
      <g>
        <Ponta
          J={J}
          de="COM"
          para={tips.preta}
          c1={[W - 16, tips.preta[1] - (modo === 'disponivel' ? 140 : 20)]}
          c2={[C + 90, tips.preta[1]]}
          cor="preta"
        />
        <Ponta
          J={J}
          de="V"
          para={tips.vermelha}
          c1={[J.V, J.y + 28]}
          c2={[C + 60, tips.vermelha[1]]}
          cor="vermelha"
        />
      </g>
    );
  } else if (eCorrente) {
    pontas = (
      <g>
        <Ponta
          J={J}
          de="COM"
          para={tips.preta}
          c1={[J.COM, J.y + 50]}
          c2={[C + 70, tips.preta[1]]}
          cor="preta"
        />
        <Ponta
          J={J}
          de="A"
          para={tips.vermelha}
          c1={[J.A, J.y + 24]}
          c2={[C + 60, tips.vermelha[1]]}
          cor="vermelha"
        />
      </g>
    );
  }

  return (
    <Figura W={W} H={H} caption={caption}>
      {/* battery, no alto à esquerda, com o retorno pelo ground */}
      <SvgMath x={L - 26} y={PLATE_POS_Y + 10} math="12\,\text{V}" anchor="end" fontSize={FS} />
      <line className={styles.wire} x1={L} y1={RAIL_Y} x2={C} y2={RAIL_Y} />
      <line className={styles.wire} x1={L} y1={RAIL_Y} x2={L} y2={PLATE_POS_Y} />
      <line className={styles.plate} x1={L - 20} y1={PLATE_POS_Y} x2={L + 20} y2={PLATE_POS_Y} />
      <line className={styles.plateShort} x1={L - 11} y1={PLATE_NEG_Y} x2={L + 11} y2={PLATE_NEG_Y} />
      <SvgMath x={L + 28} y={PLATE_POS_Y} math="+" anchor="start" fontSize={FS} />
      <SvgMath x={L + 28} y={PLATE_NEG_Y} math="-" anchor="start" fontSize={FS} />
      <line className={styles.wire} x1={L} y1={PLATE_NEG_Y} x2={L} y2={BAT_GND_Y} />
      <Ground x={L} y={BAT_GND_Y} />

      {/* a coluna por onde a power desce */}
      {segs.map(([a, b]) => (
        <line key={a} className={styles.wire} x1={C} y1={a} x2={C} y2={b} />
      ))}
      <Ground x={C} y={COL_GND_Y} />
      <SvgMath x={C - 34} y={COL_GND_Y} math="\text{ground}" anchor="end" fontSize={FS} />

      <Fuse x={C} cy={peca('fuse').cy} meia={peca('fuse').meia} />
      <Switch x={C} cy={peca('switch').cy} meia={peca('switch').meia} fechado />
      <Bulb x={C} y={peca('bulb1').cy} />
      <Bulb x={C} y={peca('bulb2').cy} />

      {/* as pontas abertas do wire retirado, onde o meter entra no lugar dele */}
      {eCorrente && (
        <g>
          <circle className={styles.openEnd} cx={C} cy={VAO[0]} r={4} />
          <circle className={styles.openEnd} cx={C} cy={VAO[1]} r={4} />
        </g>
      )}

      {/* o nome de cada peça, do lado de fora da coluna */}
      {PECAS.map((p) => (
        <SvgMath key={p.id} x={C - 34} y={p.cy} math={p.nome} anchor="end" fontSize={FS} />
      ))}

      {/* top e bottom de cada peça: é o que dá nome ao ponto de medição */}
      {fluxo &&
        PECAS.map((p) => (
          <g key={p.id}>
            <SvgMath x={C + 28} y={topo(p)} math="\text{top}" anchor="start" fontSize={FS} />
            <SvgMath x={C + 28} y={base(p)} math="\text{bottom}" anchor="start" fontSize={FS} />
          </g>
        ))}

      {/* o caminho da power, de cima para baixo */}
      {circula && (
        <g>
          <Seta x={(L + C) / 2} y={RAIL_Y} dir="right" />
          <Seta x={C} y={(base(peca('fuse')) + topo(peca('switch'))) / 2} dir="down" />
          <Seta x={C} y={(base(peca('switch')) + topo(peca('bulb1'))) / 2} dir="down" />
          <Seta x={C} y={(base(peca('bulb1')) + topo(peca('bulb2'))) / 2} dir="down" />
          <Seta x={C} y={(base(peca('bulb2')) + COL_GND_Y) / 2} dir="down" />
        </g>
      )}

      {pontas}
      {/* o meter por cima das pontas: a caixa esconde o pedaço de cada ponta que
          fica dentro dela, e o furo aparece como o plugue encaixado */}
      {tips && (
        <Multimetro
          leitura={leitura ?? '12\\,\\text{V}'}
          funcao={funcao}
          vermelhaEm={vermelhaEm}
          mx={MX}
          my={my}
        />
      )}
    </Figura>
  );
}
