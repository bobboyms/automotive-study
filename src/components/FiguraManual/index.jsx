import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

// Figura do service manual do Ford Edge, copiada para estudo.
//
//   <FiguraManual id="E200473" alt="..." caption="..." />
//
// `id` é o número no canto da figura no manual (E200473) e também o nome do
// arquivo em static/img/manual-edge/. A legenda diz o que a figura mostra; o
// crédito sai sozinho embaixo, então nenhuma lição esquece de citar a fonte.
export default function FiguraManual({id, alt, caption, largura = 560}) {
  const src = useBaseUrl(`/img/manual-edge/${id}.jpg`);
  return (
    <figure className={styles.figure}>
      <img className={styles.img} src={src} alt={alt} style={{maxWidth: `${largura}px`}} />
      <figcaption className={styles.caption}>
        <strong>Figura {id} do manual.</strong> {caption}
        <span className={styles.credito}>Ford Edge, Workshop Manual (Ford Motor Company), copiada para estudo.</span>
      </figcaption>
    </figure>
  );
}
