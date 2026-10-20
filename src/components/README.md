# Componentes visuais das lições

Diagramas em SVG para a etapa "modelo visual" das lições. Os diagramas
**estáticos** renderizam no build, não têm estado e não têm interação. Os
rótulos são KaTeX — o mesmo motor das fórmulas do corpo do texto —, então o
desenho sai na mesma fonte das fórmulas ao redor.

Componente interativo (com controle deslizante) só quando **mexer no parâmetro
é a ideia** sendo ensinada — veja o critério em
`.claude/skills/tutor-automotivo/escrever-licao.md`. Ainda não há nenhum.

## Como usar numa lição

1. A página precisa ser `.mdx`. Se ainda for `.md`, renomeie com `git mv` — o id
   e a URL não mudam, porque o Docusaurus já ignora a extensão e o prefixo
   numérico.
2. Importe logo abaixo do frontmatter:

```mdx
---
title: Lei de Ohm
---

import Circuito from '@site/src/components/Circuito';
```

3. Use no corpo. Numa prop com aspas duplas (`fonte="12\,\text{V}"`), o LaTeX
   vai com **barra simples**, porque o JSX não interpreta a barra dentro de
   aspas. Dentro de chaves (`fonte={'12\\,\\text{V}'}`), a string passa pelo
   JavaScript e a barra precisa ser **dupla**. Prefira as aspas duplas.

## Qual usar

| Ideia | Componente |
|---|---|
| circuito de uma carga: partes, laço completo, retorno pela massa, circuito aberto, curto, sentido da corrente | `Circuito` |
| várias cargas em série ou em paralelo: quedas de tensão, correntes dos ramos, carga aberta, curto num ramo | `Associacao` |
| triângulo da lei de Ohm, com letras ou unidades, e as três leituras tapando uma grandeza | `TrianguloOhm` |
| átomo em camadas, elétrons da camada de fora, elétron livre | `Atomo` |
| elétrons livres dentro do fio, sem e com corrente | `FioEletrons` |
| correspondência: sintoma → causa → teste, leitura → significado | tabela markdown |
| passos alinhados de uma conta | `\begin{array}` em KaTeX |

## Cores

Três tons, definidos em `src/css/custom.css` como `--mv-tone-1`, `--mv-tone-2` e
`--mv-tone-3`, com valores próprios para tema claro e escuro. Estão validados
para daltonismo e contraste nos dois temas.

**Não acrescente um quarto tom.** Quando um diagrama parece precisar de mais de
três cores, quase sempre duas regiões representam a mesma coisa e devem dividir
a mesma cor.

Em todos os componentes, `tone` é `1`, `2` ou `3`; `0` é neutro (sem cor).

No `Circuito`, cada tom tem um papel fixo, e as lições dependem disso: **azul**
(`1`) é a corrente, **laranja** (`2`) é a carga, **verde** (`3`) é o defeito —
fio rompido ou curto. Fios, bateria, fusível e interruptor ficam na cor do
texto.

---

## Circuito

Circuito de uma carga em laço: bateria à esquerda, fusível e interruptor no fio
de cima, carga à direita, retorno embaixo. É a ordem dos esquemas dos manuais:
fonte, proteção, controle, carga, massa.

```mdx
{/* circuito completo, com as setas da corrente */}
<Circuito corrente caption="..." />

{/* retorno pela carroceria */}
<Circuito retorno="massa" corrente caption="..." />

{/* circuito aberto: fio rompido ou interruptor desligado */}
<Circuito quebra caption="..." />
<Circuito interruptor="aberto" caption="..." />

{/* curto à massa antes da carga */}
<Circuito curto retorno="massa" corrente caption="..." />

{/* rótulos com as grandezas */}
<Circuito corrente fonte="V = 12\,\text{V}" rotuloCarga="R" rotuloCorrente="I" />
```

| Prop | O que faz |
|---|---|
| `fonte` | LaTeX ao lado da bateria (padrão `12\,\text{V}`) |
| `fusivel` | `false` remove o fusível (padrão `true`) |
| `interruptor` | `'fechado'` (padrão), `'aberto'` ou `null` para remover |
| `carga` | `'lampada'` (padrão) ou `'resistor'` |
| `rotuloCarga` | LaTeX ao lado da carga (padrão: “lâmpada” ou “resistor”) |
| `retorno` | `'fio'` (padrão) ou `'massa'`, que desenha o símbolo de massa e a carroceria |
| `corrente` | desenha as setas da corrente. Não aparecem se o circuito estiver aberto |
| `sentido` | `'convencional'` (padrão, do + para o −) ou `'eletrons'` |
| `rotuloCorrente` | LaTeX junto das setas, como `I` ou `4\,\text{A}` |
| `quebra` | desenha um fio rompido no fio de cima; o circuito fica aberto |
| `curto` | desenha um caminho do positivo à massa antes da carga; as setas passam por ele |
| `nomes` | `false` tira os nomes “fusível” e “interruptor” |
| `caption` | **texto simples**, não LaTeX — legenda abaixo da figura |

A bateria segue o símbolo dos esquemas: placa longa é o positivo, placa curta e
grossa é o negativo. As setas seguem o sentido convencional, porque é o dos
esquemas do fabricante; o sentido dos elétrons existe para a comparação na lição
[O circuito elétrico](../../docs/trn-120-eletricidade/02-o-circuito-eletrico.mdx).

---

## Atomo

Átomo no modelo de camadas: núcleo no centro, elétrons em círculos ao redor. Os
elétrons da camada de fora saem em azul, com um rótulo. O padrão é o átomo de
cobre.

```mdx
<Atomo caption="..." />

{/* outro elemento: alumínio, 13 elétrons */}
<Atomo camadas={[2, 8, 3]} nucleo="13+" rotuloExterno="\text{3 elétrons de fora}" />
```

| Prop | O que faz |
|---|---|
| `camadas` | elétrons em cada camada, de dentro para fora (padrão `[2, 8, 18, 1]`, o cobre) |
| `nucleo` | LaTeX no núcleo (padrão `29+`) |
| `destaque` | `false` tira o azul e o rótulo da camada de fora |
| `rotuloExterno` | LaTeX do rótulo da camada de fora (padrão “elétron livre”) |
| `caption` | **texto simples** |

O modelo de camadas é uma simplificação — os elétrons não giram em órbitas como
planetas. É o desenho dos livros de mecânica, e o que ele mostra está certo:
quantos elétrons há na camada de fora. Se uma lição depender de mais que isso,
diga no texto que o modelo é simplificado.

## FioEletrons

Um trecho de fio de cobre visto por dentro: átomos fixos (com o + que sobra
quando o elétron de fora sai) e elétrons livres em azul, cada um com uma seta.

```mdx
{/* sem fonte: cada elétron para um lado */}
<FioEletrons caption="..." />

{/* com fonte: todos para o polo + */}
<FioEletrons corrente caption="..." />
```

| Prop | O que faz |
|---|---|
| `corrente` | todas as setas apontam para o polo +, e os polos aparecem nas pontas |
| `caption` | **texto simples** |

As setas mostram o sentido **dos elétrons** (do − para o +), porque o desenho é
sobre os elétrons. Nos esquemas do `Circuito`, as setas são do sentido
convencional. A lição [O circuito elétrico](../../docs/trn-120-eletricidade/02-o-circuito-eletrico.mdx)
explica a diferença.

As posições e direções dos elétrons vêm de um gerador com semente fixa: o desenho
sai igual em todo build e não muda entre o servidor e o navegador.

---

## Associacao

Circuito com várias cargas. Bateria à esquerda; fusível e interruptor
(opcionais) logo depois dela, no fio de cima. Em **série**, as cargas ficam
deitadas no fio de cima, uma depois da outra, e o laço é um só. Em **paralelo**,
cada carga é um ramo em pé entre o fio de cima e o de baixo, com pontos pretos
nos nós.

```mdx
{/* série: rótulo acima de cada carga, queda de tensão abaixo */}
<Associacao
  fusivel
  interruptor
  corrente
  rotuloCorrente="I = 7.5\,\text{A}"
  cargas={[
    {tipo: 'resistor', rotulo: 'R_1 = 0.8\\,\\Omega', queda: '6\\,\\text{V}'},
    {tipo: 'motor', rotulo: 'R_2 = 0.8\\,\\Omega', queda: '6\\,\\text{V}'},
  ]}
  caption="..."
/>

{/* paralelo: rótulo à direita de cada ramo, corrente do ramo junto da seta */}
<Associacao
  tipo="paralelo"
  corrente
  rotuloCorrente="I_T = 1.5\,\text{A}"
  cargas={[
    {tipo: 'lampada', rotulo: '24\\,\\Omega', corrente: '0.5\\,\\text{A}'},
    {tipo: 'lampada', rotulo: '24\\,\\Omega', corrente: '0.5\\,\\text{A}'},
  ]}
  caption="..."
/>
```

As cargas vão num array, entre chaves: ali o LaTeX passa pelo JavaScript e a
barra é **dupla**. As props com aspas duplas continuam com barra simples.

| Prop | O que faz |
|---|---|
| `tipo` | `'serie'` (padrão) ou `'paralelo'` |
| `cargas` | lista de cargas, cada uma `{tipo, rotulo, queda, corrente, aberta}` (ver abaixo) |
| `fonte` | LaTeX ao lado da bateria (padrão `12\,\text{V}`) |
| `fusivel`, `interruptor` | desenham o fusível e o interruptor fechado na parte comum |
| `nomes` | `false` tira os nomes “fusível” e “interruptor” |
| `corrente` | desenha as setas. Em série, somem se alguma carga estiver aberta; em paralelo, some só a do ramo aberto |
| `rotuloCorrente` | LaTeX da corrente total |
| `curto` | só em paralelo: um ramo a mais, tracejado, sem carga |
| `rotuloCurto` | LaTeX junto da seta do curto |
| `caption` | **texto simples** |

Cada carga:

| Campo | O que faz |
|---|---|
| `tipo` | `'resistor'` (padrão), `'lampada'` ou `'motor'` (círculo com M) |
| `rotulo` | LaTeX acima da carga (série) ou à direita (paralelo) |
| `queda` | só em série: LaTeX abaixo da carga, para a queda de tensão |
| `corrente` | só em paralelo: LaTeX junto da seta do ramo |
| `aberta` | desenha a carga no tom 3, o do defeito; a lâmpada sai com o filamento rompido |

Os tons seguem os papéis do `Circuito`: azul é corrente, laranja é carga, verde
é defeito.

---

## TrianguloOhm

O triângulo da lei de Ohm: V em cima, I e R embaixo. A linha deitada é
“dividido por”, a linha em pé é “vezes”, e os sinais ÷ e × aparecem em azul
sobre as linhas, como o instrutor costuma desenhar.

```mdx
<TrianguloOhm caption="..." />

{/* com as unidades no lugar das letras: V, A e Ω */}
<TrianguloOhm unidades caption="..." />

{/* três triângulos, cada um com uma grandeza tapada e a fórmula embaixo */}
<TrianguloOhm cobrir caption="..." />
```

| Prop | O que faz |
|---|---|
| `unidades` | troca $V$, $I$, $R$ por V, A, Ω |
| `cobrir` | desenha as três leituras lado a lado, com a parte tapada em laranja |
| `caption` | **texto simples** |

