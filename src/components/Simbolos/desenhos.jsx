import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import styles from './styles.module.css';

// Os símbolos dos wiring diagrams, desenhados uma vez e usados em três
// lugares: a tabela de símbolos (`TabelaSimbolos`), os flash cards
// (`FlashSimbolos`) e os circuits pequenos (`Esquema`).
//
// Cada símbolo de dois terminais é desenhado deitado, com o centro em (0, 0) e
// os terminais em x = −30 e x = +30. Para ficar em pé num circuit, o `Peca`
// gira o desenho; os textos (o M do motor, o +T do PTC) ficam fora da
// rotação, para não saírem de lado.
//
// Os desenhos são próprios: seguem as convenções comuns dos manuais, sem
// copiar figura de nenhum livro ou apostila.

export const T = 30; // meia distância entre os terminais

// Bobina: n arcos para cima, de x0 a x1, na altura y.
export function arcos(x0, x1, n, y = 0) {
  const r = (x1 - x0) / (2 * n);
  let d = `M ${x0} ${y}`;
  for (let i = 0; i < n; i++) d += ` a ${r} ${r} 0 0 1 ${2 * r} 0`;
  return d;
}

// Ponta de seta em V no fim de uma linha de `de` até `para`.
export function pontaSeta(de, para, tam = 6) {
  const ang = Math.atan2(para[1] - de[1], para[0] - de[0]);
  const p = (a) =>
    `${(para[0] - tam * Math.cos(ang + a)).toFixed(2)} ${(para[1] - tam * Math.sin(ang + a)).toFixed(2)}`;
  return `M ${p(0.55)} L ${para[0]} ${para[1]} L ${p(-0.55)}`;
}

function Seta({de, para, className, tam}) {
  return (
    <g className={className}>
      <line x1={de[0]} y1={de[1]} x2={para[0]} y2={para[1]} />
      <path d={pontaSeta(de, para, tam)} />
    </g>
  );
}

// Os dois fios de ligação, de ±T até ±a.
function Pontas({a = 20, b}) {
  return (
    <g className={styles.fio}>
      <line x1={-T} y1={0} x2={-a} y2={0} />
      <line x1={b ?? a} y1={0} x2={T} y2={0} />
    </g>
  );
}

const zigue = `M -20 0 l 3.33 -8 l 6.67 16 l 6.67 -16 l 6.67 16 l 6.67 -16 l 6.67 16 l 3.33 -8`;

// ---------------------------------------------------------------------------
// Símbolos de dois terminais. Cada um devolve o desenho (girável) e, quando
// precisa, `textos` em coordenadas locais, desenhados sem girar.

export const SIMBOLOS = {
  bateria: {
    desenho: () => (
      <g>
        {/* placa longa é o +, placa curta e grossa é o −. O tracejado entre
            as duas células quer dizer “mais células iguais aqui”. */}
        <g className={styles.fio}>
          <line x1={-T} y1={0} x2={-14} y2={0} />
          <line x1={14} y1={0} x2={T} y2={0} />
        </g>
        <line className={styles.placa} x1={-14} y1={-15} x2={-14} y2={15} />
        <line className={styles.placaCurta} x1={-7} y1={-8} x2={-7} y2={8} />
        <line className={styles.tracejado} x1={-4} y1={0} x2={4} y2={0} />
        <line className={styles.placa} x1={7} y1={-15} x2={7} y2={15} />
        <line className={styles.placaCurta} x1={14} y1={-8} x2={14} y2={8} />
      </g>
    ),
    textos: [
      {x: -23, y: -14, math: '+'},
      {x: 23, y: -14, math: '-'},
    ],
  },

  lampada: {
    desenho: () => (
      <g>
        <Pontas a={14} />
        <circle className={styles.lampada} r={14} />
        <g className={styles.carga}>
          <line x1={-10} y1={-10} x2={10} y2={10} />
          <line x1={10} y1={-10} x2={-10} y2={10} />
        </g>
      </g>
    ),
  },

  filamento: {
    desenho: () => (
      <g>
        <Pontas a={15} />
        <circle className={styles.lampada} r={15} />
        <line className={styles.fio} x1={-15} y1={0} x2={-9} y2={0} />
        <line className={styles.fio} x1={9} y1={0} x2={15} y2={0} />
        {/* o filament: um wire fino enrolado */}
        <path
          className={styles.carga}
          d="M -9 0 C -9 -10, -1 -10, -2 -3 C -3 3, 3 3, 2 -3 C 1 -10, 9 -10, 9 0"
        />
      </g>
    ),
  },

  motor: {
    desenho: () => (
      <g>
        <Pontas a={15} />
        <circle className={styles.lampada} r={15} />
      </g>
    ),
    textos: [{x: 0, y: 0, math: '\\text{M}', tone: 2, termo: false}],
  },

  // a horn: a caixa do eletroímã e a corneta, que sai para o lado de cima
  // (no circuit em pé, fica à direita)
  buzina: {
    desenho: () => (
      <g>
        <Pontas a={11} />
        <rect className={styles.lampada} x={-11} y={-8} width={22} height={16} rx={2} />
        <path
          className={styles.lampada}
          d="M -5 -8 L -12 -21 L 12 -21 L 5 -8 Z"
        />
      </g>
    ),
  },

  fusivel: {
    // o símbolo das figuras deste site: o S dentro de uma caixinha
    desenho: () => (
      <g>
        <Pontas a={17} />
        <rect className={styles.parte} x={-17} y={-8} width={34} height={16} rx={3} />
        <path className={styles.fino} d="M -17 0 C -6 -9, 6 9, 17 0" />
      </g>
    ),
  },

  fusivelS: {
    // o S solto entre dois terminais, comum nos manuais americanos
    desenho: () => (
      <g>
        <Pontas a={17} />
        <path className={styles.fio} d="M -14 0 C -6 -15, 6 15, 14 0" />
        <circle className={styles.contato} cx={-14} r={2.6} />
        <circle className={styles.contato} cx={14} r={2.6} />
      </g>
    ),
  },

  fusivelEuro: {
    desenho: () => (
      <g>
        <line className={styles.fio} x1={-T} y1={0} x2={T} y2={0} />
        <rect className={styles.parte} x={-15} y={-6} width={30} height={12} />
        <line className={styles.fino} x1={-15} y1={0} x2={15} y2={0} />
      </g>
    ),
  },

  disjuntor: {
    // circuit breaker: o contato dentro de uma caixa, com a bimetal strip
    // desenhada por cima dele. Como no fuse, os manuais têm mais de uma
    // forma de desenhar; esta é a comum nos diagramas americanos.
    desenho: () => (
      <g>
        <Pontas a={19} />
        <rect className={styles.parte} x={-19} y={-13} width={38} height={26} rx={3} />
        <circle className={styles.contato} cx={-12} r={2.6} />
        <circle className={styles.contato} cx={12} r={2.6} />
        <line className={styles.fio} x1={-12} y1={0} x2={12} y2={0} />
        <path className={styles.fino} d="M -12 -7 C -4 -11, 4 -11, 12 -7" />
      </g>
    ),
  },

  interruptor: {
    desenho: ({fechado}) => (
      <g>
        <Pontas a={17} />
        <circle className={styles.contato} cx={-14} r={3} />
        <circle className={styles.contato} cx={14} r={3} />
        <line
          className={styles.fio}
          x1={-14}
          y1={0}
          x2={fechado ? 14 : 10}
          y2={fechado ? 0 : -16}
        />
      </g>
    ),
  },

  resistor: {
    desenho: () => (
      <g>
        <Pontas />
        <path className={styles.fio} d={zigue} />
      </g>
    ),
  },

  resistorEuro: {
    desenho: () => (
      <g>
        <Pontas a={16} />
        <rect className={styles.parte} x={-16} y={-7} width={32} height={14} />
      </g>
    ),
  },

  variavel: {
    desenho: () => (
      <g>
        <Pontas />
        <path className={styles.fio} d={zigue} />
        <Seta className={styles.fino} de={[-15, 15]} para={[16, -15]} />
      </g>
    ),
  },

  ntc: {
    desenho: () => (
      <g>
        <Pontas a={16} />
        <rect className={styles.parte} x={-16} y={-7} width={32} height={14} />
        {/* o traço com o “pé” deitado é o sinal de resistance que muda com a
            temperatura */}
        <path className={styles.fino} d="M -22 13 L -15 13 L 16 -13" />
      </g>
    ),
    textos: [{x: -24, y: -19, math: '-T'}],
  },

  ptc: {
    desenho: () => (
      <g>
        <Pontas a={16} />
        <rect className={styles.parte} x={-16} y={-7} width={32} height={14} />
        <path className={styles.fino} d="M -22 13 L -15 13 L 16 -13" />
      </g>
    ),
    textos: [{x: -24, y: -19, math: '+T'}],
  },

  bobina: {
    desenho: () => (
      <g>
        <Pontas />
        <path className={styles.fio} d={arcos(-20, 20, 4)} />
      </g>
    ),
  },

  bobinaNucleo: {
    desenho: () => (
      <g>
        <Pontas />
        <path className={styles.fio} d={arcos(-20, 20, 4)} />
        {/* as duas linhas são o iron core */}
        <line className={styles.fino} x1={-20} y1={5} x2={20} y2={5} />
        <line className={styles.fino} x1={-20} y1={9} x2={20} y2={9} />
      </g>
    ),
  },

  capacitor: {
    // as duas plates separadas pelo dielectric: o símbolo não fecha o
    // caminho, e é isso que ele quer dizer — a current contínua não passa
    desenho: () => (
      <g>
        <Pontas a={5} />
        <line className={styles.placa} x1={-5} y1={-13} x2={-5} y2={13} />
        <line className={styles.placa} x1={5} y1={-13} x2={5} y2={13} />
      </g>
    ),
  },

  diodo: {
    desenho: () => (
      <g>
        <Pontas a={8} />
        <path className={styles.cheio} d="M -8 -10 L -8 10 L 8 0 Z" />
        <line className={styles.placa} x1={8} y1={-10} x2={8} y2={10} />
      </g>
    ),
  },

  led: {
    desenho: () => (
      <g>
        <Pontas a={8} />
        <path className={styles.cargaCheia} d="M -8 -10 L -8 10 L 8 0 Z" />
        <line className={styles.carga} x1={8} y1={-10} x2={8} y2={10} />
        {/* as setas saem: o LED solta luz */}
        <Seta className={styles.carga} de={[-2, -12]} para={[6, -22]} tam={5} />
        <Seta className={styles.carga} de={[5, -12]} para={[13, -22]} tam={5} />
      </g>
    ),
  },

  fotodiodo: {
    desenho: () => (
      <g>
        <Pontas a={8} />
        <path className={styles.cheio} d="M -8 -10 L -8 10 L 8 0 Z" />
        <line className={styles.placa} x1={8} y1={-10} x2={8} y2={10} />
        {/* as setas entram: o photodiode recebe luz */}
        <Seta className={styles.fino} de={[6, -24]} para={[-1, -13]} tam={5} />
        <Seta className={styles.fino} de={[13, -24]} para={[6, -13]} tam={5} />
      </g>
    ),
  },
};

// Gira o ponto (x, y) em `graus`.
function girar([x, y], graus) {
  const a = (graus * Math.PI) / 180;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
}

// Um símbolo no lugar: centro em (x, y), girado `rot` graus.
export function Peca({tipo, x = 0, y = 0, rot = 0, fontSize = 15, ...props}) {
  const s = SIMBOLOS[tipo];
  if (!s) throw new Error(`Simbolos: símbolo "${tipo}" não existe`);
  return (
    <g>
      <g transform={`translate(${x} ${y}) rotate(${rot})`}>{s.desenho(props)}</g>
      {(s.textos || []).map((t) => {
        // o texto gira de lugar junto com o desenho, mas não de lado; em pé,
        // o rótulo que ficava em cima passa para o lado de fora
        const [dx, dy] = girar([t.x, t.y], rot);
        return (
          <SvgMath
            key={t.math}
            x={x + dx}
            y={y + dy}
            math={t.math}
            fontSize={fontSize}
            tone={t.tone}
          />
        );
      })}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Símbolos que não são de dois terminais: desenhados inteiros, cada um no seu
// quadro. `quadro` é o viewBox [x, y, largura, altura].

function Massa({x = 0, y = 0}) {
  return (
    <g className={styles.fio}>
      <line x1={x - 13} y1={y} x2={x + 13} y2={y} />
      <line x1={x - 8} y1={y + 5} x2={x + 8} y2={y + 5} />
      <line x1={x - 3} y1={y + 10} x2={x + 3} y2={y + 10} />
    </g>
  );
}
export {Massa};

// Relay: coil à esquerda (86 em cima, 85 embaixo), contato à direita (30 em
// cima, 87 embaixo). O tracejado entre os dois é a ligação magnética: a coil
// puxa o contato. `acionado` desenha o contato fechado. `cinco` acrescenta o
// contato 87a, fechado em repouso. `diodo` põe o diode em paralelo com a coil.
// `dx` é a distância do meio até cada coluna; num circuit, ela alinha a coil
// e o contato com os fios que chegam a eles.
export function Rele({x = 0, y = 0, dx = 20, acionado = false, cinco = false, diodo = false, pinos = true, fontSize = 13}) {
  const cx = -dx; // coluna da coil
  const sx = cinco ? dx + 2 : dx; // coluna do contato
  const top = -44;
  const bot = 44;
  const pivo = [sx, -14];
  const c87 = cinco ? [sx + 12, 14] : [sx, 14];
  const c87a = [sx - 12, 14];
  // ponta da alavanca: no 87 quando acionado; em repouso, no 87a (cinco
  // pinos) ou solta, inclinada para a direita (quatro pinos)
  const ponta = acionado
    ? [c87[0] + (cinco ? -1.5 : 0), c87[1] - 3]
    : cinco
      ? [c87a[0] + 1.5, c87a[1] - 3]
      : [sx + 11, 10];
  const meio = [(pivo[0] + ponta[0]) / 2, (pivo[1] + ponta[1]) / 2];
  const esq = cx - (diodo ? 40 : 14);
  const caixa = [esq, -30, (cinco ? c87[0] + 14 : sx + 18) - esq, 60];
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* caixa contínua: o relay está desenhado inteiro (tracejada quer
          dizer componente incompleto) */}
      <rect
        className={styles.fino}
        x={caixa[0]}
        y={caixa[1]}
        width={caixa[2]}
        height={caixa[3]}
        rx={4}
      />
      {/* coil, em pé */}
      <g className={styles.fio}>
        <line x1={cx} y1={top} x2={cx} y2={-16} />
        <line x1={cx} y1={16} x2={cx} y2={bot} />
      </g>
      <path
        className={styles.fio}
        d={arcos(-16, 16, 4)}
        transform={`translate(${cx} 0) rotate(90)`}
      />
      {/* ligação magnética */}
      <line className={styles.tracejado} x1={cx + 6} y1={0} x2={meio[0]} y2={meio[1]} />
      {/* contato */}
      <g className={styles.fio}>
        <line x1={sx} y1={top} x2={pivo[0]} y2={pivo[1]} />
        <line x1={pivo[0]} y1={pivo[1]} x2={ponta[0]} y2={ponta[1]} />
        <line x1={c87[0]} y1={c87[1]} x2={c87[0]} y2={bot} />
        {cinco && <line x1={c87a[0]} y1={c87a[1]} x2={c87a[0]} y2={bot} />}
      </g>
      <circle className={styles.contato} cx={pivo[0]} cy={pivo[1]} r={2.6} />
      <circle className={styles.contato} cx={c87[0]} cy={c87[1]} r={2.6} />
      {cinco && <circle className={styles.contato} cx={c87a[0]} cy={c87a[1]} r={2.6} />}
      {diodo && (
        <g>
          {/* em paralelo com a coil, apontando para o 86: em funcionamento
              normal ele fica bloqueado */}
          <g className={styles.fio}>
            <line x1={cx} y1={-24} x2={cx - 24} y2={-24} />
            <line x1={cx} y1={24} x2={cx - 24} y2={24} />
            <line x1={cx - 24} y1={-24} x2={cx - 24} y2={-8} />
            <line x1={cx - 24} y1={8} x2={cx - 24} y2={24} />
          </g>
          <path className={styles.cheio} d={`M ${cx - 32} 8 L ${cx - 16} 8 L ${cx - 24} -8 Z`} />
          <line className={styles.placa} x1={cx - 32} y1={-8} x2={cx - 16} y2={-8} />
          <circle className={styles.ponto} cx={cx} cy={-24} r={3} />
          <circle className={styles.ponto} cx={cx} cy={24} r={3} />
        </g>
      )}
      {pinos && (
        <g>
          <SvgMath x={cx - 5} y={top + 4} math="86" anchor="end" fontSize={fontSize} />
          <SvgMath x={cx - 5} y={bot - 4} math="85" anchor="end" fontSize={fontSize} />
          <SvgMath x={sx + 5} y={top + 4} math="30" anchor="start" fontSize={fontSize} />
          <SvgMath x={c87[0] + 5} y={bot - 4} math="87" anchor="start" fontSize={fontSize} />
          {cinco && (
            <SvgMath x={c87a[0] - 5} y={bot - 4} math="87\text{a}" anchor="end" fontSize={fontSize} />
          )}
        </g>
      )}
    </g>
  );
}

// Lâmpada de dois filaments (brake light e taillight na mesma bulb): dois
// terminais em cima, um em cada filament, e o terminal comum embaixo.
function FilamentoDuplo() {
  return (
    <g>
      <g className={styles.fio}>
        <line x1={-12} y1={-40} x2={-12} y2={-16} />
        <line x1={12} y1={-40} x2={12} y2={-16} />
        <line x1={0} y1={18} x2={0} y2={40} />
      </g>
      <ellipse className={styles.lampada} rx={28} ry={18} />
      <g className={styles.carga}>
        <path d="M -12 -16 L -12 -10 C -20 -8, -20 -2, -12 -2 C -4 -2, -4 4, -12 5 L -12 9 L 0 9" />
        <path d="M 12 -16 L 12 -10 C 20 -8, 20 -2, 12 -2 C 4 -2, 4 4, 12 5 L 12 9 L 0 9" />
        <line x1={0} y1={9} x2={0} y2={18} />
      </g>
      <circle className={styles.ponto} cx={0} cy={9} r={3} />
    </g>
  );
}

function Splice() {
  return (
    <g>
      <g className={styles.fio}>
        <line x1={-36} y1={0} x2={36} y2={0} />
        <line x1={0} y1={0} x2={0} y2={30} />
      </g>
      <circle className={styles.ponto} r={4.5} />
    </g>
  );
}

// fios que se cruzam sem ligação: sem ponto
function Cruzamento() {
  return (
    <g className={styles.fio}>
      <line x1={-36} y1={0} x2={36} y2={0} />
      <line x1={0} y1={-30} x2={0} y2={30} />
    </g>
  );
}

// connector entre dois chicotes: as duas metades se encaixam no meio
function Conector({fontSize = 13}) {
  return (
    <g>
      <g className={styles.fio}>
        <line x1={-44} y1={0} x2={-5} y2={0} />
        <line x1={5} y1={0} x2={44} y2={0} />
        <path d="M -9 -8 Q -1 0 -9 8" />
        <path d="M 9 -8 Q 1 0 9 8" />
      </g>
      <SvgMath x={0} y={-20} math="\text{C201}" fontSize={fontSize} />
      <SvgMath x={0} y={21} math="3" fontSize={fontSize} />
    </g>
  );
}

// pino de um componente: o connector desenhado na borda da caixa
function Pinos({fontSize = 13}) {
  return (
    <g>
      <rect className={styles.parte} x={-46} y={-30} width={36} height={60} rx={3} />
      {/* o número de cada pino fica em cima do wire, longe do arco */}
      {[-18, 0, 18].map((py, i) => (
        <g key={py}>
          <path className={styles.fio} d={`M -10 ${py - 5} Q -4 ${py} -10 ${py + 5}`} />
          <line className={styles.fio} x1={-6} y1={py} x2={44} y2={py} />
          <SvgMath x={12} y={py - 8} math={String(i + 1)} fontSize={fontSize * 0.85} anchor="start" />
        </g>
      ))}
      <SvgMath x={-28} y={42} math="\text{C1}" fontSize={fontSize} />
    </g>
  );
}

// o wire visto de perto: a cor de base e a listra (tracer) ao longo dele
function CorDoFio({fontSize = 13}) {
  return (
    <g>
      <rect className={styles.fioCorpo} x={-46} y={-9} width={92} height={18} rx={9} />
      <rect className={styles.fioListra} x={-40} y={-2.5} width={80} height={5} rx={2.5} />
      <SvgMath x={0} y={-24} math="\text{GRN/RED}" fontSize={fontSize} />
    </g>
  );
}

function Massa1({fontSize = 13}) {
  return (
    <g>
      <line className={styles.fio} x1={0} y1={-30} x2={0} y2={0} />
      <Massa />
      <SvgMath x={0} y={28} math="\text{G101}" fontSize={fontSize} />
    </g>
  );
}

function Caixa({tracejada}) {
  return (
    <g>
      <rect
        className={tracejada ? styles.tracejado : styles.fino}
        x={-34}
        y={-26}
        width={68}
        height={52}
        rx={3}
      />
      <line className={styles.fio} x1={0} y1={-40} x2={0} y2={-15} />
      <line className={styles.fio} x1={0} y1={15} x2={0} y2={40} />
      <circle className={styles.lampada} r={14} />
      <SvgMath x={0} y={0} math="\text{M}" fontSize={15} tone={2} />
    </g>
  );
}

function Versoes({fontSize = 13}) {
  return (
    <g>
      <g className={styles.fio}>
        <line x1={0} y1={-40} x2={0} y2={-16} />
        <line x1={-20} y1={22} x2={-20} y2={40} />
        <line x1={20} y1={22} x2={20} y2={40} />
      </g>
      {/* os dois caminhos possíveis, tracejados: cada versão do carro usa um */}
      <path className={styles.tracejado} d="M 0 -16 L -20 -4 L -20 22" />
      <path className={styles.tracejado} d="M 0 -16 L 20 -4 L 20 22" />
      {[
        [-20, 1],
        [20, 2],
      ].map(([vx, n]) => (
        <g key={n}>
          <circle className={styles.parte} cx={vx} cy={9} r={9} />
          <SvgMath x={vx} y={9} math={String(n)} fontSize={fontSize} />
        </g>
      ))}
    </g>
  );
}

function FusivelNumero({fontSize = 13}) {
  return (
    <g>
      <g transform="rotate(90)">{SIMBOLOS.fusivelS.desenho({})}</g>
      <SvgMath x={14} y={-9} math="\text{F12}" fontSize={fontSize} anchor="start" />
      <SvgMath x={14} y={11} math="15\,\text{A}" fontSize={fontSize} anchor="start" />
    </g>
  );
}

function InterruptorPosicoes({fontSize = 13}) {
  return (
    <g>
      <g className={styles.fio}>
        <line x1={0} y1={-40} x2={0} y2={-17} />
        <line x1={-18} y1={14} x2={-18} y2={40} />
        <line x1={18} y1={14} x2={18} y2={40} />
        <line x1={0} y1={-14} x2={15} y2={11} />
      </g>
      <circle className={styles.contato} cx={0} cy={-14} r={3} />
      <circle className={styles.contato} cx={-18} cy={14} r={3} />
      <circle className={styles.contato} cx={18} cy={14} r={3} />
      <SvgMath x={-24} y={24} math="\text{LO}" fontSize={fontSize} anchor="end" />
      <SvgMath x={24} y={24} math="\text{HI}" fontSize={fontSize} anchor="start" />
    </g>
  );
}

function Potenciometro() {
  return (
    <g>
      <g className={styles.fio}>
        <line x1={-36} y1={0} x2={-20} y2={0} />
        <line x1={20} y1={0} x2={36} y2={0} />
        <path d={zigue} />
        <line x1={4} y1={-34} x2={4} y2={-20} />
      </g>
      {/* o cursor (wiper) encosta no meio do resistor: é o terceiro terminal */}
      <g className={styles.fio}>
        <line x1={4} y1={-20} x2={4} y2={-11} />
        <path d={pontaSeta([4, -20], [4, -10], 7)} />
      </g>
    </g>
  );
}

// Transformer: as duas coils de frente uma para a outra, e o iron core
// entre elas. Quatro terminais, por isso ele não é um símbolo de dois
// terminais: a primary fica à esquerda e a secondary à direita.
function Transformador({fontSize = 13}) {
  const arcosVerticais = (y0, y1, n, x, lado) => {
    const r = (y1 - y0) / (2 * n);
    let d = `M ${x} ${y0}`;
    for (let i = 0; i < n; i++) d += ` a ${r} ${r} 0 0 ${lado} 0 ${2 * r}`;
    return d;
  };
  return (
    <g>
      <g className={styles.fio}>
        {/* terminais da primary, à esquerda */}
        <line x1={-52} y1={-28} x2={-14} y2={-28} />
        <line x1={-52} y1={28} x2={-14} y2={28} />
        <path d={arcosVerticais(-28, 28, 4, -14, 0)} />
        {/* terminais da secondary, à direita */}
        <line x1={52} y1={-28} x2={14} y2={-28} />
        <line x1={52} y1={28} x2={14} y2={28} />
        <path d={arcosVerticais(-28, 28, 4, 14, 1)} />
      </g>
      {/* o iron core, entre as duas coils */}
      <g className={styles.fino}>
        <line x1={-3} y1={-30} x2={-3} y2={30} />
        <line x1={3} y1={-30} x2={3} y2={30} />
      </g>
      {/* os rótulos ficam afastados do meio: centrados sobre cada coil, as
          duas palavras se encostavam e “secondary” saía cortada no cartão */}
      <SvgMath x={-46} y={-38} math="\text{primary}" fontSize={fontSize} />
      <SvgMath x={46} y={-38} math="\text{secondary}" fontSize={fontSize} />
    </g>
  );
}

export const ESPECIAIS = {
  transformador: {quadro: [-88, -58, 176, 112], desenho: (p) => <Transformador {...p} />},
  massa: {quadro: [-50, -42, 100, 84], desenho: (p) => <Massa1 {...p} />},
  filamentoDuplo: {quadro: [-50, -46, 100, 92], desenho: () => <FilamentoDuplo />},
  rele: {quadro: [-64, -58, 128, 116], desenho: (p) => <Rele {...p} />},
  // mais largo: com dx = 20, o 85 e o 87a se encostavam
  rele5: {quadro: [-64, -58, 134, 116], desenho: (p) => <Rele cinco dx={28} {...p} />},
  releDiodo: {quadro: [-72, -58, 136, 116], desenho: (p) => <Rele diodo {...p} />},
  splice: {quadro: [-46, -34, 92, 72], desenho: () => <Splice />},
  cruzamento: {quadro: [-46, -34, 92, 68], desenho: () => <Cruzamento />},
  conector: {quadro: [-50, -40, 100, 76], desenho: (p) => <Conector {...p} />},
  pinos: {quadro: [-52, -40, 102, 96], desenho: (p) => <Pinos {...p} />},
  corDoFio: {quadro: [-52, -40, 104, 64], desenho: (p) => <CorDoFio {...p} />},
  completo: {quadro: [-46, -44, 92, 88], desenho: () => <Caixa />},
  incompleto: {quadro: [-46, -44, 92, 88], desenho: () => <Caixa tracejada />},
  versoes: {quadro: [-46, -44, 92, 88], desenho: (p) => <Versoes {...p} />},
  fusivelNumero: {quadro: [-40, -40, 100, 80], desenho: (p) => <FusivelNumero {...p} />},
  interruptorPosicoes: {quadro: [-46, -44, 92, 88], desenho: (p) => <InterruptorPosicoes {...p} />},
  potenciometro: {quadro: [-42, -40, 84, 56], desenho: () => <Potenciometro />},
};

// Quadro padrão dos símbolos de dois terminais, deitados.
export const QUADRO = [-38, -32, 76, 56];

// Desenha qualquer símbolo, de dois terminais ou especial, no próprio quadro.
export function SimboloSolto({tipo, className, rotulo}) {
  const esp = ESPECIAIS[tipo];
  const q = esp ? esp.quadro : QUADRO;
  return (
    <svg
      className={className}
      viewBox={q.join(' ')}
      role="img"
      aria-label={rotulo}
    >
      {esp ? esp.desenho({}) : <Peca tipo={tipo} fontSize={13} />}
    </svg>
  );
}
