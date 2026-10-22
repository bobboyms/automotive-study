// Termos técnicos em inglês viram botões clicáveis.
//
// Nas lições da AUT-116 em diante, peças e termos técnicos ficam em inglês no
// meio do texto em português — é como o aluno vai ouvir na aula, ler no manual
// e encontrar na prova ASE. Este plugin procura no texto cada termo do
// dicionário `src/data/termos.json` e troca por <Termo k="...">, que ao ser
// clicado mostra o nome em português e uma definição curta.
//
// Só age nas pastas listadas em PASTAS. Um termo com `so` (lista de pedaços
// do caminho) só vira botão nessas páginas: “power” é potência na TRN-120,
// mas na AUT-116 quase sempre é o power stroke.
//
// Siglas (forma toda em maiúsculas) só são achadas em maiúsculas: sem isso,
// “COM” acharia o “com” do português, e “MIL” o “mil” de “cinco mil”.
//
// Não mexe em: títulos (o texto vai para o índice lateral sem passar pelo
// React), links, código, fórmulas, <summary> (o clique abriria o <details>)
// e componentes JSX.

const termos = require('../data/termos.json').termos;

const PASTAS = ['/trn-120-', '/aut-116-'];

// Plural automático da última palavra: piston -> pistons, gas -> gases,
// battery -> batteries. Sigla (tudo maiúsculo) não ganha plural.
function plurais(forma) {
  if (/^[A-Z0-9]+$/.test(forma)) return [forma];
  const m = /^(.*?)([A-Za-z]+)$/.exec(forma);
  if (!m) return [forma];
  const [, antes, ultima] = m;
  let p;
  if (/[^aeiou]y$/i.test(ultima)) p = ultima.slice(0, -1) + 'ies';
  else if (/(s|x|z|ch|sh)$/i.test(ultima)) p = ultima + 'es';
  else p = ultima + 's';
  return [forma, antes + p];
}

const indice = new Map(); // forma em minúsculas -> chave (o `en` do termo)
const siglas = new Set(); // formas que só valem em maiúsculas
const so = new Map(); // chave -> pastas em que o termo vale
for (const t of termos) {
  if (t.so) so.set(t.en, t.so);
  for (const forma of [t.en, ...(t.var || [])]) {
    for (const f of plurais(forma)) {
      const chave = f.toLowerCase();
      if (indice.has(chave) && indice.get(chave) !== t.en) {
        throw new Error(
          `termos.json: "${f}" aparece em "${indice.get(chave)}" e em "${t.en}"`,
        );
      }
      indice.set(chave, t.en);
      if (/^[A-Z0-9+]+$/.test(f) && /[A-Z]/.test(f)) siglas.add(f);
    }
  }
}

// O espaço de um termo também aceita a quebra de linha: no markdown, “short
// to\npower” quebrado no fim da linha é o mesmo texto.
const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
// Formas mais longas primeiro: "piston pin" ganha de "piston".
const formas = [...indice.keys()].sort((a, b) => b.length - a.length);
// Fronteira de palavra que entende acento: sem ela, "fan" seria achado dentro
// de "fanático", porque o \b do JavaScript acha que "á" separa palavras.
const RE = new RegExp(
  `(?<![\\p{L}\\p{N}-])(${formas.map(escapar).join('|')})(?![\\p{L}\\p{N}]|-[\\p{L}])`,
  'giu',
);

const PULAR = new Set([
  'heading',
  'link',
  'linkReference',
  'inlineCode',
  'code',
  'math',
  'inlineMath',
  'image',
  'html',
]);

function termoNo(texto, chave) {
  return {
    type: 'mdxJsxTextElement',
    name: 'Termo',
    attributes: [{type: 'mdxJsxAttribute', name: 'k', value: chave}],
    children: [{type: 'text', value: texto}],
  };
}

function dividir(valor, caminho) {
  const partes = [];
  let ultimo = 0;
  for (const m of valor.matchAll(RE)) {
    const chave = indice.get(m[0].replace(/\s+/g, ' ').toLowerCase());
    if (siglas.has(m[0].toUpperCase()) && m[0] !== m[0].toUpperCase()) continue;
    if (so.has(chave) && !so.get(chave).some((p) => caminho.includes(p))) continue;
    if (m.index > ultimo) partes.push({type: 'text', value: valor.slice(ultimo, m.index)});
    partes.push(termoNo(m[0], chave));
    ultimo = m.index + m[0].length;
  }
  if (!partes.length) return null;
  if (ultimo < valor.length) partes.push({type: 'text', value: valor.slice(ultimo)});
  return partes;
}

function percorrer(no, caminho) {
  if (!no.children) return;
  const filhos = [];
  for (const filho of no.children) {
    if (PULAR.has(filho.type)) {
      filhos.push(filho);
    } else if (filho.type === 'mdxJsxFlowElement' || filho.type === 'mdxJsxTextElement') {
      // <details> e blocos parecidos: o conteúdo é markdown e recebe termos;
      // <summary> e componentes nossos (figuras), não.
      if (filho.name === 'details') percorrer(filho, caminho);
      filhos.push(filho);
    } else if (filho.type === 'text') {
      const partes = dividir(filho.value, caminho);
      if (partes) filhos.push(...partes);
      else filhos.push(filho);
    } else {
      percorrer(filho, caminho);
      filhos.push(filho);
    }
  }
  no.children = filhos;
}

module.exports = function remarkTermos() {
  return (tree, file) => {
    const caminho = (file.path || file.history?.[0] || '').split('\\').join('/');
    if (!PASTAS.some((p) => caminho.includes(p))) return;
    percorrer(tree, caminho);
  };
};

module.exports.indice = indice;
module.exports.siglas = siglas;
module.exports.RE = RE;
