import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import base from '../Simbolos/styles.module.css';
import styles from './styles.module.css';

// A colisão vista de dois jeitos (TRN-120, tópico 9):
//
//   zonas  — o veículo de lado: as duas crush zones e o passenger compartment
//            entre elas. Mostra o que amassa de propósito e o que não pode
//            amassar.
//   parada — o mesmo corpo, parado em duas distâncias diferentes. As duas
//            setas estão na mesma escala (uma é dez vezes a outra), porque é
//            a razão entre as distâncias que explica a razão entre as forças.
//
// Um tom só, o 1, e sempre com o mesmo sentido: em `zonas` é a parte que se
// deforma de propósito; em `parada` é o caminho que o corpo ainda percorre
// depois que o veículo já parou. Nos dois casos, "o que cede".

const W = 480;
const FS = 15;

// Seta de tom 1, com a ponta em `para`.
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

// ------------------------------------------------------------------- zonas

// O perfil é dividido em três: dianteira que amassa, habitáculo, traseira que
// amassa. O habitáculo é desenhado como uma peça só — assoalho, colunas e
// teto num traço contínuo — porque é assim que ele trabalha: uma caixa.
const CELULA =
  'M 136 160 L 136 112 L 168 112 L 196 72 L 292 72 L 322 112 L 350 112 L 350 160 Z';

function Zonas() {
  return (
    <>
      {/* dianteira e traseira: as duas crush zones */}
      <path className={styles.zona} d="M 34 160 L 34 120 L 136 112 L 136 160 Z" />
      <path className={styles.zona} d="M 350 160 L 350 112 L 450 120 L 450 160 Z" />

      {/* habitáculo */}
      <path className={styles.celula} d={CELULA} />

      {/* rodas, por cima da carroceria */}
      <circle className={base.parte} cx={112} cy={160} r={20} />
      <circle className={base.parte} cx={378} cy={160} r={20} />
      <circle className={base.ponto} cx={112} cy={160} r={4} />
      <circle className={base.ponto} cx={378} cy={160} r={4} />

      {/* de onde vem o impacto */}
      <g className={base.fio}>
        <line x1={6} y1={136} x2={28} y2={136} />
        <path d="M 19 129 L 28 136 L 19 143" />
      </g>

      <RotuloTermo
        k="passenger compartment"
        x={242}
        y={28}
        anchor="middle"
        para={[242, 72]}
        fs={FS}
      />
      <RotuloTermo
        k="body pillar"
        x={398}
        y={56}
        anchor="start"
        de={[394, 56]}
        para={[308, 94]}
        fs={FS}
      />
      <RotuloTermo k="crush zone" x={80} y={196} anchor="middle" para={[80, 140]} fs={FS} />
      <RotuloTermo k="crush zone" x={420} y={196} anchor="middle" para={[420, 140]} fs={FS} />
    </>
  );
}

// ------------------------------------------------------------------ parada

// Boneco: cabeça e tronco. Serve só para dizer "este é o corpo de quem vai
// dentro do carro", e fica fora da seta para não disputar espaço com ela.
function Corpo({x, y}) {
  return (
    <g className={base.fio}>
      <circle cx={x} cy={y} r={11} style={{fill: 'var(--mv-paper)'}} />
      <line x1={x} y1={y + 11} x2={x} y2={y + 30} />
    </g>
  );
}

// Os dois corpos partem do mesmo ponto, no mesmo instante. O que muda é onde
// cada um para — e as duas setas estão na mesma escala: 234 px valem 0.50 m,
// 23 px valem 0.05 m.
function Parada() {
  return (
    <>
      {/* com restraint: o corpo ainda anda 0.50 m antes de parar */}
      <Corpo x={46} y={66} />
      <Seta de={[62, 66]} para={[296, 66]} />
      <line className={base.fio} x1={300} y1={44} x2={300} y2={90} />
      <RotuloTermo texto="com seat belt e air bag" x={62} y={32} anchor="start" fs={FS} />
      <RotuloTermo texto="0.50 m" x={180} y={96} anchor="middle" fs={FS} tone={1} />
      <RotuloTermo texto="F ≈ 12 600 N" x={312} y={66} anchor="start" fs={FS} />

      {/* sem restraint: o mesmo corpo para em um décimo da distância */}
      <Corpo x={46} y={160} />
      <Seta de={[62, 160]} para={[85, 160]} />
      <line className={base.fio} x1={89} y1={138} x2={89} y2={184} />
      <RotuloTermo texto="contra o painel duro" x={62} y={126} anchor="start" fs={FS} />
      <RotuloTermo texto="0.05 m" x={92} y={196} anchor="middle" fs={FS} tone={1} />
      <RotuloTermo texto="F ≈ 126 000 N" x={110} y={160} anchor="start" fs={FS} />
    </>
  );
}

const MODOS = {
  zonas: {
    H: 210,
    corpo: Zonas,
    alt: 'Um veículo visto de lado: a dianteira e a traseira marcadas como crush zones e o habitáculo entre elas, desenhado com traço grosso.',
  },
  parada: {
    H: 210,
    corpo: Parada,
    alt: 'Duas setas na mesma escala: o corpo parando em 0.50 m com cinto e air bag, e em 0.05 m contra o painel, com as forças correspondentes.',
  },
};

export default function Colisao({modo = 'zonas', caption}) {
  const {H, corpo: Corpo2, alt} = MODOS[modo] || MODOS.zonas;
  return (
    <figure className={base.figure}>
      <svg
        className={base.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || alt}
      >
        <Corpo2 />
      </svg>
      {caption && <figcaption className={base.caption}>{caption}</figcaption>}
    </figure>
  );
}
