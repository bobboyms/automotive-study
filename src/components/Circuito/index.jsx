import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import styles from './styles.module.css';

// Circuito simples em laço: bateria à esquerda, fusível e interruptor no fio de
// cima, a carga à direita e o retorno embaixo — por fio ou pela carroceria.
// É o desenho de quase todo circuito de lâmpada do carro, e a ordem dos
// elementos é a mesma dos esquemas dos manuais: fonte, proteção, controle,
// carga, massa.

const L = 110; // fio da esquerda (bateria)
const R = 330; // fio da direita (carga)
const T = 56; // fio de cima
const B = 196; // fio de baixo
const BAT_Y = (T + B) / 2;
const LOAD_Y = BAT_Y;
const FUSE_X = 170;
const SWITCH_X = 250;
const FAULT_X = 298; // onde ficam o fio rompido e o curto
const W = 460;

// Seta em forma de V, apontando na direção do movimento.
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

function Massa({x, y}) {
  return (
    <g className={styles.wire}>
      <line x1={x - 13} y1={y} x2={x + 13} y2={y} />
      <line x1={x - 8} y1={y + 5} x2={x + 8} y2={y + 5} />
      <line x1={x - 3} y1={y + 10} x2={x + 3} y2={y + 10} />
    </g>
  );
}

export default function Circuito({
  fonte = '12\\,\\text{V}',
  fusivel = true,
  interruptor = 'fechado',
  carga = 'lampada',
  rotuloCarga,
  retorno = 'fio',
  corrente = false,
  sentido = 'convencional',
  rotuloCorrente,
  quebra = false,
  curto = false,
  nomes = true,
  caption,
}) {
  const aberto = interruptor === 'aberto';
  const circula = !aberto && !quebra;
  const mostraCorrente = corrente && circula;
  // Corrente convencional sai do + e volta pelo −; os elétrons fazem o
  // caminho inverso. Basta inverter cada seta.
  const inv = sentido === 'eletrons';
  const d = (dir) =>
    inv ? {right: 'left', left: 'right', up: 'down', down: 'up'}[dir] : dir;

  const H = retorno === 'massa' ? B + 64 : B + 30;
  const loadTop = LOAD_Y - 22;
  const loadBottom = LOAD_Y + 22;

  // Fio de cima, cortado nos elementos que existem.
  const topCuts = [];
  if (fusivel) topCuts.push([FUSE_X - 18, FUSE_X + 18]);
  if (interruptor) topCuts.push([SWITCH_X - 18, SWITCH_X + 18]);
  if (quebra) topCuts.push([FAULT_X - 9, FAULT_X + 9]);
  const topSegments = [];
  let cursor = L;
  topCuts.forEach(([a, b]) => {
    topSegments.push([cursor, a]);
    cursor = b;
  });
  topSegments.push([cursor, R]);

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || 'Esquema de um circuito simples.'}
      >
        {/* fio de cima */}
        {topSegments.map(([a, b]) => (
          <line
            key={a}
            className={styles.wire}
            x1={a}
            y1={T}
            x2={b}
            y2={T}
          />
        ))}

        {/* bateria: placa longa é o +, placa curta é o − */}
        <line className={styles.wire} x1={L} y1={T} x2={L} y2={BAT_Y - 7} />
        <line className={styles.wire} x1={L} y1={BAT_Y + 7} x2={L} y2={B} />
        <line
          className={styles.plate}
          x1={L - 20}
          y1={BAT_Y - 7}
          x2={L + 20}
          y2={BAT_Y - 7}
        />
        <line
          className={styles.plateShort}
          x1={L - 11}
          y1={BAT_Y + 7}
          x2={L + 11}
          y2={BAT_Y + 7}
        />
        <SvgMath x={L + 28} y={BAT_Y - 16} math="+" anchor="start" />
        <SvgMath x={L + 28} y={BAT_Y + 16} math="-" anchor="start" />
        <SvgMath
          x={L - 30}
          y={BAT_Y}
          math={fonte}
          anchor="end"
        />

        {/* fusível */}
        {fusivel && (
          <g>
            <rect
              className={styles.part}
              x={FUSE_X - 18}
              y={T - 8}
              width={36}
              height={16}
              rx={3}
            />
            <path
              className={styles.wireThin}
              d={`M ${FUSE_X - 18} ${T} C ${FUSE_X - 6} ${T - 9}, ${FUSE_X + 6} ${T + 9}, ${FUSE_X + 18} ${T}`}
            />
            {/* embaixo do fio: em cima, ao lado de “interruptor”, os dois
                nomes se encostavam no celular */}
            {nomes && (
              <SvgMath
                x={FUSE_X}
                y={T + 24}
                math="\text{fusível}"
                fontSize={15}
              />
            )}
          </g>
        )}

        {/* interruptor */}
        {interruptor && (
          <g>
            <circle className={styles.contact} cx={SWITCH_X - 15} cy={T} r={3} />
            <circle className={styles.contact} cx={SWITCH_X + 15} cy={T} r={3} />
            <line className={styles.wire} x1={SWITCH_X - 18} y1={T} x2={SWITCH_X - 15} y2={T} />
            <line className={styles.wire} x1={SWITCH_X + 15} y1={T} x2={SWITCH_X + 18} y2={T} />
            {aberto ? (
              <line
                className={styles.wire}
                x1={SWITCH_X - 15}
                y1={T}
                x2={SWITCH_X + 11}
                y2={T - 17}
              />
            ) : (
              <line
                className={styles.wire}
                x1={SWITCH_X - 15}
                y1={T}
                x2={SWITCH_X + 15}
                y2={T}
              />
            )}
            {/* alto o bastante para a alavanca do interruptor aberto, que sobe
                até T - 17, não riscar o nome */}
            {nomes && (
              <SvgMath
                x={SWITCH_X}
                y={T - 33}
                math="\text{interruptor}"
                fontSize={15}
              />
            )}
          </g>
        )}

        {/* fio rompido */}
        {quebra && (
          <g>
            <circle className={styles.faultEnd} cx={FAULT_X - 9} cy={T} r={2.5} />
            <circle className={styles.faultEnd} cx={FAULT_X + 9} cy={T} r={2.5} />
            {/* termina antes do fio da carga, para não cruzá-lo, e começa
                depois do nome “fusível”, que fica na mesma altura */}
            <SvgMath
              x={R - 6}
              y={T + 24}
              math="\text{fio rompido}"
              anchor="end"
              fontSize={15}
              tone={3}
            />
          </g>
        )}

        {/* curto: um caminho sem carga, da linha positiva direto à massa */}
        {curto && (
          <g>
            <path
              className={styles.fault}
              d={`M ${FAULT_X} ${T} L ${FAULT_X} ${LOAD_Y - 10} L ${FAULT_X - 7} ${LOAD_Y - 4} L ${FAULT_X + 7} ${LOAD_Y + 4} L ${FAULT_X} ${LOAD_Y + 10} L ${FAULT_X} ${B}`}
            />
            <circle className={styles.faultDot} cx={FAULT_X} cy={T} r={3.5} />
            {retorno === 'fio' ? (
              <circle className={styles.faultDot} cx={FAULT_X} cy={B} r={3.5} />
            ) : (
              <Massa x={FAULT_X} y={B} />
            )}
            <SvgMath
              x={FAULT_X - 14}
              y={LOAD_Y}
              math="\text{curto}"
              anchor="end"
              fontSize={15}
              tone={3}
            />
          </g>
        )}

        {/* carga */}
        <line className={styles.wire} x1={R} y1={T} x2={R} y2={loadTop} />
        <line className={styles.wire} x1={R} y1={loadBottom} x2={R} y2={B} />
        {carga === 'resistor' ? (
          <path
            className={styles.load}
            d={`M ${R} ${loadTop} l 9 4 l -18 7 l 18 7 l -18 7 l 18 7 l -18 7 l 9 5`}
          />
        ) : (
          <g>
            <circle className={styles.lamp} cx={R} cy={LOAD_Y} r={17} />
            <line className={styles.load} x1={R - 12} y1={LOAD_Y - 12} x2={R + 12} y2={LOAD_Y + 12} />
            <line className={styles.load} x1={R + 12} y1={LOAD_Y - 12} x2={R - 12} y2={LOAD_Y + 12} />
            <line className={styles.wire} x1={R} y1={loadTop} x2={R} y2={LOAD_Y - 17} />
            <line className={styles.wire} x1={R} y1={LOAD_Y + 17} x2={R} y2={loadBottom} />
          </g>
        )}
        <SvgMath
          x={R + 30}
          y={LOAD_Y}
          math={
            rotuloCarga ??
            (carga === 'resistor' ? '\\text{resistor}' : '\\text{lâmpada}')
          }
          anchor="start"
          tone={2}
        />

        {/* retorno */}
        {retorno === 'massa' ? (
          <g>
            <Massa x={L} y={B} />
            <Massa x={R} y={B} />
            <rect
              className={styles.body}
              x={L - 34}
              y={B + 20}
              width={R - L + 68}
              height={14}
              rx={4}
            />
            <SvgMath
              x={(L + R) / 2}
              y={B + 50}
              math="\text{carroceria e chassi (massa)}"
              fontSize={15}
            />
          </g>
        ) : (
          <line className={styles.wire} x1={L} y1={B} x2={R} y2={B} />
        )}

        {/* corrente */}
        {mostraCorrente && (
          <g>
            <Seta x={(FUSE_X + SWITCH_X) / 2} y={T} dir={d('right')} />
            {curto ? (
              <Seta x={FAULT_X} y={(T + LOAD_Y - 10) / 2} dir={d('down')} />
            ) : (
              <Seta x={R} y={(loadBottom + B) / 2} dir={d('down')} />
            )}
            {retorno === 'massa' ? (
              <Seta x={(L + R) / 2} y={B + 27} dir={d('left')} />
            ) : (
              <Seta x={(L + R) / 2} y={B} dir={d('left')} />
            )}
            <Seta x={L} y={(BAT_Y + B) / 2 + 8} dir={d('up')} />
            {rotuloCorrente && (
              <SvgMath
                x={(L + R) / 2}
                y={B - 18}
                math={rotuloCorrente}
                fontSize={16}
                tone={1}
              />
            )}
          </g>
        )}
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
