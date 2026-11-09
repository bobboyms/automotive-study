import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

// Figura do service manual do Ford Edge, copiada para estudo.
//
//   <FiguraManual id="E200473" alt="..." caption="..." />
//   <FiguraManual id="wd-044-002-rele" titulo="Wiring diagram, célula 44, página 2." alt="..." caption="..." />
//
// `id` é o número no canto da figura no manual (E200473) e também o nome do
// arquivo em static/img/manual-edge/. As páginas do wiring diagram não têm
// esse número: o arquivo começa com `wd-` e `titulo` diz de onde a página
// veio. A legenda diz o que a figura mostra; o crédito sai sozinho embaixo,
// então nenhuma lição esquece de citar a fonte. Tocar na figura abre o
// arquivo em tamanho cheio, para dar zoom no celular.
export default function FiguraManual({id, titulo, alt, caption, largura = 560}) {
  const src = useBaseUrl(`/img/manual-edge/${id}.jpg`);
  return (
    <figure className={styles.figure}>
      <a href={src} target="_blank" rel="noopener noreferrer" className={styles.link} style={{maxWidth: `${largura}px`}}>
        <img className={styles.img} src={src} alt={alt} />
      </a>
      <figcaption className={styles.caption}>
        <strong>{titulo || `Figura ${id} do manual.`}</strong> {caption}
        <span className={styles.credito}>Ford Edge, Workshop Manual (Ford Motor Company), copiada para estudo. Toque na figura para ampliar.</span>
      </figcaption>
    </figure>
  );
}
