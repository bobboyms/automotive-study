import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import RotuloTermo from '../diagramas/RotuloTermo';
import {Peca, Massa, Rele as SimboloRele} from '../Simbolos/desenhos';
import s from '../Simbolos/styles.module.css';
import m from '../Medicao/styles.module.css';

// O horn relay do Ford Edge fora do carro, na bancada, com a numeração da Ford
// (coil 2 e 1, contato 3 e 5) e o resistor em paralelo com a coil que o
// símbolo do manual mostra.
//
//   <ReleBancada modo="bobina" leitura="..." caption="..." />    ohmmeter na coil (2 e 1)
//   <ReleBancada modo="contato" leitura="OL" caption="..." />    ohmmeter no contato (3 e 5)
//   <ReleBancada modo="contato" acionado leitura="..." />        o mesmo, com 12 V na coil
//   <ReleBancada modo="bancada" caption="..." />                 battery, relay e bulb; jumper do pino 1 solto
//   <ReleBancada modo="bancada" acionado caption="..." />        jumper ligado: a bulb acende
//
// Tons: azul (1) é a current; laranja (2) é a bulb e a ponta vermelha do meter.
// Nenhuma ponta de prova cruza um wire: a vermelha chega por cima, a preta
// por baixo (conferido com `npm run figuras`).

const ROT = {right: 0, down: 90, left: 180, up: 270};
function Seta({x, y, dir}) {
  return (
    <path className={s.seta} d="M -6 -7 L 4 0 L -6 7" transform={`translate(${x} ${y}) rotate(${ROT[dir]})`} />
  );
}

const NOMES = ['2', '1', '3', '5'];
const FS = 16;

// ---------------------------------------------------------------------------
// Medições com o ohmmeter. O meter fica do lado da peça medida, com as
// entradas na lateral virada para o relay: na coil, o meter à esquerda; no
// contato, à direita. A vermelha (VΩ, em cima) vai ao pino de cima por cima;
// a preta (COM, embaixo) vai ao pino de baixo por baixo. Assim as duas não se
// cruzam e nenhuma atravessa o relay.

const RY = 140;
const DX = 50;
const MW = 130;
const MH = 110;
const MY = 80;
const LAYOUT = {
  bobina: {W: 400, RX: 310, MX: 16, lado: 'direita'},
  contato: {W: 450, RX: 170, MX: 304, lado: 'esquerda'},
};

function Medidor({leitura, MX, lado}) {
  const jx = lado === 'direita' ? MX + MW - 18 : MX + 18;
  const tx = lado === 'direita' ? jx - 16 : jx + 16;
  const anc = lado === 'direita' ? 'end' : 'start';
  return (
    <g>
      <rect className={m.meter} x={MX} y={MY} width={MW} height={MH} rx={8} />
      <rect className={m.display} x={MX + 12} y={MY + 10} width={MW - 24} height={34} rx={3} />
      <SvgMath x={MX + MW / 2} y={MY + 27} math={leitura} fontSize={22} />
      <SvgMath x={tx} y={MY + 62} math="\text{V}\Omega" fontSize={15} anchor={anc} />
      <SvgMath x={tx} y={MY + 92} math="\text{COM}" fontSize={15} anchor={anc} />
      <circle className={m.jackRed} cx={jx} cy={MY + 62} r={6} />
      <circle className={m.jackBlack} cx={jx} cy={MY + 92} r={6} />
    </g>
  );
}

function Pontas({x, MX, lado}) {
  const jx = lado === 'direita' ? MX + MW - 18 : MX + 18;
  const sai = lado === 'direita' ? 50 : -50; // a ponta sai da entrada para o lado do relay
  const top = RY - 44;
  const bot = RY + 44;
  const alto = top - 58;
  const baixo = bot + 58;
  const verm = `M ${jx} ${MY + 62} C ${jx + sai} ${MY + 62}, ${jx + sai} ${alto}, ${(jx + x) / 2} ${alto} C ${x} ${alto}, ${x} ${alto}, ${x} ${top - 26} L ${x} ${top - 2}`;
  const preta = `M ${jx} ${MY + 92} C ${jx + sai} ${MY + 92}, ${jx + sai} ${baixo}, ${(jx + x) / 2} ${baixo} C ${x} ${baixo}, ${x} ${baixo}, ${x} ${bot + 26} L ${x} ${bot + 2}`;
  return (
    <g>
      <path className={m.leadBlack} d={preta} />
      <circle className={m.tipBlack} cx={x} cy={bot + 2} r={4.5} />
      <path className={m.leadRed} d={verm} />
      <circle className={m.tipRed} cx={x} cy={top - 2} r={4.5} />
    </g>
  );
}

function Medicao({modo, acionado, leitura}) {
  const {RX, MX, lado} = LAYOUT[modo];
  const coil = RX - DX;
  const contato = RX + DX;
  const alvo = modo === 'bobina' ? coil : contato;
  const top = RY - 44;
  const bot = RY + 44;
  return (
    <g>
      <SimboloRele x={RX} y={RY} dx={DX} resistor nomes={NOMES} acionado={acionado} fontSize={15} />
      <SvgMath x={RX} y={RY + 42} math="\text{relay}" fontSize={14} />
      {modo === 'contato' && acionado && (
        <g>
          {/* 12 V na coil: battery à esquerda, + no pino 2 por um fused jumper */}
          <g className={s.fio}>
            <line x1={30} y1={top - 40} x2={coil} y2={top - 40} />
            <line x1={coil} y1={top - 40} x2={coil} y2={top} />
            <line x1={30} y1={top - 40} x2={30} y2={RY - 8} />
            <line x1={30} y1={RY + 8} x2={30} y2={bot + 40} />
            <line x1={30} y1={bot + 40} x2={coil} y2={bot + 40} />
            <line x1={coil} y1={bot + 40} x2={coil} y2={bot} />
          </g>
          <line className={s.placa} x1={14} y1={RY - 8} x2={46} y2={RY - 8} />
          <line className={s.placaCurta} x1={21} y1={RY + 8} x2={39} y2={RY + 8} />
          <SvgMath x={30} y={RY - 24} math="+" fontSize={FS} />
          <Peca tipo="fusivel" x={76} y={top - 40} />
          <SvgMath x={76} y={top - 64} math="12\,\text{V}" fontSize={FS} />
          <Seta x={coil} y={top - 16} dir="down" />
          <Seta x={76} y={bot + 40} dir="left" />
        </g>
      )}
      <Medidor leitura={leitura} MX={MX} lado={lado} />
      <Pontas x={alvo} MX={MX} lado={lado} />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Bancada: battery, dois fused jumpers, o relay e a bulb, como no wiring
// diagram do carro. O jumper do pino 1 ao ground faz o papel do BCM.

const BAT = 40;
const Y2 = 40; // wire até o pino 3
const Y1 = 82; // wire até o pino 2
const BX = 300; // centro do relay na bancada
const BY = 180;
const BDX = 60; // coil em x = 240, contato em x = 360
const CHAO = 360;

function Bancada({acionado}) {
  const coil = BX - BDX;
  const contato = BX + BDX;
  const top = BY - 44;
  const bot = BY + 44;
  const bulbY = 290;
  const solto = !acionado;
  return (
    <g>
      {/* battery em pé, com o + em cima */}
      <g className={s.fio}>
        <line x1={BAT} y1={Y2} x2={BAT} y2={203} />
        <line x1={BAT} y1={217} x2={BAT} y2={CHAO} />
        <line x1={BAT} y1={Y2} x2={contato} y2={Y2} />
        <line x1={contato} y1={Y2} x2={contato} y2={top} />
        <line x1={BAT} y1={Y1} x2={coil} y2={Y1} />
        <line x1={coil} y1={Y1} x2={coil} y2={top} />
        {/* pino 1: o jumper até o ground, solto ou ligado */}
        <line x1={coil} y1={bot} x2={coil} y2={solto ? 282 : CHAO} />
        {solto && <line x1={coil} y1={316} x2={coil} y2={CHAO} />}
        <line x1={contato} y1={bot} x2={contato} y2={bulbY - 30} />
        <line x1={contato} y1={bulbY + 30} x2={contato} y2={CHAO} />
      </g>
      <circle className={s.ponto} cx={BAT} cy={Y1} r={4.5} />
      <line className={s.placa} x1={BAT - 20} y1={203} x2={BAT + 20} y2={203} />
      <line className={s.placaCurta} x1={BAT - 11} y1={217} x2={BAT + 11} y2={217} />
      <SvgMath x={BAT + 28} y={196} math="+" anchor="start" fontSize={FS} />
      <SvgMath x={BAT + 28} y={226} math="-" anchor="start" fontSize={FS} />
      <SvgMath x={BAT + 28} y={260} math="12\,\text{V}" anchor="start" fontSize={FS} />
      <Massa x={BAT} y={CHAO} />
      <Massa x={coil} y={CHAO} />
      <Massa x={contato} y={CHAO} />

      <Peca tipo="fusivel" x={140} y={Y1} />
      <Peca tipo="fusivel" x={200} y={Y2} />
      <RotuloTermo k="fused jumper wire" texto="fused jumper" x={140} y={Y1 + 26} anchor="middle" fs={FS} />
      <RotuloTermo k="fused jumper wire" texto="fused jumper" x={200} y={Y2 - 20} anchor="middle" fs={FS} />

      <SimboloRele x={BX} y={BY} dx={BDX} resistor nomes={NOMES} acionado={acionado} fontSize={15} />
      <SvgMath x={BX} y={BY + 42} math="\text{relay}" fontSize={14} />

      {solto ? (
        <g>
          <circle className={m.openEnd} cx={coil} cy={282} r={4} />
          <circle className={m.openEnd} cx={coil} cy={316} r={4} />
          <SvgMath x={coil - 12} y={299} math="\text{jumper solto}" anchor="end" fontSize={FS} />
        </g>
      ) : (
        <SvgMath x={coil - 12} y={299} math="\text{jumper ligado}" anchor="end" fontSize={FS} />
      )}

      <Peca tipo="lampada" x={contato} y={bulbY} rot={90} />
      {acionado && (
        <g className={s.carga}>
          {[[-26, -12], [-26, 12], [26, -12], [26, 12]].map(([dx, dy]) => (
            <line key={`${dx}${dy}`} x1={contato + dx * 0.8} y1={bulbY + dy * 0.8} x2={contato + dx * 1.25} y2={bulbY + dy * 1.25} />
          ))}
        </g>
      )}
      <RotuloTermo k="bulb" x={contato + 40} y={bulbY} anchor="start" fs={FS} tone={2} />

      {acionado && (
        <g>
          <Seta x={290} y={Y2} dir="right" />
          <Seta x={195} y={Y1} dir="right" />
          <Seta x={coil} y={262} dir="down" />
          <Seta x={contato} y={340} dir="down" />
          <Seta x={BAT} y={300} dir="up" />
        </g>
      )}
    </g>
  );
}

export default function ReleBancada({modo = 'bancada', acionado = false, leitura = '', caption}) {
  const [W, H] = modo === 'bancada' ? [460, 380] : [LAYOUT[modo].W, 290];
  return (
    <figure className={s.figure}>
      <svg
        className={s.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || 'Relay na bancada.'}
      >
        {modo === 'bancada' ? (
          <Bancada acionado={acionado} />
        ) : (
          <Medicao modo={modo} acionado={acionado} leitura={leitura} />
        )}
      </svg>
      {caption && <figcaption className={s.caption}>{caption}</figcaption>}
    </figure>
  );
}
