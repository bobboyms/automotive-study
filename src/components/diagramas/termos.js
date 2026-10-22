import dicionario from '@site/src/data/termos.json';

// Acha a chave de um termo do dicionário a partir do texto de um rótulo de
// figura: “fuse”, “Fuses” e “bulb” devolvem “fuse”, “fuse” e “bulb”; o que
// não é termo devolve undefined. As mesmas formas que o plugin
// `src/plugins/remark-termos.js` reconhece no texto: `en`, `var` e o plural.

function plurais(forma) {
  if (/^[A-Z0-9+]+$/.test(forma)) return [forma];
  const m = /^(.*?)([A-Za-z]+)$/.exec(forma);
  if (!m) return [forma];
  const [, antes, ultima] = m;
  let p;
  if (/[^aeiou]y$/i.test(ultima)) p = ultima.slice(0, -1) + 'ies';
  else if (/(s|x|z|ch|sh)$/i.test(ultima)) p = ultima + 'es';
  else p = ultima + 's';
  return [forma, antes + p];
}

const indice = new Map();
for (const t of dicionario.termos) {
  for (const forma of [t.en, ...(t.var || [])]) {
    for (const f of plurais(forma)) indice.set(f.toLowerCase(), t.en);
  }
}

export default function chaveDoTermo(texto) {
  return indice.get(String(texto).trim().toLowerCase());
}
