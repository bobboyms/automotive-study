import React from 'react';
import katex from 'katex';

// Rótulo em LaTeX dentro de um SVG.
//
// Por que foreignObject e não <text>: os diagramas ficam ao lado de fórmulas
// KaTeX no corpo da lição, e um rótulo escrito em fonte de interface ao lado de
// um $x$ em fonte matemática denuncia que são dois sistemas diferentes. Aqui o
// rótulo é o mesmo KaTeX da fórmula.
//
// A caixa é generosa de propósito: foreignObject recorta o que passa dos
// limites, então ela precisa caber o rótulo mais largo. Como é transparente e
// não recebe eventos, sobra não atrapalha.
const BOX_W = 260;
const BOX_H = 44;

export default function SvgMath({
  x,
  y,
  math,
  anchor = 'middle',
  fontSize = 15,
  tone,
  space,
  halo = false,
}) {
  // `space` é a largura disponível do lado ancorado. Sem ela a caixa pode
  // atravessar a borda do viewBox e o rótulo é cortado — foi assim que o
  // rótulo da linha sumiu na primeira versão.
  const boxW = Math.min(BOX_W, space ?? BOX_W);
  const boxX =
    anchor === 'middle' ? x - boxW / 2 : anchor === 'end' ? x - boxW : x;
  const justify =
    anchor === 'middle'
      ? 'center'
      : anchor === 'end'
        ? 'flex-end'
        : 'flex-start';

  return (
    <foreignObject
      x={boxX}
      y={y - BOX_H / 2}
      width={boxW}
      height={BOX_H}
      style={{overflow: 'visible', pointerEvents: 'none'}}
    >
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          width: `${boxW}px`,
          height: `${BOX_H}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: justify,
          fontSize: `${fontSize}px`,
          lineHeight: 1,
          color: tone ? `var(--mv-tone-${tone})` : 'var(--ifm-font-color-base)',
        }}
      >
        {/* halo: fundo na cor da página, para o rótulo continuar legível
            quando cruza um traço do desenho. Precisa ser `--mv-paper`, e não
            `--ifm-background-color`: esta última é `#0000` no tema claro, o que
            deixava o halo transparente justamente onde ele mais faz falta. */}
        <span
          style={
            halo
              ? {
                  background: 'var(--mv-paper)',
                  padding: '1px 4px',
                  borderRadius: '3px',
                }
              : undefined
          }
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(String(math), {
              throwOnError: false,
            }),
          }}
        />
      </div>
    </foreignObject>
  );
}
