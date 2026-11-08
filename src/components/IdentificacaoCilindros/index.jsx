import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import {Figura, styles} from '../diagramas/util';

// Vista de cima do engine V6 do Ford Edge 3.5L, redesenhada a partir da figura
// "Engine Cylinder Identification" do service manual (303-01C): um bank com os
// cylinders 1-2-3 e o outro com 4-5-6. Os bores vizinhos se tocam.
// Tom 2 (laranja): os cylinders destacados em `destaque` (a queixa da lição).
//
//   destaque   lista de números de cylinder a pintar (padrão: nenhum)
//   caption    legenda da figura
export default function IdentificacaoCilindros({destaque = [], caption}) {
  const W = 480;
  const H = 330;
  const r = 32;
  const ys = [105, 168, 231]; // centros dos bores: passo de 63, menor que 2r = 64
  const bancos = [
    {x: 170, nums: [4, 5, 6]},
    {x: 310, nums: [1, 2, 3]},
  ];
  return (
    <Figura W={W} H={H} caption={caption}>
      {/* o engine visto de cima */}
      <rect className={styles.bloco} x={110} y={40} width={260} height={250} rx={6} />
      {/* o vale entre os dois banks */}
      <rect className={styles.metal} x={225} y={50} width={30} height={230} />

      {bancos.map((b) =>
        b.nums.map((n, i) => (
          <g key={n}>
            <circle
              className={destaque.includes(n) ? styles.preenche2 : styles.vazio}
              cx={b.x}
              cy={ys[i]}
              r={r}
            />
            <RotuloTermo
              texto={String(n)}
              x={b.x}
              y={ys[i]}
              anchor="middle"
              fs={22}
            />
          </g>
        )),
      )}

      {/* o ponto onde dois bores vizinhos se encontram: a head gasket veda aqui */}
      <RotuloTermo
        k="head gasket"
        texto={'head\ngasket'}
        x={98}
        y={190}
        anchor="end"
        para={[170 - 2, 199.5]}
      />

      <RotuloTermo texto="vale" x={240} y={305} anchor="middle" />
    </Figura>
  );
}
