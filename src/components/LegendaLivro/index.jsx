import React, {useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {partes} from '@site/src/plugins/figuras-livro';

// Figura do livro salva pelo aluno em material/livro/<numero>.png. Só existe
// no servidor local; se o arquivo não estiver lá, não aparece nada.
function ImagemLocal({numero}) {
  const [falhou, setFalhou] = useState(false);
  const src = useBaseUrl(`/livro/${numero}.png`);
  if (falhou) return null;
  return (
    <img
      src={src}
      alt={`Figura ${numero} do livro (cópia local do aluno)`}
      onError={() => setFalhou(true)}
      style={{display: 'block', margin: '0.8rem auto 0', maxWidth: '100%', borderRadius: 6}}
    />
  );
}

// Texto de legenda em que “Figura 1-13 do livro” vira link para a figura no
// livro do aluno (VitalSource). Usado no <figcaption> dos desenhos da AUT-116.
// No servidor local, mostra também as figuras que o aluno salvou em
// material/livro/ — o site publicado nunca as tem.
export default function LegendaLivro({texto}) {
  const {siteConfig} = useDocusaurusContext();
  const numeros = siteConfig.customFields?.figurasLocais
    ? [...new Set(partes(String(texto)).filter((p) => p.url).map((p) => p.texto.replace(/^Figuras? /, '').replace(/[A-D]$/, '')))]
    : [];
  return (
    <>
      {partes(String(texto)).map((p, i) =>
        p.url ? (
          <a
            key={i}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Abre a figura no seu livro, no VitalSource (precisa estar logado)"
          >
            {p.texto}
          </a>
        ) : (
          <React.Fragment key={i}>{p.texto}</React.Fragment>
        ),
      )}
      {numeros.map((n) => (
        <ImagemLocal key={n} numero={n} />
      ))}
    </>
  );
}
