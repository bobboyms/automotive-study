import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import base from '../Simbolos/styles.module.css';

// O restraint system por dentro (TRN-120, tópico 9), em três figuras:
//
//   modulo   — o air bag module em corte: a trim cover que rasga, o bag
//              dobrado, o inflator com os pellets e o squib no meio.
//   sensor   — o magnet-and-ball sensor, o mais simples de todos: dá para
//              ver com os olhos por que a desaceleração fecha o contato.
//   circuito — quem fala com quem: sensors, air bag control module, squib e
//              warning lamp.
//
// Um tom só, o 1, e sempre com o mesmo sentido: o movimento ou o sinal que
// atravessa o desenho. Peça e carcaça ficam na cor do texto, como nas outras
// figuras da TRN-120.

const W = 480;
const FS = 15;

function Seta({de, para}) {
  const ang = Math.atan2(para[1] - de[1], para[0] - de[0]);
  const p = (a) =>
    `${para[0] - 11 * Math.cos(ang + a)} ${para[1] - 11 * Math.sin(ang + a)}`;
  return (
    <g className={base.seta}>
      <line x1={de[0]} y1={de[1]} x2={para[0]} y2={para[1]} />
      <path d={`M ${p(0.5)} L ${para[0]} ${para[1]} L ${p(-0.5)}`} />
    </g>
  );
}

// ------------------------------------------------------------------ modulo

// O bag vai dobrado em sanfona. Três linhas em ziguezague dizem isso melhor
// que um contorno de saco: o que importa é que ele ocupa pouco espaço agora e
// muito espaço depois.
function dobra(y) {
  const pts = [];
  for (let x = 108, i = 0; x <= 372; x += 16, i++) {
    pts.push(`${x},${(y + (i % 2 ? 4 : -4)).toFixed(0)}`);
  }
  return `M ${pts.join(' L ')}`;
}

const PELLETS = [198, 212, 226, 240, 254, 268, 282];

function Modulo() {
  return (
    <>
      {/* carcaça de metal, aberta em cima: é por ali que a bolsa sai */}
      <rect className={base.metal} x={92} y={86} width={296} height={98} rx={6} />

      {/* trim cover: a tampa que rasga pela costura do meio. Desenhada como
          uma faixa, e não como um fio: ela é uma peça plástica com espessura,
          e a costura é um sulco no meio dela */}
      <path className={base.parte} d="M 86 86 Q 240 52 394 86 L 394 95 Q 240 61 86 95 Z" />
      <path className={base.fio} d="M 235 69 L 240 78 L 245 69" />

      {/* o bag dobrado */}
      {[104, 116, 128].map((y) => (
        <path key={y} className={base.fino} d={dobra(y)} />
      ))}

      {/* inflator, com os pellets e o squib no meio deles */}
      <rect className={base.parte} x={186} y={136} width={108} height={40} rx={6} />
      {PELLETS.map((x) => (
        <circle key={x} className={base.metal} cx={x} cy={147} r={4.5} />
      ))}
      <rect className={base.contato} x={226} y={158} width={28} height={14} rx={2} />
      <path className={base.fino} d="M 230 165 L 234 161 L 238 169 L 242 161 L 246 169 L 250 165" />

      <RotuloTermo k="trim cover" x={186} y={26} anchor="middle" para={[208, 69]} fs={FS} />
      <RotuloTermo k="air bag" x={400} y={104} anchor="start" para={[372, 116]} fs={FS} />
      <RotuloTermo
        k="gas generant"
        texto={'gas\ngenerant'}
        x={400}
        y={130}
        anchor="start"
        de={[396, 139]}
        para={[288, 147]}
        fs={FS}
      />
      <RotuloTermo k="inflator" x={400} y={172} anchor="start" para={[296, 170]} fs={FS} />
      <RotuloTermo k="squib" x={240} y={200} anchor="middle" para={[240, 173]} fs={FS} />
    </>
  );
}

// ------------------------------------------------------------------ sensor

function Sensor() {
  return (
    <>
      {/* corpo do sensor, em corte */}
      <rect className={base.parte} x={90} y={70} width={300} height={70} rx={10} />

      {/* os dois contatos são duas lâminas, uma em cima e outra embaixo: a
          ball fecha o circuit encostando nas duas ao mesmo tempo. Desenhá-las
          lado a lado, como na primeira versão, deixava os wires cruzando um
          contato para sair */}
      <rect className={base.contato} x={120} y={86} width={48} height={8} />
      <rect className={base.contato} x={120} y={116} width={48} height={8} />
      <line className={base.fio} x1={120} y1={90} x2={40} y2={90} />
      <line className={base.fio} x1={120} y1={120} x2={40} y2={120} />

      {/* o magnet segura a ball enquanto o veículo anda normalmente */}
      <rect className={base.metal} x={318} y={82} width={46} height={46} rx={3} />
      <circle className={base.metal} cx={300} cy={105} r={18} />

      {/* na desaceleração, a ball vence o magnet e vai para a frente */}
      <Seta de={[276, 105]} para={[190, 105]} />

      <RotuloTermo
        k="contacts"
        texto={'electrical\ncontacts'}
        x={144}
        y={38}
        anchor="middle"
        para={[144, 86]}
        fs={FS}
      />
      <RotuloTermo texto="a ball rola" x={233} y={86} anchor="middle" fs={FS} tone={1} />
      <RotuloTermo k="ball" x={300} y={38} anchor="middle" para={[300, 87]} fs={FS} />
      <RotuloTermo
        k="permanent magnet"
        texto={'permanent\nmagnet'}
        x={412}
        y={38}
        anchor="middle"
        para={[344, 90]}
        fs={FS}
      />
    </>
  );
}

// ---------------------------------------------------------------- circuito

function Circuito() {
  return (
    <>
      <rect className={base.parte} x={14} y={24} width={140} height={40} rx={5} />
      <rect className={base.parte} x={14} y={90} width={140} height={40} rx={5} />
      <rect className={base.parte} x={196} y={24} width={150} height={106} rx={5} />
      <rect className={base.parte} x={390} y={24} width={76} height={40} rx={5} />
      <rect className={base.parte} x={390} y={90} width={76} height={40} rx={5} />

      {/* o capacitor de reserva, dentro do módulo */}
      <g className={base.fino}>
        <line x1={248} y1={90} x2={262} y2={90} />
        <line x1={286} y1={90} x2={272} y2={90} />
      </g>
      <g className={base.placaCurta}>
        <line x1={262} y1={80} x2={262} y2={100} />
        <line x1={272} y1={80} x2={272} y2={100} />
      </g>

      <Seta de={[158, 44]} para={[192, 44]} />
      <Seta de={[158, 110]} para={[192, 110]} />
      <Seta de={[350, 44]} para={[386, 44]} />
      <Seta de={[350, 110]} para={[386, 110]} />

      <RotuloTermo k="impact sensor" x={84} y={44} anchor="middle" fs={FS} />
      <RotuloTermo
        k="occupant position sensor"
        texto={'occupant\nsensor'}
        x={84}
        y={101}
        anchor="middle"
        fs={FS}
      />
      <RotuloTermo
        k="air bag control module"
        texto={'air bag\ncontrol module'}
        x={271}
        y={48}
        anchor="middle"
        fs={FS}
      />
      <RotuloTermo k="capacitor" x={271} y={120} anchor="middle" fs={FS} />
      <RotuloTermo k="squib" x={428} y={44} anchor="middle" fs={FS} />
      <RotuloTermo
        k="air bag warning lamp"
        texto={'warning\nlamp'}
        x={428}
        y={102}
        anchor="middle"
        fs={FS}
      />
    </>
  );
}

const MODOS = {
  modulo: {
    H: 212,
    corpo: Modulo,
    alt: 'Um air bag module em corte: a tampa curva por cima, o bag dobrado em sanfona, e o inflator no meio com os pellets e o squib.',
  },
  sensor: {
    H: 160,
    corpo: Sensor,
    alt: 'Um magnet-and-ball sensor em corte: o magnet à direita segura a ball, e os dois contatos elétricos ficam à esquerda, no caminho dela.',
  },
  circuito: {
    H: 160,
    corpo: Circuito,
    alt: 'Diagrama de blocos: os sensors entram no air bag control module, que tem um capacitor dentro e manda sinal para o squib e para a warning lamp.',
  },
};

export default function AirBag({modo = 'modulo', caption}) {
  const {H, corpo: Corpo, alt} = MODOS[modo] || MODOS.modulo;
  return (
    <figure className={base.figure}>
      <svg
        className={base.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || alt}
      >
        <Corpo />
      </svg>
      {caption && <figcaption className={base.caption}>{caption}</figcaption>}
    </figure>
  );
}
