import React from 'react';
import SvgMath from '../diagramas/SvgMath';
import styles from '../Simbolos/styles.module.css';

// O resistor de quatro bands visto de perto: por qual ponta se começa a ler,
// em que ordem as bands entram na conta e por que a band da tolerance fica
// separada das outras três.
//
// As bands são desenhadas sem cor de propósito. A cor é o conteúdo da tabela
// da lição, e três tons são o limite dos diagramas da casa (README, seção
// "Cores"); um desenho com dez cores também deixaria de fora quem não
// distingue vermelho de marrom — que é justamente quem mais precisa do
// ohmmeter. Aqui a figura ensina a posição; a tabela ensina o valor da cor.

const W = 460;
const H = 196;

const Y_FIO = 92; // altura dos terminais
const CORPO = {x: 118, y: 62, w: 224, h: 60, r: 12};
// x da borda esquerda de cada band. As três primeiras ficam a 34 de
// distância: com 30, os selos de r = 11 se encostavam no celular.
const BANDS = [142, 176, 210, 300];
const LARGURA_BAND = 13;

// A fonte cresce com a largura do desenho: no celular a figura cai para cerca
// de 358 px, e 15 aqui sai com 11,7 px lá (o mínimo da casa é 10).
const FONTE = 15;

export default function CodigoCores({caption}) {
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={
          caption ||
          'Resistor de quatro bands: as três primeiras juntas numa ponta e a band da tolerance separada na outra.'
        }
      >
        {/* terminais */}
        <g className={styles.fio}>
          <line x1={20} y1={Y_FIO} x2={CORPO.x} y2={Y_FIO} />
          <line x1={CORPO.x + CORPO.w} y1={Y_FIO} x2={440} y2={Y_FIO} />
        </g>

        {/* corpo do resistor */}
        <rect
          className={styles.metal}
          x={CORPO.x}
          y={CORPO.y}
          width={CORPO.w}
          height={CORPO.h}
          rx={CORPO.r}
        />

        {/* as quatro bands */}
        {BANDS.map((x) => (
          <rect
            key={x}
            className={styles.cheio}
            x={x}
            y={CORPO.y}
            width={LARGURA_BAND}
            height={CORPO.h}
          />
        ))}

        {/* o número de cada band */}
        {BANDS.map((x, i) => {
          const cx = x + LARGURA_BAND / 2;
          return (
            <g key={`selo${x}`}>
              <circle className={styles.parte} cx={cx} cy={34} r={11} />
              <SvgMath x={cx} y={39} math={`${i + 1}`} fontSize={FONTE} />
            </g>
          );
        })}

        {/* por onde se começa a ler: seta reta para cima, igual à da
            tolerance, apontando a primeira band */}
        <g className={styles.fino}>
          <path d="M 148 152 L 148 130" />
          <path d="M 148 130 L 143 139 M 148 130 L 153 139" />
        </g>
        <SvgMath x={148} y={172} math="\text{comece aqui}" fontSize={FONTE} />

        {/* a band que fica separada */}
        <g className={styles.fino}>
          <path d="M 306 152 L 306 130" />
          <path d="M 306 130 L 301 139 M 306 130 L 311 139" />
        </g>
        <SvgMath x={306} y={172} math="\text{tolerance}" fontSize={FONTE} />
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
