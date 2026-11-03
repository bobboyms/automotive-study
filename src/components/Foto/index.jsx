import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import dados from '@site/src/data/fotos.json';
import styles from './styles.module.css';

// Foto de licença livre numa lição.
//
//   <Foto k="terminal-corroido" caption="..." />
//
// `k` é a chave em src/data/fotos.json, que guarda o arquivo, o texto
// alternativo, as medidas e o crédito. O crédito é montado aqui e sai
// embaixo da legenda: nenhuma lição escreve autor e licença à mão, e por
// isso nenhuma esquece.
//
// Por que foto, se o resto do material é SVG: desenho ensina estrutura,
// caminho e ordem; foto ensina a reconhecer pela aparência. Crosta de
// corrosion, case estufado e plate sulfatada são reconhecimento visual, e
// o aluno precisa identificá-los no pátio.

export default function Foto({k, caption, largura}) {
  const f = dados.fotos[k];
  if (!f) throw new Error(`Foto: "${k}" não está em src/data/fotos.json`);
  const src = useBaseUrl(f.arquivo);
  return (
    <figure className={styles.figure}>
      <img
        className={styles.img}
        src={src}
        alt={f.alt}
        width={f.w}
        height={f.h}
        loading="lazy"
        style={{maxWidth: `${largura || f.maxw}px`}}
      />
      <figcaption className={styles.caption}>
        {caption}
        <span className={styles.credito}>
          Foto de <a href={f.fonte} target="_blank" rel="noopener noreferrer">{f.autor}</a>
          {', '}{f.origem || 'Wikimedia Commons'} ·{' '}
          <a href={f.licencaUrl} target="_blank" rel="noopener noreferrer">{f.licenca}</a>
          {f.alterada ? ` · ${f.alterada}` : ''}
        </span>
      </figcaption>
    </figure>
  );
}
