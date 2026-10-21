import React from 'react';
import styles from './styles.module.css';

// Termo técnico em inglês, clicável. Quem mostra o português é o balão de
// `src/theme/Root.js`, que escuta o clique em qualquer elemento com
// `data-termo` — no texto (este botão) ou no rótulo de uma figura.
//
// Nas lições, ninguém escreve <Termo> à mão: o plugin
// `src/plugins/remark-termos.js` faz isso com os termos do dicionário.
export default function Termo({k, children}) {
  return (
    <button type="button" className={styles.termo} data-termo={k}>
      {children}
    </button>
  );
}
