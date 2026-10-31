# Componentes visuais das lições

Diagramas em SVG para a etapa "modelo visual" das lições. Os diagramas
**estáticos** renderizam no build, não têm estado e não têm interação. Os
rótulos são KaTeX — o mesmo motor das fórmulas do corpo do texto —, então o
desenho sai na mesma fonte das fórmulas ao redor.

Componente interativo (com controle deslizante) só quando **mexer no parâmetro
é a ideia** sendo ensinada — veja o critério em
`.claude/skills/tutor-automotivo/escrever-licao.md`. Os interativos são
`CicloQuatroTempos` e `LabCircuito`.

## Conferência obrigatória

Nenhuma figura está pronta antes de ser vista renderizada, nos três modos:

```bash
npm run build && npm run figuras             # todas as lições
npm run figuras -- lei-de-ohm                # só uma
```

O script (`scripts/conferir-figuras.mjs`) captura cada `<figure>` — inclusive as
que ficam dentro de `<details>` — no Chrome (tema claro, tema escuro e celular de
390 px) e no Safari (computador e celular, pelo WebKit do macOS, com
`scripts/capturar-safari.swift`), e monta folhas de até três figuras em
`.figuras/`. Abra **cada folha** e procure os defeitos da lista abaixo. Achou um:
corrija, rode de novo e olhe de novo, até a figura estar 100% legível nos cinco
modos.

O Safari não é opcional: há defeito que só ele mostra. A primeira versão do
`SvgMath` punha o KaTeX dentro de um `<foreignObject>`; no Chrome ficava perfeito
e no Safari as letras saíam gigantes e fora de lugar. Por isso os rótulos agora
são `<text>` de SVG com as fontes do KaTeX — **não volte a pôr HTML dentro de um
SVG**.

### O que procurar (e as regras que evitam cada defeito)

- **Texto pequeno demais no celular.** No celular a figura é reduzida a cerca de
  358 px. Um rótulo de tamanho `f` num desenho de largura `W` sai com
  `f × 358 ÷ W` px; o mínimo é 10 px, o ideal 11 px. Em desenho largo, calcule a
  fonte a partir de `W` (veja `Associacao`) em vez de fixar um número.
- **Desenho cortado ou com rolagem de lado.** Nunca use largura mínima com
  rolagem: no celular, quem lê vê metade do circuito e nem percebe que dá para
  rolar. Compacte o desenho ou quebre em partes que descem uma embaixo da outra
  (veja `TrianguloOhm cobrir`).
- **Rótulo encostando em rótulo, peça ou fio.** Calcule o espaço: no KaTeX, cada
  letra de `\text{}` ocupa cerca de **0,65 do tamanho da fonte** (“interruptor”
  com 16 tem uns 115 de largura). Dois nomes vizinhos que não cabem lado a lado
  vão para lados opostos do fio.
- **Linha apagada por um sinal.** Não use `halo` em cima de uma linha: o fundo do
  halo apaga o pedaço da linha que fica por baixo. Um sinal que explica uma
  linha vai num selo (círculo com borda) pousado sobre ela.
- **Fio que cruza fio sem ligação.** Para quem está começando, um cruzamento
  parece uma conexão. Ponta de prova e ligação nunca cruzam um fio do circuito;
  se duas pontas precisam se cruzar, a de cima ganha uma borda da cor do fundo
  (veja `Medicao`).
- **Traço riscando texto.** Rótulo de entrada, de peça ou de fio fica do lado
  oposto ao que o traço segue.
- **Cor de fundo errada dentro de `<details>`.** O bloco recolhido tem fundo
  próprio. Borda que imita o fundo usa
  `var(--ifm-alert-background-color, var(--mv-paper))`.

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
| multímetro ligado ao circuito: tensão da fonte, tensão disponível, queda de tensão, corrente, resistência | `Medicao` |
| átomo em camadas, elétrons da camada de fora, elétron livre | `Atomo` |
| motor de um cilindro em corte: peças, posição do pistão, válvulas, gás, PMS/PMI | `Motor` |
| o ciclo de quatro tempos para girar com a mão (interativo) | `CicloQuatroTempos` |
| pistão, anéis e pino de perto; vedação pela pressão; anel de óleo | `Pistao` |
| trem de válvulas com vareta e balancim, aberto ou fechado | `ComandoValvula` |
| correia dentada e a relação 2:1 entre virabrequim e comando | `Sincronismo` |
| trem de força visto de cima, tração traseira ou dianteira | `TremDeForca` |
| caminho de um sistema em blocos: óleo, líquido, corrente, sinal | `Fluxo` |
| connecting rod desmontada: small end, bushing, rod cap, rod bearings, rod bolts | `Biela` |
| intake manifold e exhaust manifold em corte, com throttle body e fuel injector | `Coletores` |
| cooling system com as peças: water pump, thermostat, hoses, radiator, fan, heater core | `Arrefecimento` |
| lubrication system com as peças: oil pan, pickup, pump, filter, galleries | `Lubrificacao` |
| starting system (por trás) e charging system (pela frente, com a drive belt) | `PartidaCarga` |
| elétrons livres dentro do fio, sem e com corrente | `FioEletrons` |
| bancada para o aluno montar circuits com a mão: battery, wire, bulb, switch, fuse (interativo) | `LabCircuito` |
| circuit de um laço com qualquer símbolo: diode, LED, resistor, thermistor, fuse europeu | `Esquema` |
| cartões com os símbolos dos wiring diagrams, nome em inglês e nota | `TabelaSimbolos` (`Simbolos`) |
| flash cards dos símbolos, para praticar (interativo) | `FlashSimbolos` |
| wiring diagram completo no jeito dos manuais (fog lamps) | `DiagramaNeblina` |
| campo magnético de um wire, de uma coil e de um eletroímã | `Eletroima` |
| relay em corte (repouso e acionado) e o circuit da horn com relay | `Rele` |
| dimmer com rheostat: mover o wiper e ver current e power mudarem (interativo) | `Reostato` |
| resistance do NTC e do PTC com a temperatura | `CurvaTermistor` |
| as quatro bands de um resistor: por onde começar a ler e a band separada da tolerance | `CodigoCores` |
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
| `rotuloCarga` | LaTeX ao lado da carga (padrão: “bulb” ou “resistor”) |
| `retorno` | `'fio'` (padrão) ou `'massa'`, que desenha o símbolo de massa e a carroceria |
| `corrente` | desenha as setas da corrente. Não aparecem se o circuito estiver aberto |
| `sentido` | `'convencional'` (padrão, do + para o −) ou `'eletrons'` |
| `rotuloCorrente` | LaTeX junto das setas, como `I` ou `4\,\text{A}` |
| `quebra` | desenha um fio rompido no fio de cima; o circuito fica aberto |
| `curto` | desenha um caminho do positivo à massa antes da carga; as setas passam por ele |
| `nomes` | `false` tira os nomes “fuse” e “switch” |
| `caption` | **texto simples**, não LaTeX — legenda abaixo da figura |

A bateria segue o símbolo dos esquemas: placa longa é o positivo, placa curta e
grossa é o negativo. As setas seguem o sentido convencional, porque é o dos
esquemas do fabricante; o sentido dos elétrons existe para a comparação na lição
[O circuito elétrico](../../docs/trn-120-eletricidade/02-o-circuito-eletrico.mdx).

---

## LabCircuito

Bancada interativa: o aluno arrasta battery, bulb, switch, fuse e wire de uma
barra para uma grade, liga as peças e vê o circuit funcionar. Usada na página
[Laboratório de circuits](../../docs/trn-120-eletricidade/90-laboratorio-de-circuitos.mdx).

```mdx
{/* bancada vazia */}
<LabCircuito id="livre" />

{/* começa com o circuit da lição 2: battery, fuse, switch e bulb num laço */}
<LabCircuito id="experimento-2" inicial="simples" />
```

| Prop | O que faz |
|---|---|
| `id` | nome da montagem salva no navegador (`localStorage`). **Duas bancadas na mesma página precisam de ids diferentes**, senão uma apaga a outra |
| `inicial` | `'vazio'` (padrão) ou `'simples'`. O botão “Recomeçar a montagem” volta a ela |
| `caption` | texto simples, legenda abaixo da bancada |

Como funciona:

- **Grade.** 8 × 6 pontos. Cada peça ocupa um trecho entre dois pontos
  vizinhos, na horizontal ou na vertical; peças que tocam o mesmo ponto estão
  ligadas. Um wire puxado de um ponto a outro vira um trecho por espaço da
  grade (primeiro na horizontal, depois na vertical), e não pode passar por
  cima de outra peça. Onde três ou mais pontas se encontram, aparece o ponto
  preto de junction.
- **Gestos.** Arrastar da barra põe a peça; tocar na barra põe num lugar
  livre. Arrastar o meio de uma peça move; arrastar a partir de um ponto da
  grade puxa um wire (os pontos ficam por cima das peças, então puxar perto da
  ponta de uma peça começa um wire). Tocar seleciona; no switch, também abre e
  fecha. Com a peça selecionada, o painel mostra voltage, current e power e os
  botões girar, apagar, queimar ou trocar a bulb, trocar o fuse. No teclado,
  Delete apaga e R gira.
- **Girar** é um quarto de volta em torno do terminal `a`. Na battery, `a` é
  o positivo, e duas voltas trocam o + de lado.
- **Simulação** em `simular.js`: análise nodal, com cada peça como uma
  condutância e a battery como fonte de current em paralelo com a resistance
  interna. Resolve qualquer montagem. Depois de resolver, queima a peça mais
  sobrecarregada — fuse acima de 10 A, bulb acima do dobro da power normal — e
  resolve de novo, até nada passar do limite. A peça queimada fica queimada até
  o aluno trocar.
- **Valores** (ilustrativos, em `VALORES`): battery de 12 V com 0.01 Ω
  internos, bulb de 24 Ω (6 W em 12 V, a taillight da lição de parallel
  circuit), fuse de 10 A, wire, switch fechado e fuse inteiro com 0.001 Ω. A
  resistance interna existe para o short circuit dar uma current finita, e os
  0.001 Ω dos wires para cada trecho ter a sua current. Por causa deles, a
  bancada às vezes mostra 11.9 V onde a conta da lição dá 12 V — a página do
  laboratório avisa isso.
- **Cores.** Os papéis do `Circuito`: azul (`1`) é a current — os pontos que
  andam nos wires, no sentido convencional, mais depressa quanto maior a
  current —, laranja (`2`) é a load, verde (`3`) é o defeito (filamento
  partido, fuse queimado, alerta de short circuit). A seleção e o wire sendo
  puxado usam a cor primária do site, que é da interface, não do desenho.
- **Celular.** A bancada e a barra têm `touch-action: none`, porque senão
  arrastar uma peça rolaria a página. A página do laboratório diz ao aluno que,
  para rolar, ele toca fora da bancada.
- **Montagem salva** no `localStorage`, lida só depois que a página abre (no
  build não existe `localStorage`). Toda leitura e escrita fica em
  `try/catch`: com o armazenamento bloqueado, a bancada funciona sem salvar.

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
| `nomes` | `false` tira os nomes “fuse” e “switch” |
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

O tamanho dos rótulos é calculado a partir da largura do desenho, para continuar
legível no celular — por isso uma figura com mais ramos sai com letras maiores.
“fuse” vai embaixo do fio e “switch” em cima: na mesma linha, os dois
se encostavam. Em paralelo, a corrente total aparece junto da seta do fio da
bateria, que é por onde ela passa.

---

## TrianguloOhm

O triângulo da lei de Ohm: V em cima, I e R embaixo. A linha deitada é
“dividido por”, a linha em pé é “vezes”, e os sinais ÷ e × aparecem em azul,
cada um num selo (círculo com borda) pousado sobre a linha que ele explica. Um
sinal solto com fundo em cima da linha apagava pedaços dela.

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
| `cobrir` | desenha as três leituras, com a parte tapada em laranja. São três SVGs que quebram linha: lado a lado no computador, dois por linha no celular |
| `caption` | **texto simples** |

---

## Medicao

O multímetro ligado a um circuito de farol (bateria, fusível, interruptor,
lâmpada, retorno pela massa), numa das cinco medições. O visor fica em cima, os
nomes das entradas (A, COM, VΩ) logo abaixo e os furos por último — as pontas
saem para baixo e riscariam um nome que estivesse embaixo do furo. A entrada
usada pela ponta vermelha aparece preenchida. A ponta vermelha sai no tom 2 e a
preta na cor do texto. As setas azuis da corrente aparecem quando ela está
passando.

O multímetro muda de lugar conforme o ponto medido, para nenhuma ponta cruzar
um fio do circuito: **à direita** quando as pontas vão à lâmpada ou à massa
(`disponivel`, `queda` na carga ou na massa); **em cima** quando vão ao fio de
cima (`corrente`, `queda` no conector oxidado). Quando a vermelha precisa
cruzar a preta, passa por cima com uma borda da cor do fundo.

```mdx
<Medicao modo="fonte" leitura="12.6\,\text{V}" caption="..." />
<Medicao modo="disponivel" leitura="12\,\text{V}" caption="..." />
<Medicao modo="disponivel" semCarga leitura="12\,\text{V}" caption="..." />
<Medicao modo="queda" leitura="12\,\text{V}" caption="..." />
<Medicao modo="queda" alvo="oxidacao" oxidacao leitura="2.4\,\text{V}" caption="..." />
<Medicao modo="queda" alvo="massa" leitura="2.4\,\text{V}" caption="..." />
<Medicao modo="corrente" leitura="5\,\text{A}" caption="..." />
<Medicao modo="resistencia" leitura="0.3\,\Omega" caption="..." />
```

| Prop | O que faz |
|---|---|
| `modo` | `'fonte'` (bateria sozinha, sem carga), `'disponivel'`, `'queda'`, `'corrente'` (circuito aberto, multímetro em série) ou `'resistencia'` (lâmpada fora do circuito) |
| `leitura` | LaTeX no visor |
| `alvo` | só em `queda`: `'carga'` (padrão, sobre a lâmpada), `'oxidacao'` (sobre o conector oxidado) ou `'massa'` (do terminal negativo da lâmpada ao negativo da bateria) |
| `oxidacao` | desenha um conector oxidado, no tom 3, no fio de cima |
| `semCarga` | tira a lâmpada do soquete; não passa corrente |
| `corrente` | `false` tira as setas da corrente |
| `caption` | **texto simples** |

---

# Termos clicáveis (TRN-120 e AUT-116) e desenhos do motor

## Termos em inglês: `Termo`, o plugin e o dicionário

Nas lições da TRN-120 e da AUT-116, as peças e os termos técnicos ficam
**em inglês** no texto, e um toque no termo mostra o português. Três peças
fazem isso:

- `src/data/termos.json` — o dicionário. Cada termo tem `en` (a chave),
  `pt`, `def` (uma linha, em português), `var` (outras grafias; o plural com
  -s/-es/-ies é automático), `so` (opcional: pedaços do caminho das páginas
  em que o termo vale — “power” só na TRN-120, porque na AUT-116 é o power
  stroke) e `licao` (a lição em que é ensinado, chave de `licoes`, que dá o
  título e a URL). O glossário (`TabelaTermos curso="..."`) é gerado dele.
- `src/plugins/remark-termos.js` — procura os termos no texto das páginas de
  `docs/trn-120-*` e `docs/aut-116-*` e troca cada um por `<Termo k="...">`.
  Não mexe em títulos, links, código, fórmulas, `<summary>` nem dentro de
  componentes. Uma forma que aparece em dois termos derruba o build, com a
  mensagem dizendo quais. Siglas (COM, MIL, AC) só são achadas em
  maiúsculas — senão “com” e “mil” do português virariam botão. Termo de
  várias palavras é achado também quebrado no fim da linha.
- `src/components/Termo` + `src/theme/Root.js` — o botão no texto e o balão
  que mostra `pt` e `def`. O balão escuta o clique em **qualquer** elemento
  com `data-termo`, então os rótulos das figuras usam o mesmo balão.

Ninguém escreve `<Termo>` à mão: escreva o termo em inglês no texto e confira
se ele está no dicionário. Termo novo entra no `termos.json`.
`node scripts/conferir-termos.mjs` confere se toda `licao` existe e lista os
termos que nenhuma lição usa.

### Figuras do livro: links para o VitalSource

O livro da AUT-116 está no VitalSource do aluno. `src/data/livro.json` diz em
que página está cada figura (`"1-13": 7`), e toda menção “Figura 1-13” —
“Figuras 1-11 e 1-12”, “Figura 1-24, parte B” — vira link para essa página:
no texto, pelo plugin `src/plugins/remark-figuras-livro.js`; nas legendas,
pelo componente `LegendaLivro`, que todos os desenhos da AUT-116 usam no
`<figcaption>`. A leitura das menções fica em `src/plugins/figuras-livro.js`.
Capítulo novo: acrescente as páginas das figuras no `livro.json`, conferindo
cada uma no leitor (`.../page/N` abre a página N). As figuras nunca são
copiadas: o repositório é público.

Cópia local do aluno: no `npm run start` (e só nele), `material/` vira pasta
estática (`staticDirectories` em `docusaurus.config.js`), e o `LegendaLivro`
mostra embaixo da legenda a imagem `material/livro/<número>.png` de cada
figura citada (“Figura 1-13C” procura `1-13.png`). Arquivo ausente: nada
aparece. O `npm run build` não inclui `material/` nem tenta as imagens.

### Rótulos de figura: `RotuloTermo`

`src/components/diagramas/RotuloTermo.jsx` é o rótulo de SVG dos desenhos do
motor: texto na fonte do site, sublinhado pontilhado, clicável quando tem `k`.

| Prop | O que faz |
|---|---|
| `k` | chave do termo no dicionário; sem ela, o rótulo é texto comum |
| `texto` | o que aparece (padrão: `k`). `\n` quebra a linha |
| `x`, `y`, `anchor` | posição do meio da primeira linha |
| `para` | ponta da linha de chamada, na peça |
| `de` | começo da linha de chamada (padrão: ao lado do texto) |
| `fs`, `tone` | tamanho e cor (tom 1 a 3) |

O rótulo tem um contorno na cor do papel, para continuar legível quando passa
sobre um traço. Por isso ele **não** pode ficar em cima de uma linha que
importa: o contorno apaga o pedaço de baixo.

Nos desenhos de circuito da TRN-120, os rótulos passam pelo `SvgMath`. Um
rótulo que é só texto — `math="\text{fuse}"`, `rotulo: '\\text{trailer}'` —
vira um `RotuloTermo` sozinho, na fonte do site; se o texto for um termo do
dicionário (`src/components/diagramas/termos.js` faz a busca), ganha também
o clique. Rótulo com grandeza (`12\,\text{V}`, `R_1`) continua em KaTeX.

## Motor

Motor de um cilindro em corte, visto de frente: bloco com galerias de água,
pistão com anéis, biela, virabrequim, cabeçote com duas válvulas inclinadas,
vela no meio e um comando sobre cada válvula. A válvula de admissão é maior que
a de escape.

Tudo sai de `fase`, o ângulo do ciclo em graus (0 a 720; 0 = PMS no começo da
admissão): posição do pistão, abertura das válvulas, giro dos comandos (metade
do ângulo), cor do gás e setas.

```mdx
<Motor rotulos="baixo" caption="..." />            {/* nomes da parte de baixo */}
<Motor rotulos="cima" fase={0} caption="..." />    {/* nomes da parte de cima */}
<Motor tempo="admissao" rotulos="nenhum" caption="..." />
<Motor fase={180} rotulos="nenhum" marcas caption="..." />  {/* TDC, BDC, stroke */}
<Motor destaque={['crankshaft']} caption="..." />
```

| Prop | O que faz |
|---|---|
| `fase` | ângulo do ciclo, 0 a 720 (padrão 300: compressão, válvulas fechadas) |
| `tempo` | `'admissao'`, `'compressao'`, `'combustao'`, `'escape'` (o meio de cada tempo), `'pms'`, `'pmi'`. Liga o gás e as setas |
| `rotulos` | `'baixo'`, `'cima'` ou `'nenhum'` |
| `gas`, `setas` | forçam o gás e as setas com `fase` |
| `marcas` | linhas do TDC e do BDC e a cota do stroke, à direita. Use com `rotulos="nenhum"` |
| `destaque` | peças em laranja: `'cylinder block'`, `'cylinder head'`, `'piston'`, `'piston ring'`, `'piston pin'`, `'connecting rod'`, `'crankshaft'`, `'spark plug'`, `'intake valve'`, `'exhaust valve'`, `'valve'` |
| `caption` | texto simples |

Cores: tom 1 (azul) é a mistura fresca; tom 2 (laranja) é o gás queimando ou
queimado — e a peça em destaque, que só aparece em figura sem gás —; tom 3
(verde) é o líquido nas galerias de água.

As válvulas abrem exatamente no PMS e no PMI, sem antecipação nem atraso: é a
simplificação do livro. A lição que tratar do tempo de válvulas real precisa
dizer isso.

## CicloQuatroTempos

O `Motor` com um controle deslizante de 0° a 720° e quatro botões que pulam
para o meio de cada tempo. Ao lado, o nome do tempo (clicável), o ângulo do
virabrequim e do comando, o sentido do pistão e o estado de cada válvula.

```mdx
<CicloQuatroTempos caption="..." />
```

## Pistao

| `modo` | O que mostra |
|---|---|
| `'conjunto'` (padrão) | pistão no cilindro: dois anéis de compressão, anel de óleo, pino, biela e a folga (exagerada) |
| `'compressao'` | uma canaleta ampliada: a pressão desce pela folga, entra atrás do anel e o aperta contra a parede |
| `'oleo'` | o anel de óleo descendo e raspando a película de óleo, que volta para baixo |

Tom 2 é a pressão da combustão; tom 1 é o óleo.

## ComandoValvula

Trem de válvulas com vareta (OHV): came, tucho, vareta, balancim, mola e
válvula. `aberta` gira o came com o ressalto para cima e mostra as setas do
movimento em tom 2.

```mdx
<ComandoValvula caption="..." />
<ComandoValvula aberta caption="..." />
```

## Sincronismo

Engrenagem do virabrequim (18 dentes) e do comando (36), com a correia e uma
marca em cada. `voltas` é quanto o virabrequim girou desde o início; a marca do
comando anda a metade.

```mdx
<Sincronismo voltas={0} caption="..." />
<Sincronismo voltas={1} caption="..." />
```

## TremDeForca

Vista de cima, frente para cima. `tipo="traseira"` (padrão): motor, embreagem,
câmbio, eixo cardã, diferencial e semieixos traseiros. `tipo="dianteira"`:
motor deitado, embreagem, transeixo e semieixos dianteiros, com eixo não
motriz atrás. O caminho da força sai em tom 2.

## Fluxo

Caminho de um sistema em blocos, em HTML (vira coluna no celular e quando tem
mais de quatro blocos). Cada bloco tem o nome em inglês, clicável, e uma nota
em português.

```mdx
<Fluxo
  etapas={[
    {k: 'oil pan', nota: 'guarda o óleo'},
    {k: 'oil pump', nota: 'empurra o óleo', tone: 1},
  ]}
  volta="o óleo escorre de volta para o oil pan"
  caption="..."
/>
```

| Campo | O que faz |
|---|---|
| `k` | chave do termo (o nome que aparece, se não houver `texto`) |
| `texto` | nome mostrado, se diferente da chave |
| `nota` | o que acontece ali, em português |
| `tone` | 1, 2 ou 3: pinta o bloco |

## Biela, Coletores, Arrefecimento, Lubrificacao, PartidaCarga

Desenhos de peças, cada um equivalente a uma figura do livro (1-6, 1-23, 1-17,
1-18, 1-15 e 1-16). Só recebem `caption`; `PartidaCarga` recebe também
`modo="partida"` (padrão) ou `modo="carga"`. Os estilos e as peças comuns
(seta, figura com legenda, engrenagem) ficam em `src/components/diagramas/`
(`pecas.module.css` e `util.jsx`). Os tons de cada um estão no comentário do
topo do arquivo; em todos, o pontilhado na cor do texto é combustível.

O `Motor` também desenha o fuel injector: `injetor="indireto"` (antes do
intake port, injeção indireta) ou `injetor="direto"` (com a ponta dentro da
combustion chamber, GDI), com o rótulo clicável. Use com `rotulos="nenhum"`.


---

# Símbolos dos wiring diagrams e componentes (TRN-120, lições 9 a 11)

## Simbolos: a biblioteca

`src/components/Simbolos/desenhos.jsx` desenha cada símbolo **uma vez**, e
três componentes usam os mesmos desenhos: `TabelaSimbolos`, `FlashSimbolos` e
`Esquema` (e, por eles, `Rele` e `DiagramaNeblina`). Os desenhos seguem as
convenções comuns dos manuais, sem copiar figura de livro ou apostila.

- **Dois terminais** (`SIMBOLOS`): `bateria`, `lampada`, `filamento`,
  `motor`, `buzina`, `fusivel` (o S na caixinha, o das figuras do site),
  `fusivelS` (o S solto dos manuais americanos), `fusivelEuro`,
  `interruptor`, `disjuntor`, `resistor`, `resistorEuro`, `variavel`, `ntc`,
  `ptc`, `bobina`, `bobinaNucleo`, `capacitor`, `diodo`, `led`, `fotodiodo`. Cada um é desenhado
  deitado, com os terminais em x = ±30. `Peca` põe o símbolo no lugar e gira;
  os textos do símbolo (o M do motor, o −T do NTC) mudam de lugar com a
  rotação, mas não giram.
- **Especiais** (`ESPECIAIS`), cada um com o seu quadro: `massa`,
  `filamentoDuplo`, `rele`, `rele5`, `releDiodo`, `splice`, `cruzamento`,
  `conector`, `pinos`, `corDoFio`, `completo`, `incompleto`, `versoes`,
  `fusivelNumero`, `interruptorPosicoes`, `potenciometro`, `transformador`.
- `Rele` (o símbolo, exportado de `desenhos.jsx`) aceita `dx` (distância do
  meio até a coil e até o contact, para alinhar com os wires de um circuit),
  `acionado`, `cinco` (contact 87a) e `diodo`. A caixa é contínua: tracejada,
  no diagram, quer dizer componente incompleto.

Tons: azul (`1`) é a current, laranja (`2`) é a load — os papéis do
`Circuito`. Verde (`3`) é o campo magnético, só no `Eletroima` e no `Rele`.

## TabelaSimbolos

```mdx
import TabelaSimbolos from '@site/src/components/Simbolos';

<TabelaSimbolos itens={['bateria', 'fusivelS', 'fusivelEuro']} caption="..." />
```

Um cartão por símbolo: o desenho, o nome em inglês (botão `Termo`, com o
balão do português) e uma nota curta. Nomes e notas ficam em
`Simbolos/catalogo.js`; um símbolo novo precisa entrar no catálogo e no
`desenhos.jsx`. A grade quebra sozinha: três ou quatro por linha no
computador, dois no celular.

## FlashSimbolos

```mdx
<FlashSimbolos />                          {/* o catálogo inteiro */}
<FlashSimbolos itens={['diodo', 'led']} />  {/* só esses */}
```

Interativo: mostra o desenho, o aluno diz o nome, vira o cartão e marca
“Acertei” ou “Errei”. No fim, pode repetir só os errados. A primeira ordem é a
do catálogo (igual no build e no navegador); o embaralhamento acontece depois
que a página abre. O `fusivel` do site fica fora do padrão, porque seria o
mesmo cartão do `fusivelS`.

## Esquema

Circuit de um laço com qualquer símbolo de dois terminais: battery à
esquerda, `pecas` deitadas no wire de cima, `carga` em pé à direita, retorno
por wire ou pelo ground.

```mdx
<Esquema
  pecas={[{tipo: 'diodo', rotulo: '\\text{diode}', nota: '0.7\\,\\text{V}'}]}
  carga={{tipo: 'lampada', rotulo: '\\text{bulb}'}}
  corrente
  caption="..."
/>
```

| Prop | O que faz |
|---|---|
| `pecas` | lista de `{tipo, rotulo, nota, aberto, invertido}`; `aberto` é para o switch, `invertido` gira meia volta (diode ao contrário) |
| `carga` | `{tipo, rotulo, nota, invertido, brilho}`; `brilho` de 0 a 1 desenha os raios da bulb |
| `fonte` | LaTeX ao lado da battery (padrão `12\,\text{V}`) |
| `retorno` | `'fio'` (padrão) ou `'massa'` |
| `corrente`, `rotuloCorrente` | setas e rótulo; as setas não aparecem se um switch estiver aberto ou um diode/LED invertido |
| `caption` | texto simples |

A fonte dos rótulos cresce com a largura do desenho (a conta da
`Associacao`), para continuar legível no celular. Com três peças, os rótulos
de cima ficam a 112 de distância: rótulo mais longo que “resistor” encosta no
vizinho.

## Reostato

`<Reostato caption="..." />` — o `Esquema` de um rheostat em série com uma
bulb de 6 Ω, com um controle deslizante de 0 a 18 Ω (passos de 3 Ω). Mostra a
resistance, a current e a power da bulb; os raios da bulb crescem com a power.
Valores ilustrativos, escritos no próprio componente.

## CurvaTermistor

`<CurvaTermistor caption="..." />` — resistance contra temperatura, sem
números: o NTC (azul) cai, o PTC (laranja) sobe. `mostrar="ntc"` ou
`mostrar="ptc"` desenha uma curva só.

## CodigoCores

`<CodigoCores caption="..." />` — o resistor de quatro bands visto de perto:
as três primeiras agrupadas numa ponta, a da tolerance separada na outra, com
um número em cada band e a seta de “comece por aqui”.

As bands são desenhadas **sem cor**, de propósito. A cor de cada faixa é
conteúdo da tabela da lição, três tons são o limite dos diagramas da casa, e
um desenho que dependesse de distinguir vermelho de marrom deixaria de fora
justamente quem mais precisa confirmar o valor no ohmmeter. A figura ensina a
posição; a tabela ensina o valor.

## Eletroima

`<Eletroima tipo="fio" | "bobina" | "nucleo" caption="..." />` — o campo
magnético de um wire reto (anéis), de uma coil (linhas que atravessam a coil e
voltam por fora) e da coil com iron core (mais linhas, puxando um pedaço de
ferro). Os wires que levam a current passam por cima das linhas do campo com
uma borda da cor do papel, para não parecerem ligados a elas.

## Rele

```mdx
<Rele modo="corte" caption="..." />            {/* relay aberto, em repouso */}
<Rele modo="corte" acionado caption="..." />   {/* coil com current, contact fechado */}
<Rele modo="buzina" caption="..." />           {/* circuit da horn, botão solto */}
<Rele modo="buzina" acionado caption="..." />  {/* botão apertado: as duas currents */}
```

No corte, os pinos 30, 86, 85 e 87 ficam embaixo, e os nomes (spring,
armature, contacts, relay coil) à direita, com linha de chamada. No circuit da
horn, um fuse alimenta, por um splice, o control circuit (horn switch e coil)
e o load circuit (contact e horn). O nome “horn switch” fica à direita do
switch: à esquerda, encostava no + da battery.

## DiagramaNeblina

`<DiagramaNeblina caption="..." />` — o wiring diagram das fog lamps da lição
Electrical symbols, com fuse block tracejada, F12 15 A, splices S100 e S101,
fog lamp switch, relay, connectors C101 e C102, grounds G100, G101 e G102 e as
cores dos wires. Os códigos e as cores são ilustrativos, e a lição se apoia
neles: mudar um código aqui exige mudar o texto da lição.
