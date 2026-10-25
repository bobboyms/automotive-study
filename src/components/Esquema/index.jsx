import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import {Peca, Massa, T as MEIO} from '../Simbolos/desenhos';
import styles from '../Simbolos/styles.module.css';

// Circuit de um laço com qualquer símbolo da biblioteca `Simbolos`: battery à
// esquerda, as peças deitadas no wire de cima, a load em pé à direita e o
// retorno embaixo, por wire ou pelo ground. É o `Circuito` com peças à
// escolha — diode, LED, resistor, thermistor, variable resistor.
//
//   <Esquema
//     pecas={[{tipo: 'diodo', rotulo: '\\text{diode}'}]}
//     carga={{tipo: 'lampada', rotulo: '\\text{bulb}'}}
//     corrente
//     caption="..."
//   />
//
// Cada peça: {tipo, rotulo, nota, aberto, invertido}. `aberto` vale para o
// switch; `invertido` gira a peça meia volta (o diode ao contrário). A
// current só circula se nenhuma peça bloquear: switch aberto ou diode/LED
// invertido.

const L = 80; // wire da battery
const TOPO = 62; // wire de cima
const B = 212; // wire de baixo
const MEIO_Y = (TOPO + B) / 2;
const PASSO = 112;
// rótulos: no celular a figura cai para uns 358 px; com 0.029 × W, o rótulo
// sai com pelo menos 10.5 px (a mesma conta da `Associacao`)
const tamanhoFonte = (W) => Math.max(15, Math.ceil(W * 0.029));

const ROT = {right: 0, down: 90, left: 180, up: 270};
function Seta({x, y, dir}) {
  return (
    <path
      className={styles.seta}
      d="M -6 -7 L 4 0 L -6 7"
      transform={`translate(${x} ${y}) rotate(${ROT[dir]})`}
    />
  );
}

const bloqueia = (p) =>
  !p ||
  (p.tipo === 'interruptor' && p.aberto) ||
  (['diodo', 'led', 'fotodiodo'].includes(p.tipo) && p.invertido);

// largura aproximada de um rótulo: 0.62 do tamanho da fonte por letra (o
// KaTeX deixa o texto um pouco mais largo que a fonte do site)
const largura = (math = '', fs = 15) =>
  0.62 * fs * 1.21 * String(math).replace(/\\text\{|\}|\\,|\\/g, '').length;

export default function Esquema({
  pecas = [],
  carga = {tipo: 'lampada'},
  fonte = '12\\,\\text{V}',
  retorno = 'fio',
  corrente = false,
  rotuloCorrente,
  caption,
}) {
  const xs = pecas.map((_, i) => L + 78 + i * PASSO);
  const R = pecas.length ? xs[xs.length - 1] + 88 : L + 210;
  const circula = corrente && !pecas.some(bloqueia) && !bloqueia({...carga, tipo: carga.tipo});
  const rotCarga = carga.invertido ? 270 : 90;
  const larguraCom = (fs) =>
    Math.ceil(R + 30 + Math.max(largura(carga.rotulo, fs), largura(carga.nota, fs), 30) + 12);
  const FS = tamanhoFonte(larguraCom(15));
  const W = larguraCom(FS);
  const H = retorno === 'massa' ? B + 30 : B + 26;

  // wire de cima, cortado em cada peça
  const cortes = xs.map((x) => [x - MEIO, x + MEIO]);
  const trechos = [];
  let cursor = L;
  cortes.forEach(([a, b]) => {
    trechos.push([cursor, a]);
    cursor = b;
  });
  trechos.push([cursor, R]);

  const brilho = carga.brilho;

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || 'Esquema de um circuit.'}
      >
        <g className={styles.fio}>
          {trechos.map(([a, b]) => (
            <line key={a} x1={a} y1={TOPO} x2={b} y2={TOPO} />
          ))}
          {/* battery */}
          <line x1={L} y1={TOPO} x2={L} y2={MEIO_Y - 7} />
          <line x1={L} y1={MEIO_Y + 7} x2={L} y2={retorno === 'massa' ? B : B} />
          {/* load */}
          <line x1={R} y1={TOPO} x2={R} y2={MEIO_Y - MEIO} />
          <line x1={R} y1={MEIO_Y + MEIO} x2={R} y2={B} />
          {retorno === 'fio' && <line x1={L} y1={B} x2={R} y2={B} />}
        </g>
        <line className={styles.placa} x1={L - 20} y1={MEIO_Y - 7} x2={L + 20} y2={MEIO_Y - 7} />
        <line className={styles.placaCurta} x1={L - 11} y1={MEIO_Y + 7} x2={L + 11} y2={MEIO_Y + 7} />
        <SvgMath x={L + 28} y={MEIO_Y - 17} math="+" anchor="start" fontSize={FS} />
        <SvgMath x={L + 28} y={MEIO_Y + 17} math="-" anchor="start" fontSize={FS} />
        <SvgMath x={L - 28} y={MEIO_Y} math={fonte} anchor="end" fontSize={FS} />

        {retorno === 'massa' && (
          <g>
            <Massa x={L} y={B} />
            <Massa x={R} y={B} />
          </g>
        )}

        {pecas.map((p, i) => (
          <g key={i}>
            <Peca
              tipo={p.tipo}
              x={xs[i]}
              y={TOPO}
              rot={p.invertido ? 180 : 0}
              fechado={!p.aberto}
            />
            {p.rotulo && <SvgMath x={xs[i]} y={TOPO - 40} math={p.rotulo} fontSize={FS} />}
            {p.nota && <SvgMath x={xs[i]} y={TOPO + 30} math={p.nota} fontSize={FS} />}
          </g>
        ))}

        {/* load, em pé */}
        {brilho > 0.02 &&
          [0, 45, 90, 135, 180, 225, 270, 315].map((g) => {
            const a = ((g + 22.5) * Math.PI) / 180;
            const fim = 20 + 9 * Math.min(brilho, 1);
            return (
              <line
                key={g}
                className={styles.carga}
                style={{strokeWidth: 2}}
                x1={R + 19 * Math.cos(a)}
                y1={MEIO_Y + 19 * Math.sin(a)}
                x2={R + fim * Math.cos(a)}
                y2={MEIO_Y + fim * Math.sin(a)}
              />
            );
          })}
        <Peca tipo={carga.tipo} x={R} y={MEIO_Y} rot={rotCarga} />
        {carga.rotulo && (
          <SvgMath x={R + 34} y={carga.nota ? MEIO_Y - 12 : MEIO_Y} math={carga.rotulo} anchor="start" fontSize={FS} tone={2} />
        )}
        {carga.nota && (
          <SvgMath x={R + 34} y={MEIO_Y + 13} math={carga.nota} anchor="start" fontSize={FS} />
        )}

        {circula && (
          <g>
            <Seta x={pecas.length ? (L + xs[0] - MEIO) / 2 + 4 : (L + R) / 2} y={TOPO} dir="right" />
            <Seta x={R} y={(MEIO_Y + MEIO + B) / 2 + 2} dir="down" />
            {retorno === 'fio' && <Seta x={(L + R) / 2} y={B} dir="left" />}
            <Seta x={L} y={(MEIO_Y + 7 + B) / 2 + 6} dir="up" />
            {rotuloCorrente && (
              <SvgMath x={(L + R) / 2} y={B - 20} math={rotuloCorrente} fontSize={FS} tone={1} />
            )}
          </g>
        )}
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
