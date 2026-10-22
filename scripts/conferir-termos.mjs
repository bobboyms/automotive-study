#!/usr/bin/env node
// Confere o dicionário de termos (src/data/termos.json):
// - toda `licao` aponta para uma lição que existe em docs/;
// - lista, por lição da TRN-120 e da AUT-116, quantos termos do dicionário o
//   texto usa e quais termos do dicionário nenhuma lição usa (candidatos a
//   revisão; os de física ficam em português no texto e aparecem aqui).
//
// Uso: node scripts/conferir-termos.mjs

import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dic = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/termos.json'), 'utf8'));
const {indice, siglas} = require('../src/plugins/remark-termos.js');

const arquivos = ['trn-120-eletricidade', 'aut-116-motor'].flatMap((pasta) =>
  fs
    .readdirSync(path.join(ROOT, 'docs', pasta), {recursive: true})
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => path.join(ROOT, 'docs', pasta, f)),
);
// url de cada página: caminho sem docs/, sem prefixo numérico e sem extensão
const urls = new Set(
  arquivos.map((f) =>
    path
      .relative(path.join(ROOT, 'docs'), f)
      .replace(/\.mdx?$/, '')
      .split(path.sep)
      .map((p) => p.replace(/^\d+-/, ''))
      .join('/')
      // o index.md de uma pasta é a URL da pasta, com a barra no fim
      .replace(/index$/, ''),
  ),
);

let erros = 0;
for (const [chave, {url}] of Object.entries(dic.licoes)) {
  if (!urls.has(url)) {
    console.log(`lição "${chave}": a página ${url} não existe em docs/`);
    erros++;
  }
}
for (const t of dic.termos) {
  if (!dic.licoes[t.licao]) {
    console.log(`termo "${t.en}": a lição "${t.licao}" não está em licoes`);
    erros++;
  }
}

const usados = new Set();
const {RE} = require('../src/plugins/remark-termos.js');
for (const f of arquivos) {
  const texto = fs.readFileSync(f, 'utf8');
  const aqui = new Set();
  for (const m of texto.matchAll(RE)) {
    if (siglas.has(m[0].toUpperCase()) && m[0] !== m[0].toUpperCase()) continue;
    aqui.add(indice.get(m[0].replace(/\s+/g, ' ').toLowerCase()));
  }
  aqui.forEach((t) => usados.add(t));
  console.log(`${path.relative(ROOT, f)}: ${aqui.size} termos`);
}
const sobra = dic.termos.map((t) => t.en).filter((t) => !usados.has(t));
if (sobra.length) console.log(`\ntermos que nenhuma lição usa (${sobra.length}): ${sobra.join(', ')}`);
process.exit(erros ? 1 : 0);
