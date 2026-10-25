import React from 'react';
import Termo from '../Termo';
import CATALOGO from './catalogo';
import {SimboloSolto} from './desenhos';
import styles from './styles.module.css';

// Tabela de símbolos: um cartão por símbolo, com o desenho, o nome em inglês
// (clicável, como os termos do texto) e uma nota curta em português.
//
//   <TabelaSimbolos itens={['bateria', 'fusivelS', 'fusivelEuro']} caption="..." />
//
// Os nomes dos símbolos estão em `catalogo.js`; os desenhos, em
// `desenhos.jsx`.

export function Nome({partes}) {
  return (
    <>
      {partes.map((p, i) =>
        typeof p === 'string' ? (
          <React.Fragment key={i}>{p}</React.Fragment>
        ) : (
          <Termo key={i} k={p[0]}>
            {p[1]}
          </Termo>
        ),
      )}
    </>
  );
}

export function texto(partes) {
  return partes.map((p) => (typeof p === 'string' ? p : p[1])).join('');
}

export default function TabelaSimbolos({itens, caption}) {
  return (
    <figure className={styles.figure}>
      <ul className={styles.grade}>
        {itens.map((tipo) => {
          const c = CATALOGO[tipo];
          if (!c) throw new Error(`TabelaSimbolos: "${tipo}" não está no catálogo`);
          return (
            <li key={tipo} className={styles.cartao}>
              <SimboloSolto tipo={tipo} className={styles.cartaoSvg} rotulo={texto(c.nome)} />
              <span className={styles.nome}>
                <Nome partes={c.nome} />
              </span>
              <span className={styles.nota}>{c.nota}</span>
            </li>
          );
        })}
      </ul>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
