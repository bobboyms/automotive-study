import React from "react";
import SvgMath from "../diagramas/SvgMath";
import styles from "./styles.module.css";

// Circuito com várias cargas, em série ou em paralelo. A bateria fica à
// esquerda e, como no `Circuito`, o fusível e o interruptor vêm logo depois
// dela no fio de cima: fonte, proteção, controle, cargas, massa.
//
// Em série, as cargas ficam uma depois da outra no fio de cima, e o laço é um
// só. Em paralelo, cada carga é um ramo em pé entre o fio de cima e o de baixo.

const L = 90; // fio da bateria
const T = 60; // fio de cima
const PASSO = 140; // distância entre uma carga e a seguinte
const MEIA = 22; // meia largura de uma carga, de terminal a terminal

const ROT = { right: 0, down: 90, left: 180, up: 270 };
function Seta({ x, y, dir }) {
  return (
    <path
      className={styles.arrow}
      d="M -6 -7 L 4 0 L -6 7"
      transform={`translate(${x} ${y}) rotate(${ROT[dir]})`}
    />
  );
}

// Carga desenhada deitada, com centro em (0, 0) e terminais em ±MEIA.
// O paralelo usa a mesma forma girada 90 graus.
function Forma({ tipo, aberta }) {
  const linha = aberta ? styles.loadOpen : styles.load;
  if (tipo === "resistor") {
    return (
      <path
        className={linha}
        d={`M ${-MEIA} 0 l 4 -9 l 7 18 l 7 -18 l 7 18 l 7 -18 l 7 18 l 5 -9`}
      />
    );
  }
  // lâmpada e motor: círculo com os terminais
  return (
    <g>
      <line className={styles.wire} x1={-MEIA} y1={0} x2={-17} y2={0} />
      <line className={styles.wire} x1={17} y1={0} x2={MEIA} y2={0} />
      <circle className={aberta ? styles.lampOpen : styles.lamp} r={17} />
      {tipo === "lampada" &&
        (aberta ? (
          // filamento rompido: o X com o meio faltando
          <g>
            <line className={linha} x1={-12} y1={-12} x2={-4} y2={-4} />
            <line className={linha} x1={4} y1={4} x2={12} y2={12} />
            <line className={linha} x1={12} y1={-12} x2={4} y2={-4} />
            <line className={linha} x1={-4} y1={4} x2={-12} y2={12} />
          </g>
        ) : (
          <g>
            <line className={linha} x1={-12} y1={-12} x2={12} y2={12} />
            <line className={linha} x1={12} y1={-12} x2={-12} y2={12} />
          </g>
        ))}
    </g>
  );
}

function Carga({ x, y, tipo, aberta, deitada }) {
  return (
    <g>
      <g transform={`translate(${x} ${y})${deitada ? "" : " rotate(90)"}`}>
        <Forma tipo={tipo} aberta={aberta} />
      </g>
      {tipo === "motor" && (
        <SvgMath
          x={x}
          y={y}
          math="\text{M}"
          fontSize={15}
          tone={aberta ? 3 : 2}
          space={30}
        />
      )}
    </g>
  );
}

function Fusivel({ x }) {
  return (
    <g>
      <rect
        className={styles.part}
        x={x - 18}
        y={T - 8}
        width={36}
        height={16}
        rx={3}
      />
      <path
        className={styles.wireThin}
        d={`M ${x - 18} ${T} C ${x - 6} ${T - 9}, ${x + 6} ${T + 9}, ${x + 18} ${T}`}
      />
    </g>
  );
}

function Interruptor({ x }) {
  return (
    <g>
      <line className={styles.wire} x1={x - 18} y1={T} x2={x - 15} y2={T} />
      <line className={styles.wire} x1={x + 15} y1={T} x2={x + 18} y2={T} />
      <line className={styles.wire} x1={x - 15} y1={T} x2={x + 15} y2={T} />
      <circle className={styles.contact} cx={x - 15} cy={T} r={3} />
      <circle className={styles.contact} cx={x + 15} cy={T} r={3} />
    </g>
  );
}

function Bateria({ y, fonte, B }) {
  return (
    <g>
      <line className={styles.wire} x1={L} y1={T} x2={L} y2={y - 7} />
      <line className={styles.wire} x1={L} y1={y + 7} x2={L} y2={B} />
      <line
        className={styles.plate}
        x1={L - 20}
        y1={y - 7}
        x2={L + 20}
        y2={y - 7}
      />
      <line
        className={styles.plateShort}
        x1={L - 11}
        y1={y + 7}
        x2={L + 11}
        y2={y + 7}
      />
      <SvgMath x={L + 28} y={y - 16} math="+" anchor="start" space={30} />
      <SvgMath x={L + 28} y={y + 16} math="-" anchor="start" space={30} />
      <SvgMath x={L - 30} y={y} math={fonte} anchor="end" space={L - 34} />
    </g>
  );
}

// Fio horizontal de `a` até `b` na altura `y`, interrompido nos trechos de `cortes`.
function FioCortado({ a, b, y, cortes }) {
  const segs = [];
  let cursor = a;
  [...cortes]
    .sort((p, q) => p[0] - q[0])
    .forEach(([c0, c1]) => {
      segs.push([cursor, c0]);
      cursor = c1;
    });
  segs.push([cursor, b]);
  return segs
    .filter(([p, q]) => q > p)
    .map(([p, q]) => (
      <line key={p} className={styles.wire} x1={p} y1={y} x2={q} y2={y} />
    ));
}

export default function Associacao({
  tipo = "serie",
  cargas = [],
  fonte = "12\\,\\text{V}",
  fusivel = false,
  interruptor = false,
  nomes = true,
  corrente = false,
  rotuloCorrente,
  curto = false,
  rotuloCurto,
  caption,
}) {
  const serie = tipo === "serie";
  const B = serie ? 200 : 240;
  const BAT_Y = (T + B) / 2;

  // Fusível e interruptor, nessa ordem, logo depois da bateria.
  let x = L + 50;
  const cortes = [];
  let fuseX;
  let swX;
  if (fusivel) {
    fuseX = x + 20;
    cortes.push([fuseX - 18, fuseX + 18]);
    x += 80;
  }
  if (interruptor) {
    swX = x + 20;
    cortes.push([swX - 18, swX + 18]);
    x += 80;
  }

  // Em paralelo, o primeiro ramo fica mais afastado, para caber o rótulo da
  // corrente total no fio comum.
  const xs = cargas.map((_, i) => x + (serie ? 50 : 90) + i * PASSO);
  const algumaAberta = cargas.some((c) => c.aberta);
  // Em série, uma carga aberta abre o laço inteiro.
  const circula = !(serie && algumaAberta);
  const mostra = corrente && circula;

  let W;
  let conteudo;

  if (serie) {
    const R = xs[xs.length - 1] + 90;
    W = R + 30;
    xs.forEach((c) => cortes.push([c - MEIA, c + MEIA]));
    conteudo = (
      <g>
        <FioCortado a={L} b={R} y={T} cortes={cortes} />
        <line className={styles.wire} x1={R} y1={T} x2={R} y2={B} />
        <line className={styles.wire} x1={L} y1={B} x2={R} y2={B} />
        {cargas.map((c, i) => (
          <g key={i}>
            <Carga
              x={xs[i]}
              y={T}
              tipo={c.tipo ?? "resistor"}
              aberta={c.aberta}
              deitada
            />
            {c.rotulo && (
              <SvgMath
                x={xs[i]}
                y={T - 30}
                math={c.rotulo}
                tone={c.aberta ? 3 : 2}
                space={PASSO - 10}
              />
            )}
            {c.queda && (
              <SvgMath
                x={xs[i]}
                y={T + 32}
                math={c.queda}
                fontSize={14}
                tone={c.aberta ? 3 : 2}
                space={PASSO - 10}
              />
            )}
          </g>
        ))}
        {mostra && (
          <g>
            <Seta x={(xs[xs.length - 1] + MEIA + R) / 2} y={T} dir="right" />
            <Seta x={R} y={BAT_Y + 10} dir="down" />
            <Seta x={(L + R) / 2} y={B} dir="left" />
            <Seta x={L} y={(BAT_Y + B) / 2 + 8} dir="up" />
            {rotuloCorrente && (
              <SvgMath
                x={(L + R) / 2}
                y={B - 20}
                math={rotuloCorrente}
                fontSize={14}
                tone={1}
              />
            )}
          </g>
        )}
      </g>
    );
  } else {
    const LOAD_Y = BAT_Y;
    const curtoX = curto ? xs[xs.length - 1] + PASSO - 20 : null;
    const ultimo = curto ? curtoX : xs[xs.length - 1];
    W = ultimo + (curto ? 80 : 110);
    const setaY = (LOAD_Y + MEIA + B) / 2;
    const totalX = (x + xs[0]) / 2;
    const ramos = curto ? [...xs, curtoX] : xs;
    conteudo = (
      <g>
        <FioCortado a={L} b={ultimo} y={T} cortes={cortes} />
        <line className={styles.wire} x1={L} y1={B} x2={ultimo} y2={B} />
        {/* pontos de ligação: onde a corrente se divide e onde volta a se juntar */}
        {ramos.slice(0, -1).map((bx) => (
          <g key={bx}>
            <circle className={styles.node} cx={bx} cy={T} r={3.5} />
            <circle className={styles.node} cx={bx} cy={B} r={3.5} />
          </g>
        ))}
        {cargas.map((c, i) => (
          <g key={i}>
            <line
              className={styles.wire}
              x1={xs[i]}
              y1={T}
              x2={xs[i]}
              y2={LOAD_Y - MEIA}
            />
            <line
              className={styles.wire}
              x1={xs[i]}
              y1={LOAD_Y + MEIA}
              x2={xs[i]}
              y2={B}
            />
            <Carga
              x={xs[i]}
              y={LOAD_Y}
              tipo={c.tipo ?? "resistor"}
              aberta={c.aberta}
            />
            {c.rotulo && (
              <SvgMath
                x={xs[i] + 28}
                y={LOAD_Y}
                math={c.rotulo}
                anchor="start"
                tone={c.aberta ? 3 : 2}
                space={PASSO - 34}
              />
            )}
            {mostra && !c.aberta && (
              <g>
                <Seta x={xs[i]} y={setaY} dir="down" />
                {c.corrente && (
                  <SvgMath
                    x={xs[i] + 14}
                    y={setaY}
                    math={c.corrente}
                    anchor="start"
                    fontSize={14}
                    tone={1}
                    space={PASSO - 20}
                  />
                )}
              </g>
            )}
          </g>
        ))}
        {curto && (
          <g>
            <path
              className={styles.fault}
              d={`M ${curtoX} ${T} L ${curtoX} ${LOAD_Y - 10} L ${curtoX - 7} ${LOAD_Y - 4} L ${curtoX + 7} ${LOAD_Y + 4} L ${curtoX} ${LOAD_Y + 10} L ${curtoX} ${B}`}
            />
            <SvgMath
              x={curtoX + 14}
              y={LOAD_Y}
              math="\text{curto}"
              anchor="start"
              fontSize={13}
              tone={3}
              space={64}
            />
            {mostra && (
              <g>
                <Seta x={curtoX} y={setaY} dir="down" />
                {rotuloCurto && (
                  <SvgMath
                    x={curtoX + 14}
                    y={setaY}
                    math={rotuloCurto}
                    anchor="start"
                    fontSize={14}
                    tone={1}
                    space={64}
                  />
                )}
              </g>
            )}
          </g>
        )}
        {mostra && (
          <g>
            <Seta x={totalX} y={T} dir="right" />
            <Seta x={totalX} y={B} dir="left" />
            <Seta x={L} y={(BAT_Y + B) / 2 + 8} dir="up" />
            {rotuloCorrente && (
              <SvgMath
                x={totalX}
                y={T - 22}
                math={rotuloCorrente}
                fontSize={14}
                tone={1}
                space={xs[0] - x}
              />
            )}
          </g>
        )}
      </g>
    );
  }

  return (
    <figure className={styles.figure}>
      {/* Com várias cargas o desenho fica largo. No celular, encolher até caber
          deixaria os rótulos ilegíveis; em vez disso, a figura ganha uma
          largura mínima e rola de lado dentro da própria caixa. */}
      <div className={styles.scroll}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${W} ${B + 30}`}
          style={{ maxWidth: `${W}px`, minWidth: `${Math.min(W, 560)}px` }}
          role="img"
          aria-label={caption || `Circuito em ${serie ? "série" : "paralelo"}.`}
        >
          <Bateria y={BAT_Y} fonte={fonte} B={B} />
          {conteudo}
          {fusivel && <Fusivel x={fuseX} />}
          {interruptor && <Interruptor x={swX} />}
          {nomes && fusivel && (
            <SvgMath
              x={fuseX}
              y={T - 24}
              math="\text{fusível}"
              fontSize={13}
              space={78}
            />
          )}
          {nomes && interruptor && (
            <SvgMath
              x={swX}
              y={T - 24}
              math="\text{interruptor}"
              fontSize={13}
              space={78}
            />
          )}
        </svg>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
