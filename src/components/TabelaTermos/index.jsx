import React from 'react';
import Link from '@docusaurus/Link';
import dicionario from '@site/src/data/termos.json';

// Glossário gerado do dicionário src/data/termos.json: inglês primeiro, em
// ordem alfabética, com o português, a definição e a lição em que o termo é
// ensinado. Um termo novo no dicionário aparece aqui sozinho.
//
//   curso  começo do caminho das lições (`'trn-120-eletricidade/'`): mostra só
//          os termos ensinados nessa disciplina. Sem ele, todos.
export default function TabelaTermos({curso = ''}) {
  const termos = dicionario.termos
    .filter((t) => dicionario.licoes[t.licao].url.startsWith(curso))
    .sort((a, b) => a.en.localeCompare(b.en, 'en', {sensitivity: 'base'}));
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
              <Link to={`/${dicionario.licoes[t.licao].url}`}>{dicionario.licoes[t.licao].titulo}</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
