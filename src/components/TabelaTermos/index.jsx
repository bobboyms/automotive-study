import React from 'react';
import Link from '@docusaurus/Link';
import dicionario from '@site/src/data/termos.json';

// Glossário gerado do dicionário src/data/termos.json: inglês primeiro, em
// ordem alfabética, com o português, a definição e a lição em que o termo é
// ensinado. Um termo novo no dicionário aparece aqui sozinho.
export default function TabelaTermos() {
  const termos = [...dicionario.termos].sort((a, b) =>
    a.en.localeCompare(b.en, 'en', {sensitivity: 'base'}),
  );
  return (
    <table>
      <thead>
        <tr>
          <th>Inglês</th>
          <th>Português</th>
          <th>O que é</th>
          <th>Lição</th>
        </tr>
      </thead>
      <tbody>
        {termos.map((t) => (
          <tr key={t.en}>
            <td>
              <em>{t.en}</em>
              {t.var?.length ? <> ({t.var.join(', ')})</> : null}
            </td>
            <td>{t.pt}</td>
            <td>{t.def}</td>
            <td>
              <Link to={`/${dicionario.base}${t.licao}`}>{dicionario.licoes[t.licao]}</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
