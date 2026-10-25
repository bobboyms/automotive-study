import React from 'react';
import styles from './styles.module.css';

// Desenho de cada peça, os mesmos símbolos do `Circuito`. Cada peça ocupa um
// trecho da grade, de `a` até `b`, e é desenhada deitada, de x = 0 a x = S, e
// depois girada para a direção de a → b. Na battery, `a` é o positivo.

export const S = 60; // distância entre dois pontos da grade

// posição do ponto (i, j) da grade
export const M = 30;
export const px = ([i, j]) => [M + i * S, M + j * S];

const C = S / 2;

function Battery() {
  return (
    <g>
      <line className={styles.fio} x1={0} y1={0} x2={C - 6} y2={0} />
      <line className={styles.fio} x1={C + 6} y1={0} x2={S} y2={0} />
      {/* placa longa é o +, placa curta e grossa é o − */}
      <line className={styles.placa} x1={C - 6} y1={-18} x2={C - 6} y2={18} />
      <line className={styles.placaCurta} x1={C + 6} y1={-10} x2={C + 6} y2={10} />
    </g>
  );
}

function Bulb({brilho = 0, queimada = false}) {
  const acesa = !queimada && brilho > 0.02;
  const b = Math.min(brilho, 1);
  return (
    <g>
      <line className={styles.fio} x1={0} y1={0} x2={C - 16} y2={0} />
      <line className={styles.fio} x1={C + 16} y1={0} x2={S} y2={0} />
      {acesa &&
        [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((g) => {
          const r = (g * Math.PI) / 180;
          const fim = 21 + 7 * b;
          return (
            <line
              key={g}
              className={styles.raio}
              x1={C + 20 * Math.cos(r)}
              y1={20 * Math.sin(r)}
              x2={C + fim * Math.cos(r)}
              y2={fim * Math.sin(r)}
            />
          );
        })}
      <circle
        className={styles.lampada}
        cx={C}
        cy={0}
        r={16}
        style={{fillOpacity: acesa ? 0.12 + 0.78 * b : 0}}
      />
      {queimada ? (
        // filamento partido: as duas metades do X não se encontram
        <g className={styles.defeito}>
          <line x1={C - 11} y1={-11} x2={C - 4} y2={-4} />
          <line x1={C + 11} y1={11} x2={C + 4} y2={4} />
          <line x1={C + 11} y1={-11} x2={C + 4} y2={-4} />
          <line x1={C - 11} y1={11} x2={C - 4} y2={4} />
        </g>
      ) : (
        // com a bulb bem acesa, o fundo laranja apagaria o X laranja: o
        // filamento passa para a cor do papel
        <g className={acesa && b > 0.45 ? styles.cargaAcesa : styles.carga}>
          <line x1={C - 11} y1={-11} x2={C + 11} y2={11} />
          <line x1={C + 11} y1={-11} x2={C - 11} y2={11} />
        </g>
      )}
    </g>
  );
}

function Switch({aberto = false}) {
  return (
    <g>
      <line className={styles.fio} x1={0} y1={0} x2={C - 15} y2={0} />
      <line className={styles.fio} x1={C + 15} y1={0} x2={S} y2={0} />
      {aberto ? (
        <line className={styles.fio} x1={C - 15} y1={0} x2={C + 11} y2={-17} />
      ) : (
        <line className={styles.fio} x1={C - 15} y1={0} x2={C + 15} y2={0} />
      )}
      <circle className={styles.contato} cx={C - 15} cy={0} r={3} />
      <circle className={styles.contato} cx={C + 15} cy={0} r={3} />
    </g>
  );
}

function Fuse({queimado = false}) {
  return (
    <g>
      <line className={styles.fio} x1={0} y1={0} x2={C - 17} y2={0} />
      <line className={styles.fio} x1={C + 17} y1={0} x2={S} y2={0} />
      <rect className={styles.parte} x={C - 17} y={-8} width={34} height={16} rx={3} />
      {queimado ? (
        // o elemento derreteu no meio
        <g className={styles.defeito}>
          <path d={`M ${C - 17} 0 C ${C - 12} -6, ${C - 8} -6, ${C - 4} -3`} />
          <path d={`M ${C + 17} 0 C ${C + 12} 6, ${C + 8} 6, ${C + 4} 3`} />
        </g>
      ) : (
        <path
          className={styles.fioFino}
          d={`M ${C - 17} 0 C ${C - 6} -9, ${C + 6} 9, ${C + 17} 0`}
        />
      )}
    </g>
  );
}

function Wire() {
  return <line className={styles.fio} x1={0} y1={0} x2={S} y2={0} />;
}

const DESENHO = {battery: Battery, bulb: Bulb, switch: Switch, fuse: Fuse, wire: Wire};

// Ângulo de a → b, em graus.
export function angulo(a, b) {
  return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
}

export default function Simbolo({peca, brilho, origem}) {
  const Desenho = DESENHO[peca.tipo];
  const [x, y] = origem ?? px(peca.a);
  const g = angulo(peca.a, peca.b);
  return (
    <g>
      <g transform={`translate(${x} ${y}) rotate(${g})`}>
        <Desenho
          brilho={brilho}
          aberto={peca.aberto}
          queimado={Boolean(peca.queimado)}
          queimada={Boolean(peca.queimado)}
        />
      </g>
      {peca.tipo === 'battery' && <Polos peca={peca} x={x} y={y} />}
    </g>
  );
}

// Os sinais + e − ficam fora da rotação, para não saírem de lado ou de cabeça
// para baixo. Vão do lado de cima da battery deitada e do lado esquerdo da
// battery em pé.
function Polos({peca, x, y}) {
  const u = [Math.sign(peca.b[0] - peca.a[0]), Math.sign(peca.b[1] - peca.a[1])];
  const n = u[0] !== 0 ? [0, -1] : [-1, 0];
  const lado = 27;
  const ponto = (ao) => [x + u[0] * ao + n[0] * lado, y + u[1] * ao + n[1] * lado];
  const [mx, my] = ponto(C - 12);
  const [nx, ny] = ponto(C + 12);
  return (
    <g className={styles.polo}>
      <text x={mx} y={my + 5} textAnchor="middle">
        +
      </text>
      <text x={nx} y={ny + 5} textAnchor="middle">
        −
      </text>
    </g>
  );
}
