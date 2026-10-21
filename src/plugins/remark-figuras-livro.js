// “Figura 1-13” no texto das lições da AUT-116 vira um link que abre a figura
// no livro do aluno, no VitalSource. As figuras não são copiadas para o site.

const {partes} = require('./figuras-livro');

const PASTAS = ['/aut-116-'];
const PULAR = new Set(['heading', 'link', 'linkReference', 'inlineCode', 'code', 'math', 'inlineMath', 'html']);

function percorrer(no) {
  if (!no.children) return;
  const filhos = [];
  for (const filho of no.children) {
    if (PULAR.has(filho.type)) filhos.push(filho);
    else if (filho.type === 'mdxJsxFlowElement' || filho.type === 'mdxJsxTextElement') {
      if (filho.name === 'details') percorrer(filho);
      filhos.push(filho);
    } else if (filho.type === 'text') {
      const ps = partes(filho.value);
      if (ps.some((p) => p.url)) {
        for (const p of ps) {
          filhos.push(
            p.url
              ? {
                  type: 'link',
                  url: p.url,
                  title: 'Abre a figura no seu livro, no VitalSource (precisa estar logado)',
                  children: [{type: 'text', value: p.texto}],
                }
              : {type: 'text', value: p.texto},
          );
        }
      } else filhos.push(filho);
    } else {
      percorrer(filho);
      filhos.push(filho);
    }
  }
  no.children = filhos;
}

module.exports = function remarkFigurasLivro() {
  return (tree, file) => {
    const caminho = (file.path || file.history?.[0] || '').split('\\').join('/');
    if (!PASTAS.some((p) => caminho.includes(p))) return;
    percorrer(tree);
  };
};
