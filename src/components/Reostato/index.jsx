import React, {useState} from 'react';
import Esquema from '../Esquema';
import styles from '../Simbolos/styles.module.css';

// Dimmer de painel com um variable resistor (rheostat) em série com a bulb.
// O controle deslizante move o wiper: a resistance do rheostat muda, e com
// ela a current e o brilho da bulb. Mexer no controle é a ideia da lição —
// por isso este desenho é interativo.
//
// Valores ilustrativos: battery de 12 V, bulb de 6 Ω (sempre a mesma, para a
// conta ficar clara; a bulb de verdade muda de resistance com a temperatura),
// rheostat de 0 a 18 Ω.

const V = 12;
const R_BULB = 6;
const R_MAX = 18;

// 2.00 -> 2, 0.80 -> 0.8; sem casas decimais, o número fica como está
const fmt = (n, casas) => {
  const s = n.toFixed(casas);
  return s.includes('.') ? s.replace(/\.?0+$/, '') : s;
};

export default function Reostato({caption}) {
  const [passo, setPasso] = useState(0); // 0 a 6, de 3 em 3 Ω
  const rv = passo * 3;
  const i = V / (R_BULB + rv);
  const p = i * i * R_BULB;
  const pMax = (V * V) / R_BULB;
  return (
    <div>
      <Esquema
        pecas={[
          {
            tipo: 'variavel',
            rotulo: '\\text{rheostat}',
            nota: `${fmt(rv, 0)}\\,\\Omega`,
          },
        ]}
        carga={{
          tipo: 'lampada',
          rotulo: '\\text{bulb}',
          nota: `${fmt(p, 2)}\\,\\text{W}`,
          brilho: p / pMax,
        }}
        corrente
        rotuloCorrente={`I = ${fmt(i, 2)}\\,\\text{A}`}
        caption={caption}
      />
      <label className={styles.controle} style={{margin: '0 auto 1.5rem'}}>
        <span>
          Resistance do rheostat: <strong>{rv} Ω</strong> · current:{' '}
          <strong>{fmt(i, 2)} A</strong> · power da bulb: <strong>{fmt(p, 2)} W</strong>
        </span>
        <input
          type="range"
          min={0}
          max={R_MAX / 3}
          step={1}
          value={passo}
          onChange={(e) => setPasso(Number(e.target.value))}
          aria-label="Resistance do rheostat"
        />
      </label>
    </div>
  );
}
