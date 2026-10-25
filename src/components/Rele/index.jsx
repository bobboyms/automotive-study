import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import RotuloTermo from '../diagramas/RotuloTermo';
import {Peca, Massa, Rele as SimboloRele} from '../Simbolos/desenhos';
import styles from '../Simbolos/styles.module.css';

// O relay em dois desenhos.
//
//   <Rele modo="corte" caption="..." />            relay aberto, em repouso
//   <Rele modo="corte" acionado caption="..." />   coil com current: o contato fecha
//   <Rele modo="buzina" caption="..." />           circuit da horn, botão solto
//   <Rele modo="buzina" acionado caption="..." />  botão apertado: as duas currents
//
// Tons: azul (1) é a current; laranja (2) é a load (a horn); verde (3) é o
// magnetic field da coil.

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

// ---------------------------------------------------------------------------
// Relay em corte: coil e iron core no meio, armature presa num pivô à
// esquerda, spring puxando a armature para cima, contatos à direita.

const PIVO = [70, 80];
const PONTA_X = 270;

function Corte({acionado}) {
  // inclinação da armature: em repouso a spring a segura quase deitada;
  // acionada, o core a puxa até encostar
  const inc = acionado ? 0.2286 : 0.06;
  const yEm = (x) => PIVO[1] + (x - PIVO[0]) * inc;
  const ponta = [PONTA_X, yEm(PONTA_X)];
  const molaX = 222;
  const molaY = yEm(molaX) - 3;
  // spring em zigue-zague, do anchor (y = 46) até a armature
  const n = 8;
  const passo = (molaY - 46) / n;
  let mola = `M ${molaX} 46`;
  for (let i = 1; i < n; i++) mola += ` L ${molaX + (i % 2 ? 6 : -6)} ${46 + i * passo}`;
  mola += ` L ${molaX} ${molaY}`;

  return (
    <g>
      {/* base de plástico e pinos */}
      <rect className={styles.nucleo} x={40} y={228} width={290} height={10} rx={2} />
      <g className={styles.fio}>
        {[70, 118, 162, 270].map((x) => (
          <line key={x} x1={x} y1={238} x2={x} y2={266} />
        ))}
      </g>
      {[
        [70, '30'],
        [118, '86'],
        [162, '85'],
        [270, '87'],
      ].map(([x, n]) => (
        <SvgMath key={n} x={x} y={282} math={n} fontSize={13} />
      ))}

      {/* estrutura: o pivô (ligado ao pino 30) e a barra de cima, que segura
          a spring */}
      <rect className={styles.metal} x={64} y={36} width={12} height={192} />
      <rect className={styles.metal} x={64} y={36} width={170} height={10} />

      {/* iron core e coil */}
      <rect className={styles.nucleo} x={130} y={100} width={20} height={128} />
      <rect className={styles.metal} x={112} y={112} width={56} height={88} rx={3} />
      <g className={styles.fino}>
        {Array.from({length: 10}, (_, i) => (
          <line key={i} x1={112} y1={120 + i * 8} x2={168} y2={120 + i * 8} />
        ))}
      </g>
      <rect className={styles.nucleo} x={130} y={100} width={20} height={12} />
      <g className={styles.fio}>
        <line x1={118} y1={200} x2={118} y2={228} />
        <line x1={162} y1={200} x2={162} y2={228} />
      </g>

      {/* contato fixo (87) */}
      <rect className={styles.metal} x={265} y={140} width={10} height={88} />
      <circle className={styles.metal} cx={PONTA_X} cy={140} r={5} />

      {/* armature e contato móvel */}
      <line
        x1={PIVO[0]}
        y1={PIVO[1]}
        x2={ponta[0]}
        y2={ponta[1]}
        style={{stroke: 'var(--ifm-font-color-base)', strokeWidth: 7, strokeLinecap: 'round'}}
      />
      <line
        x1={PIVO[0]}
        y1={PIVO[1]}
        x2={ponta[0]}
        y2={ponta[1]}
        style={{stroke: 'var(--ifm-color-emphasis-200)', strokeWidth: 3.6, strokeLinecap: 'round'}}
      />
      <circle className={styles.metal} cx={ponta[0]} cy={ponta[1] + 6.5} r={5} />
      <circle className={styles.contato} cx={PIVO[0]} cy={PIVO[1]} r={4} />
      <path className={styles.mola} d={mola} />

      {acionado && (
        <g>
          {/* o campo sai do topo do core, puxa a armature e volta pelos lados */}
          <path className={styles.campo} d="M 134 98 C 96 94, 92 150, 104 190" />
          <path className={styles.campo} d="M 146 98 C 184 94, 188 150, 176 190" />
          {/* as duas currents: a da coil (86 → 85) e a da load (30 → 87) */}
          <Seta x={118} y={252} dir="up" />
          <Seta x={162} y={252} dir="down" />
          <Seta x={70} y={252} dir="up" />
          <Seta x={270} y={200} dir="down" />
        </g>
      )}

      {/* nomes */}
      <RotuloTermo k="spring" x={240} y={41} anchor="start" fs={15} />
      <RotuloTermo k="armature" x={300} y={78} anchor="start" fs={15} para={[252, yEm(252)]} />
      <RotuloTermo k="contacts" x={300} y={128} anchor="start" fs={15} para={[278, 138]} />
      <RotuloTermo k="relay coil" texto={'relay\ncoil'} x={204} y={176} anchor="start" fs={15} para={[169, 168]} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Circuit da horn: um fuse alimenta, por um splice, os dois lados do relay.
// Control circuit: horn switch → coil (86 → 85) → ground.
// Load circuit: 30 → 87 → horn → ground.

const BAT = 50;
const TOPO = 40;
const COIL = 160;
const CONTATO = 280;
const RELE_Y = 195;
const CHAO = 330;

function Buzina({acionado}) {
  const pinoCima = RELE_Y - 44;
  const pinoBaixo = RELE_Y + 44;
  const buzinaY = 280;
  return (
    <g>
      {/* battery, em pé, com o − no ground */}
      <g className={styles.fio}>
        <line x1={BAT} y1={TOPO} x2={BAT} y2={113} />
        <line x1={BAT} y1={127} x2={BAT} y2={CHAO} />
        <line x1={BAT} y1={TOPO} x2={70} y2={TOPO} />
        <line x1={130} y1={TOPO} x2={CONTATO} y2={TOPO} />
        <line x1={CONTATO} y1={TOPO} x2={CONTATO} y2={pinoCima} />
        <line x1={COIL} y1={TOPO} x2={COIL} y2={70} />
        <line x1={COIL} y1={130} x2={COIL} y2={pinoCima} />
        <line x1={COIL} y1={pinoBaixo} x2={COIL} y2={CHAO} />
        <line x1={CONTATO} y1={pinoBaixo} x2={CONTATO} y2={buzinaY - 30} />
        <line x1={CONTATO} y1={buzinaY + 30} x2={CONTATO} y2={CHAO} />
      </g>
      <line className={styles.placa} x1={BAT - 20} y1={113} x2={BAT + 20} y2={113} />
      <line className={styles.placaCurta} x1={BAT - 11} y1={127} x2={BAT + 11} y2={127} />
      <SvgMath x={BAT + 27} y={103} math="+" anchor="start" />
      <SvgMath x={BAT + 27} y={137} math="-" anchor="start" />
      <Massa x={BAT} y={CHAO} />
      <Massa x={COIL} y={CHAO} />
      <Massa x={CONTATO} y={CHAO} />

      <Peca tipo="fusivel" x={100} y={TOPO} />
      <SvgMath x={100} y={TOPO - 24} math="\text{fuse}" fontSize={15} />
      <circle className={styles.ponto} cx={COIL} cy={TOPO} r={4.5} />
      <SvgMath x={COIL} y={TOPO - 22} math="\text{splice}" fontSize={15} />

      <Peca tipo="interruptor" x={COIL} y={100} rot={90} fechado={acionado} />
      {/* à direita do switch: à esquerda, encostava no + da battery */}
      <RotuloTermo k="horn switch" texto={'horn\nswitch'} x={COIL + 34} y={88} anchor="start" fs={18} />

      <SimboloRele x={(COIL + CONTATO) / 2} y={RELE_Y} dx={(CONTATO - COIL) / 2} acionado={acionado} />
      <SvgMath x={(COIL + CONTATO) / 2} y={pinoCima + 2} math="\text{relay}" fontSize={15} />

      <Peca tipo="buzina" x={CONTATO} y={buzinaY} rot={90} />
      <SvgMath x={CONTATO + 30} y={buzinaY} math="\text{horn}" anchor="start" fontSize={15} tone={2} />

      <RotuloTermo k="control circuit" texto={'control\ncircuit'} x={COIL - 26} y={RELE_Y - 8} anchor="end" fs={18} />
      <RotuloTermo k="load circuit" texto={'load\ncircuit'} x={CONTATO + 30} y={RELE_Y - 8} anchor="start" fs={18} />

      {acionado && (
        <g>
          <Seta x={215} y={TOPO} dir="right" />
          <Seta x={COIL} y={141} dir="down" />
          <Seta x={COIL} y={290} dir="down" />
          <Seta x={CONTATO} y={120} dir="down" />
          <Seta x={CONTATO} y={320} dir="down" />
          <Seta x={BAT} y={230} dir="up" />
        </g>
      )}
    </g>
  );
}

export default function Rele({modo = 'corte', acionado = false, caption}) {
  const [W, H] = modo === 'corte' ? [440, 296] : [400, 348];
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || 'Relay.'}
      >
        {modo === 'corte' ? <Corte acionado={acionado} /> : <Buzina acionado={acionado} />}
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
