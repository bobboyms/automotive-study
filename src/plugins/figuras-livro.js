// Acha as menções a figuras do livro num texto — “Figura 1-13”, “Figura
// 1-13C”, “Figuras 1-11 e 1-12”, “Figura 1-24, parte B” — e devolve os
// pedaços, com o link de cada número para a página do livro no VitalSource.
// Usado pelo plugin remark-figuras-livro (texto das lições) e pelo componente
// LegendaLivro (legendas das figuras).

const livro = require('../data/livro.json');

const MENCAO = /Figuras? (\d+-\d+[A-D]?(?:(?:, | e )\d+-\d+[A-D]?)*)/g;
const NUMERO = /(\d+-\d+)([A-D]?)/g;

function url(numero) {
  const pagina = livro.figuras[numero];
  return pagina ? `${livro.pagina}${pagina}` : null;
}

// Devolve [{texto}, {texto, url}, ...] na ordem do original.
function partes(texto) {
  const out = [];
  let ultimo = 0;
  for (const m of texto.matchAll(MENCAO)) {
    const inicioLista = m.index + m[0].length - m[1].length;
    for (const n of m[1].matchAll(NUMERO)) {
      const ini = inicioLista + n.index;
      const destino = url(n[1]);
      if (!destino) continue;
      // a palavra “Figura” vai junto no link do primeiro número
      const de = n.index === 0 ? m.index : ini;
      if (de > ultimo) out.push({texto: texto.slice(ultimo, de)});
      out.push({texto: texto.slice(de, ini + n[0].length), url: destino});
      ultimo = ini + n[0].length;
    }
  }
  if (ultimo < texto.length) out.push({texto: texto.slice(ultimo)});
  return out;
}

module.exports = {partes, livro};
