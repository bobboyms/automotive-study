import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import styles from './styles.module.css';
import LegendaLivro from '../LegendaLivro';

// O trem de força visto de cima, frente do carro para cima.
//
//   tipo="traseira"   motor na frente, tração traseira: motor → embreagem →
//                     câmbio → eixo cardã → diferencial → semieixos → rodas
//                     de trás
//   tipo="dianteira"  motor na frente, deitado, tração dianteira: motor →
//                     transeixo (câmbio e diferencial juntos) → semieixos →
//                     rodas da frente; atrás, um eixo não motriz
//
// Tom 2 (laranja): o caminho da força, do motor até as rodas motrizes.

function Roda({x, y, motriz}) {
  return <rect className={motriz ? styles.rodaMotriz : styles.roda} x={x - 14} y={y - 30} width={28} height={60} rx={6} />;
}

function Giro({x, y}) {
  return <path className={styles.giro} d={`M ${x - 7} ${y - 12} A 12 12 0 1 0 ${x + 7} ${y - 12}`} />;
}

export default function TremDeForca({tipo = 'traseira', caption}) {
  const W = 460;
  const H = 440;
  const RE = 90; // x das rodas da esquerda
  const RD = 310; // x das rodas da direita
  const FY = 90; // y do eixo da frente
  const TY = 370; // y do eixo de trás
  const X = 200;
  return (
    <figure className={styles.figure}>
      <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label={caption}>
        <text x={20} y={26} className={styles.frente}>↑ frente do carro</text>
        {tipo === 'traseira' ? (
          <g>
            {/* frente: rodas que só esterçam */}
            <line className={styles.fino} x1={RE} y1={FY} x2={RD} y2={FY} />
            <Roda x={RE} y={FY} />
            <Roda x={RD} y={FY} />
            {/* motor, embreagem, câmbio */}
            <rect className={styles.motor} x={X - 45} y={44} width={90} height={92} rx={6} />
            <rect className={styles.peca} x={X - 32} y={140} width={64} height={16} rx={3} />
            <path className={styles.peca} d={`M ${X - 30} 160 H ${X + 30} L ${X + 16} 226 H ${X - 16} Z`} />
            {/* eixo cardã, diferencial, semieixos */}
            <line className={styles.forcaGrossa} x1={X} y1={228} x2={X} y2={TY - 22} />
            <rect className={styles.difer} x={X - 22} y={TY - 22} width={44} height={44} rx={8} />
            <line className={styles.forca} x1={RE + 14} y1={TY} x2={X - 22} y2={TY} />
            <line className={styles.forca} x1={X + 22} y1={TY} x2={RD - 14} y2={TY} />
            <Roda x={RE} y={TY} motriz />
            <Roda x={RD} y={TY} motriz />
            <Giro x={X} y={290} />
            <RotuloTermo k="engine" x={350} y={70} para={[X + 45, 70]} />
            <RotuloTermo k="clutch" x={350} y={128} para={[X + 32, 148]} />
            <RotuloTermo k="manual transmission" texto={'manual\ntransmission'} x={350} y={180} para={[X + 24, 192]} />
            <RotuloTermo k="drive shaft" x={350} y={262} para={[X + 3, 262]} />
            <RotuloTermo k="differential" x={350} y={322} para={[X + 18, TY - 18]} />
            <RotuloTermo k="drive axle" x={150} y={424} anchor="middle" para={[150, TY + 3]} />
          </g>
        ) : (
          <g>
            {/* frente: motor deitado, embreagem e transeixo; os semieixos
                passam embaixo do motor até as rodas */}
            <rect className={styles.motor} x={175} y={40} width={106} height={66} rx={6} />
            <rect className={styles.peca} x={160} y={46} width={12} height={54} rx={3} />
            <path className={styles.peca} d="M 157 42 V 112 H 112 V 58 Z" />
            <rect className={styles.difer} x={120} y={FY + 22} width={32} height={32} rx={6} />
            <line className={styles.forca} x1={RE + 14} y1={FY + 38} x2={120} y2={FY + 38} />
            <line className={styles.forca} x1={152} y1={FY + 38} x2={RD - 14} y2={FY + 38} />
            <Roda x={RE} y={FY + 38} motriz />
            <Roda x={RD} y={FY + 38} motriz />
            {/* trás: eixo não motriz */}
            <line className={styles.fino} x1={RE} y1={TY} x2={RD} y2={TY} />
            <Roda x={RE} y={TY} />
            <Roda x={RD} y={TY} />
            <RotuloTermo k="engine" x={350} y={62} para={[281, 62]} />
            <RotuloTermo k="clutch" x={166} y={20} anchor="middle" para={[166, 46]} />
            <RotuloTermo k="transaxle" x={20} y={66} anchor="start" para={[118, 70]} de={[92, 66]} />
            <RotuloTermo k="differential" x={110} y={226} anchor="start" para={[136, FY + 54]} de={[122, 212]} />
            <RotuloTermo k="drive axle" x={350} y={186} para={[230, FY + 39]} />
            <RotuloTermo k="dead axle" x={200} y={424} anchor="middle" para={[200, TY + 1]} />
          </g>
        )}
      </svg>
      {caption && <figcaption className={styles.caption}><LegendaLivro texto={caption} /></figcaption>}
    </figure>
  );
}
