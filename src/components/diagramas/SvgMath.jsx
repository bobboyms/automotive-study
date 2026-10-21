import React from 'react';
import metricas from 'katex/src/fontMetricsData';

// Rótulo em LaTeX dentro de um SVG, desenhado como <text> de SVG com as
// fontes do KaTeX: o diagrama sai na mesma fonte das fórmulas ao redor, e um
// $V$ no desenho é igual ao $V$ do texto.
//
// Por que não o KaTeX dentro de um <foreignObject> (a primeira versão): o
// Safari desenha fora de escala e fora de lugar todo elemento com `position`
// dentro de um foreignObject, e o KaTeX usa `position: relative` em toda
// fórmula. No Chrome ficava perfeito; no Safari as letras saíam gigantes e os
// sinais fora dos selos. Texto de SVG escala com o desenho em qualquer
// navegador.
//
// O que é entendido — o que os rótulos das lições usam:
//   letras (variáveis, em itálico), números, `.`, `?`, `(`, `)`
//   `+ - = \times \div \approx \pm \cdot`, com o espaçamento do TeX
//   `\text{...}`, `\,`, `\Omega` e outras gregas, índice `_x` ou `_{xy}`,
//   expoente `^x` ou `^{xy}`
// Qualquer outro comando derruba o build, para nenhum rótulo sair errado sem
// ninguém ver. Se uma lição precisar de mais, acrescente aqui.

// O CSS do KaTeX aumenta toda fórmula para 1.21 em; os tamanhos dos
// componentes foram acertados com esse aumento, então ele continua aqui.
const ESCALA = 1.21;

// Correção de itálico, em em: o espaço que o KaTeX deixa depois de uma letra
// inclinada para ela não encostar no que vem depois (o V tem bastante). Sem
// ela, “V =” saía apertado.
const italico = (c) => metricas['Math-Italic'][c.codePointAt(0)]?.[2] ?? 0;

const MAIN = 'KaTeX_Main, "Times New Roman", serif';
const MATH = 'KaTeX_Math, "Times New Roman", serif';

const SIMBOLOS = {
  times: ['bin', '×'],
  div: ['bin', '÷'],
  pm: ['bin', '±'],
  cdot: ['bin', '⋅'],
  approx: ['rel', '≈'],
  Omega: ['ord', 'Ω'],
  Delta: ['ord', 'Δ'],
};
// Minúsculas gregas são variáveis: itálico, como no KaTeX.
const GREGAS = {alpha: 'α', beta: 'β', theta: 'θ', mu: 'μ', rho: 'ρ', omega: 'ω'};

// Espaços do TeX entre átomos, em em: médio em volta de operação, grosso em
// volta de relação.
const MEDIO = 4 / 18;
const GROSSO = 5 / 18;
const FINO = 3 / 18;

function grupo(src, i) {
  // devolve [conteúdo, índice depois do grupo] para `{...}` ou um caractere
  if (src[i] !== '{') return [src[i] ?? '', i + 1];
  let nivel = 0;
  for (let j = i; j < src.length; j++) {
    if (src[j] === '{') nivel++;
    else if (src[j] === '}' && --nivel === 0) return [src.slice(i + 1, j), j + 1];
  }
  throw new Error(`SvgMath: chave sem fechar em "${src}"`);
}

// LaTeX -> lista de átomos {tipo, texto, italico, sub, sup} ou {espaco}.
function ler(src) {
  const atomos = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === ' ') {
      i++;
    } else if (c === '\\') {
      const m = /^\\([A-Za-z]+|.)/.exec(src.slice(i));
      const nome = m[1];
      i += m[0].length;
      if (nome === 'text') {
        const [conteudo, fim] = grupo(src, i);
        atomos.push({tipo: 'ord', texto: conteudo});
        i = fim;
      } else if (nome === ',') {
        atomos.push({espaco: FINO});
      } else if (SIMBOLOS[nome]) {
        const [tipo, texto] = SIMBOLOS[nome];
        atomos.push({tipo, texto});
      } else if (GREGAS[nome]) {
        atomos.push({tipo: 'ord', texto: GREGAS[nome], italico: true});
      } else {
        throw new Error(`SvgMath: comando \\${nome} não suportado em "${src}"`);
      }
    } else if (c === '_' || c === '^') {
      const [conteudo, fim] = grupo(src, i + 1);
      const alvo = atomos[atomos.length - 1];
      if (!alvo || alvo.espaco) throw new Error(`SvgMath: ${c} sem base em "${src}"`);
      // índice e expoente juntos ficariam um depois do outro, não empilhados
      if (alvo.sub || alvo.sup) {
        throw new Error(`SvgMath: índice e expoente juntos não suportados em "${src}"`);
      }
      alvo[c === '_' ? 'sub' : 'sup'] = ler(conteudo);
      i = fim;
    } else if (/[0-9.]/.test(c)) {
      const m = /^[0-9.]+/.exec(src.slice(i))[0];
      atomos.push({tipo: 'ord', texto: m});
      i += m.length;
    } else if (/[A-Za-z]/.test(c)) {
      atomos.push({tipo: 'ord', texto: c, italico: true});
      i++;
    } else if (c === '+' || c === '-') {
      atomos.push({tipo: 'bin', texto: c === '-' ? '−' : '+'});
      i++;
    } else if (c === '=' || c === '<' || c === '>') {
      atomos.push({tipo: 'rel', texto: c});
      i++;
    } else if (c === '(') {
      atomos.push({tipo: 'open', texto: c});
      i++;
    } else if (c === ')' || c === '?' || c === '!') {
      atomos.push({tipo: 'close', texto: c});
      i++;
    } else if (c === '{' || c === '}') {
      i++;
    } else {
      atomos.push({tipo: 'ord', texto: c});
      i++;
    }
  }
  // Como no TeX: operação no começo, no fim, ou depois de outra operação,
  // relação ou parêntese aberto vira símbolo comum (o “−” de “−5”).
  const reais = atomos.filter((a) => !a.espaco);
  reais.forEach((a, k) => {
    if (a.tipo !== 'bin') return;
    const antes = reais[k - 1];
    const depois = reais[k + 1];
    if (
      !antes || ['bin', 'rel', 'open'].includes(antes.tipo) ||
      !depois || ['rel', 'close'].includes(depois.tipo)
    ) {
      a.tipo = 'ord';
    }
  });
  return atomos;
}

function espacoEntre(a, b) {
  if (a.tipo === 'rel' || b.tipo === 'rel') return a.tipo === b.tipo ? 0 : GROSSO;
  if (a.tipo === 'bin' || b.tipo === 'bin') return MEDIO;
  return 0;
}

// Átomos -> <tspan>s. `dx` leva o espaço, `dy` sobe e desce os índices.
function tspans(atomos, fontSize, chave = 'a') {
  const out = [];
  let espaco = 0;
  let volta; // dy que traz o próximo átomo de volta à linha de base
  let anterior = null;
  atomos.forEach((a, k) => {
    if (a.espaco) {
      espaco += a.espaco;
      return;
    }
    if (anterior) espaco += espacoEntre(anterior, a) + (anterior.correcao ?? 0);
    out.push(
      <tspan
        key={`${chave}${k}`}
        dx={espaco ? espaco * fontSize : undefined}
        dy={volta}
        fontFamily={a.italico ? MATH : MAIN}
        fontStyle={a.italico ? 'italic' : undefined}
      >
        {a.texto}
      </tspan>,
    );
    espaco = 0;
    volta = undefined;
    // A correção de itálico vai depois da letra — ou entre ela e o expoente.
    // O índice não leva: no KaTeX ele fica colado na letra.
    // Depois de índice ou expoente, o KaTeX deixa 0,05 em (o “scriptspace”)
    // mais a correção da última letra dele, já reduzida.
    const correcao = a.italico ? italico(a.texto) : 0;
    const fimScript = (lista) => {
      const ultimo = lista.filter((x) => !x.espaco).at(-1);
      return 0.05 + (ultimo?.italico ? italico(ultimo.texto) * 0.7 : 0);
    };
    a.correcao =
      a.sub || a.sup
        ? Math.max(a.sub ? fimScript(a.sub) : 0, a.sup ? fimScript(a.sup) : 0)
        : correcao;
    // índice: 70% do tamanho, descido 0,15 em (os números do KaTeX); expoente
    // subido 0,41 em, depois da correção de itálico
    for (const [lado, desloc] of [['sub', 0.15], ['sup', -0.41]]) {
      if (!a[lado]) continue;
      const fs = fontSize * 0.7;
      const d = desloc * fontSize;
      out.push(
        <tspan
          key={`${chave}${k}${lado}`}
          fontSize={fs}
          dx={lado === 'sup' ? correcao * fontSize : undefined}
          dy={d}
        >
          {tspans(a[lado], fs, `${chave}${k}${lado}`)}
        </tspan>,
      );
      volta = -d;
    }
    anterior = a;
  });
  return out;
}

export default function SvgMath({
  x,
  y,
  math,
  anchor = 'middle',
  fontSize = 15,
  tone,
  halo = false,
}) {
  const fs = fontSize * ESCALA;
  // `y` é o meio do rótulo: a linha de base fica um terço do tamanho da fonte
  // abaixo, o que centra as maiúsculas e os números na altura pedida.
  return (
    <text
      x={x}
      y={y + fs * 0.34}
      textAnchor={anchor}
      fontSize={fs}
      fontFamily={MAIN}
      style={{
        fill: tone ? `var(--mv-tone-${tone})` : 'var(--ifm-font-color-base)',
        whiteSpace: 'pre',
        pointerEvents: 'none',
        // halo: contorno na cor da página, para o rótulo continuar legível
        // quando cruza um traço do desenho. `--mv-paper`, e não
        // `--ifm-background-color`, que é transparente no tema claro.
        ...(halo && {
          stroke: 'var(--mv-paper)',
          strokeWidth: fs * 0.25,
          strokeLinejoin: 'round',
          paintOrder: 'stroke',
        }),
      }}
    >
      {tspans(ler(String(math)), fs)}
    </text>
  );
}
