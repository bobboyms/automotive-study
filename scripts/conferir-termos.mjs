#!/usr/bin/env node
// Confere o dicionário de termos (src/data/termos.json):
// - toda `licao` aponta para uma lição que existe em docs/;
// - lista, por lição da AUT-116, quantos termos do dicionário o texto usa e
//   quais termos do dicionário nenhuma lição usa (candidatos a revisão).
//
// Uso: node scripts/conferir-termos.mjs

import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dic = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/termos.json'), 'utf8'));
const {indice} = require('../src/plugins/remark-termos.js');

const pasta = path.join(ROOT, 'docs', ...dic.base.split('/').filter(Boolean));
const arquivos = fs
  .readdirSync(path.join(ROOT, 'docs', 'aut-116-motor'), {recursive: true})
  .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
  .map((f) => path.join(ROOT, 'docs', 'aut-116-motor', f));
const ids = new Set(
  arquivos.map((f) => path.basename(f).replace(/\.mdx?$/, '').replace(/^\d+-/, '')),
);

let erros = 0;
for (const chave of Object.keys(dic.licoes)) {
  if (!ids.has(chave)) {
    console.log(`lição "${chave}" não existe em ${path.relative(ROOT, pasta)}`);
    erros++;
  }
}

const usados = new Set();
const RE = new RegExp(
  `(?<![\\p{L}\\p{N}-])(${[...indice.keys()]
    .sort((a, b) => b.length - a.length)
    .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})(?![\\p{L}\\p{N}]|-[\\p{L}])`,
  'giu',
);
for (const f of arquivos) {
  const texto = fs.readFileSync(f, 'utf8');
  const aqui = new Set();
  for (const m of texto.matchAll(RE)) aqui.add(indice.get(m[0].toLowerCase()));
  aqui.forEach((t) => usados.add(t));
  console.log(`${path.relative(ROOT, f)}: ${aqui.size} termos`);
}
const sobra = dic.termos.map((t) => t.en).filter((t) => !usados.has(t));
if (sobra.length) console.log(`\ntermos que nenhuma lição usa (${sobra.length}): ${sobra.join(', ')}`);
process.exit(erros ? 1 : 0);
