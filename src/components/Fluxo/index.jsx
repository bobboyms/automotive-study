import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import LegendaLivro from '../LegendaLivro';

// Caminho de um sistema em blocos: de onde a coisa sai, por onde passa e
// aonde chega — o líquido de arrefecimento, o óleo, a corrente da partida, o
// sinal de um sensor. Cada bloco traz o nome da peça em inglês (clicável,
// como no texto) e, embaixo, o que acontece ali, em português.
//
// É HTML, não SVG: com muitos blocos, a fila vira coluna no celular em vez de
// encolher o texto.
//
//   etapas   [{k, texto, nota, tone}] — k é a chave em src/data/termos.json
//   volta    texto da seta de volta ao começo (circuito fechado), opcional
//   caption  legenda, texto simples
export default function Fluxo({etapas, volta, caption}) {
  const coluna = etapas.length > 4;
  return (
    <figure className={styles.figure}>
      <div className={clsx(styles.fila, coluna && styles.coluna)}>
        {etapas.map((e, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div className={styles.seta} aria-hidden="true">
                <span className={styles.direita}>→</span>
                <span className={styles.baixo}>↓</span>
              </div>
            )}
            <div className={clsx(styles.bloco, e.tone && styles[`tom${e.tone}`])}>
              {e.k ? (
                <button type="button" className={styles.nome} data-termo={e.k}>
                  {e.texto ?? e.k}
                </button>
              ) : (
                <span className={styles.nomeSimples}>{e.texto}</span>
              )}
              {e.nota && <span className={styles.nota}>{e.nota}</span>}
            </div>
          </React.Fragment>
        ))}
      </div>
      {volta && <div className={styles.volta}>↺ {volta}</div>}
      {caption && <figcaption className={styles.caption}><LegendaLivro texto={caption} /></figcaption>}
    </figure>
  );
}
