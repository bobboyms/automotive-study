import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import styles from './styles.module.css';
import LegendaLivro from '../LegendaLivro';

// O pistão de perto, em corte.
//
//   modo="conjunto"   pistão no cilindro: dois anéis de compressão, o anel de
//                     óleo, o pino e a folga entre pistão e parede (exagerada)
//   modo="compressao" uma canaleta ampliada: a pressão da combustão desce
//                     pela folga, entra atrás do anel e o aperta contra a
//                     parede e contra o fundo da canaleta
//   modo="oleo"       o anel de óleo descendo e raspando a película de óleo
//                     da parede, que volta para baixo
//
// Cores: tom 2 (laranja) é a pressão da combustão; tom 1 (azul) é o óleo.

function Seta({de, para, cls}) {
  const ang = Math.atan2(para[1] - de[1], para[0] - de[0]);
  const p = (a) => `${para[0] - 9 * Math.cos(ang + a)} ${para[1] - 9 * Math.sin(ang + a)}`;
  return (
    <g className={cls}>
      <line x1={de[0]} y1={de[1]} x2={para[0]} y2={para[1]} />
      <path d={`M ${p(0.5)} L ${para[0]} ${para[1]} L ${p(-0.5)}`} />
    </g>
  );
}

// parede do cilindro com hachura
function Parede({x, y, w, h, id}) {
  return (
    <g>
      <defs>
        <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" className={styles.hachura} />
        </pattern>
      </defs>
      <rect x={x} y={y} width={w} height={h} className={styles.parede} />
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} className={styles.paredeContorno} />
    </g>
  );
}

function Conjunto({caption}) {
  const W = 460;
  const H = 330;
  const L = 64; // face interna da parede esquerda
  const R = 264; // face interna da parede direita
  const F = 7; // folga, exagerada
  const pl = L + F;
  const pr = R - F;
  const top = 50;
  const X = (L + R) / 2;
  const ranhuras = [72, 92, 116];
  return (
    <figure className={styles.figure}>
      <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label={caption}>
        <Parede x={L - 24} y={20} w={24} h={290} id="pc-e" />
        <Parede x={R} y={20} w={24} h={290} id="pc-d" />
        {/* biela saindo do pistão */}
        <path className={styles.biela} d={`M ${X - 6} 170 L ${X - 14} 312 L ${X + 14} 312 L ${X + 6} 170 Z`} />
        {/* pistão */}
        <path className={styles.pistao} d={`M ${pl} ${top} H ${pr} V 230 H ${pl} Z`} />
        {ranhuras.map((y, i) => (
          <g key={y}>
            <rect className={i === 2 ? styles.anelOleo : styles.anel} x={L} y={y - 4} width={22} height={i === 2 ? 10 : 7} />
            <rect className={i === 2 ? styles.anelOleo : styles.anel} x={R - 22} y={y - 4} width={22} height={i === 2 ? 10 : 7} />
          </g>
        ))}
        <circle className={styles.biela} cx={X} cy={165} r={24} />
        <circle className={styles.pino} cx={X} cy={165} r={14} />
        {/* folga: duas setas apontando para o vão entre a parede e o pistão */}
        <Seta de={[L - 30, 34]} para={[L, 34]} cls={styles.cota} />
        <Seta de={[pl + 30, 34]} para={[pl, 34]} cls={styles.cota} />
        <line x1={pl} y1={28} x2={pl} y2={top} className={styles.guia} />
        <RotuloTermo k="clearance" x={pl + 36} y={34} />
        <RotuloTermo k="piston" x={X} y={206} anchor="middle" />
        <RotuloTermo k="compression ring" texto={'compression\nrings'} x={304} y={62} para={[R - 6, 70]} />
        <line x1={300} y1={74} x2={R - 6} y2={91} className={styles.chamada} />
        <circle cx={R - 6} cy={91} r={2} className={styles.ponto} />
        <RotuloTermo k="oil ring" x={304} y={124} para={[R - 6, 117]} />
        <RotuloTermo k="piston pin" x={304} y={160} para={[X + 12, 162]} />
        <RotuloTermo k="cylinder wall" x={304} y={250} para={[R + 12, 250]} />
        <RotuloTermo k="connecting rod" x={304} y={292} para={[X + 12, 292]} />
      </svg>
      {caption && <figcaption className={styles.caption}><LegendaLivro texto={caption} /></figcaption>}
    </figure>
  );
}

function Compressao({caption}) {
  const W = 460;
  const H = 300;
  const parede = 230; // face da parede do cilindro
  const pist = 220; // face do pistão (folga de 10, exagerada)
  return (
    <figure className={styles.figure}>
      <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label={caption}>
        <Parede x={parede} y={20} w={36} h={270} id="pv" />
        {/* pistão com a canaleta vazada */}
        <path className={styles.pistao} fillRule="evenodd" d={`M 40 90 H ${pist} V 270 H 40 Z M 166 160 H ${pist} V 196 H 166 Z`} />
        {/* gás da combustão: em cima do pistão, descendo pela folga e entrando atrás do anel */}
        <path className={styles.gas} d={`M 40 30 H ${parede} V 166 H ${pist} V 90 H 40 Z`} />
        <path className={styles.gas} d={`M 166 160 H ${pist - 2} V 166 H 178 V 196 H 166 Z`} />
        {/* anel apertado contra a parede e contra o fundo da canaleta */}
        <rect className={styles.anel} x={178} y={166} width={parede - 178} height={30} />
        <Seta de={[100, 40]} para={[100, 82]} cls={styles.pressao} />
        <Seta de={[160, 40]} para={[160, 82]} cls={styles.pressao} />
        <Seta de={[225, 100]} para={[225, 152]} cls={styles.pressao} />
        <Seta de={[168, 180]} para={[190, 180]} cls={styles.pressao} />
        <RotuloTermo texto="pressão da combustão" x={130} y={14} anchor="middle" tone={2} />
        <RotuloTermo k="clearance" x={290} y={112} para={[226, 122]} />
        <RotuloTermo k="compression ring" x={290} y={176} para={[212, 190]} />
        <RotuloTermo k="ring groove" x={290} y={218} para={[170, 193]} />
        <RotuloTermo k="cylinder wall" x={290} y={258} para={[254, 258]} />
        <RotuloTermo k="piston" x={100} y={236} anchor="middle" />
      </svg>
      {caption && <figcaption className={styles.caption}><LegendaLivro texto={caption} /></figcaption>}
    </figure>
  );
}

function Oleo({caption}) {
  const W = 460;
  const H = 316;
  const parede = 230;
  const pist = 220;
  return (
    <figure className={styles.figure}>
      <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label={caption}>
        <Parede x={parede} y={20} w={36} h={270} id="po" />
        {/* película de óleo na parede: fina em cima (já raspada), grossa embaixo */}
        <path className={styles.oleo} d={`M ${parede} 30 H ${parede - 1.5} V 150 H ${parede} Z`} />
        <path className={styles.oleo} d={`M ${parede} 196 H ${parede - 6} V 290 H ${parede} Z`} />
        {/* pistão com a canaleta do anel de óleo */}
        <path className={styles.pistao} fillRule="evenodd" d={`M 40 30 H ${pist} V 260 H 40 Z M 166 150 H ${pist} V 196 H 166 Z`} />
        {/* anel de óleo: dois lábios raspadores e o vão no meio */}
        <path className={styles.anelOleo} d={`M 174 152 H ${parede} V 162 H 192 V 184 H ${parede} V 194 H 174 Z`} />
        {/* óleo raspado: entra no vão do anel e desce por um furo do pistão */}
        <path className={styles.oleo} d={`M 192 162 H ${parede - 1} V 184 H 192 Z`} />
        <line x1={156} y1={164} x2={156} y2={196} className={styles.furo} />
        <Seta de={[222, 173]} para={[176, 173]} cls={styles.oleoSeta} />
        <Seta de={[156, 173]} para={[156, 244]} cls={styles.oleoSeta} />
        <Seta de={[70, 60]} para={[70, 120]} cls={styles.movimento} />
        <RotuloTermo texto={'pistão\ndescendo'} x={84} y={80} />
        <RotuloTermo texto={'óleo raspado\nvolta ao cárter'} x={110} y={276} anchor="middle" tone={1} />
        <RotuloTermo k="cylinder wall" x={290} y={60} para={[254, 60]} />
        <RotuloTermo k="oil ring" x={290} y={150} para={[204, 157]} />
        <RotuloTermo k="oil film" x={290} y={240} para={[parede - 3, 240]} />
      </svg>
      {caption && <figcaption className={styles.caption}><LegendaLivro texto={caption} /></figcaption>}
    </figure>
  );
}

export default function Pistao({modo = 'conjunto', caption}) {
  if (modo === 'compressao') return <Compressao caption={caption} />;
  if (modo === 'oleo') return <Oleo caption={caption} />;
  return <Conjunto caption={caption} />;
}
