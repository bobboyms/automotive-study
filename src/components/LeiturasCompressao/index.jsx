import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import {Figura, styles} from '../diagramas/util';

// Gráfico de barras das leituras de um compression test, uma barra por cylinder,
// com a linha do limite do manual: 75 % da maior leitura.
// Tom 1 (azul): cylinder dentro do limite. Tom 2 (laranja): cylinder abaixo.
//
//   leituras   lista de pressões em psi, na ordem dos cylinders (1, 2, 3...)
//   caption    legenda da figura
export default function LeiturasCompressao({leituras, caption}) {
  const W = 520;
  const H = 340;
  const x0 = 70; // início da área das barras
  const x1 = 505; // fim da área das barras
  const base = 270; // y do zero
  const escala = 1.15; // px por psi (200 psi = 230 px)
  const n = leituras.length;
  const slot = (x1 - x0) / n;
  const larg = 44;
  const maior = Math.max(...leituras);
  const limite = 0.75 * maior;
  const yLimite = base - limite * escala;
  const fmt = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

  return (
    <Figura W={W} H={H} caption={caption}>
      {/* eixo vertical e horizontal */}
      <line className={styles.linha} x1={x0} y1={base - 200 * escala} x2={x0} y2={base} />
      <line className={styles.linha} x1={x0} y1={base} x2={x1} y2={base} />

      {/* marcas de 0, 100 e 200 psi */}
      {[0, 100, 200].map((v) => (
        <g key={v}>
          <line className={styles.linha} x1={x0 - 5} y1={base - v * escala} x2={x0} y2={base - v * escala} />
          <RotuloTermo texto={String(v)} x={x0 - 10} y={base - v * escala} anchor="end" />
        </g>
      ))}
      <RotuloTermo texto="psi" x={x0 - 10} y={base - 200 * escala - 20} anchor="end" />

      {/* barras */}
      {leituras.map((v, i) => {
        const cx = x0 + slot * (i + 0.5);
        const abaixo = v < limite;
        const h = v * escala;
        return (
          <g key={i}>
            <rect
              className={abaixo ? styles.preenche2 : styles.preenche1}
              x={cx - larg / 2}
              y={base - h}
              width={larg}
              height={h}
            />
            <RotuloTermo
              texto={String(v)}
              x={cx}
              y={base - h - 12}
              anchor="middle"
              tone={abaixo ? 2 : 1}
            />
            <RotuloTermo texto={String(i + 1)} x={cx} y={base + 20} anchor="middle" />
          </g>
        );
      })}
      <RotuloTermo k="cylinder" x={(x0 + x1) / 2} y={base + 46} anchor="middle" />

      {/* linha do limite: 75 % da maior leitura */}
      <line className={styles.tracejada} x1={x0} y1={yLimite} x2={x1} y2={yLimite} />
      <RotuloTermo
        texto={`limite:\n75 % da maior\n= ${fmt(limite)} psi`}
        x={x1}
        y={yLimite - 62}
        anchor="end"
      />
    </Figura>
  );
}
