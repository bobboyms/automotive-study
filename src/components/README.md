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
| o circuit do practical em pé (top e bottom de cada peça) e as seis medições do midterm, com o dial e a entrada certos | `BancadaPratica` |
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
| o relay da Ford (pinos 2, 1, 3, 5, resistor na coil) na bancada: ohmmeter na coil, no contato, e ligado a uma bulb | `ReleBancada` |
| figura ou página do wiring diagram do service manual do Ford Edge, copiada para estudo | `FiguraManual` |
| dimmer com rheostat: mover o wiper e ver current e power mudarem (interativo) | `Reostato` |
| resistance do NTC e do PTC com a temperatura | `CurvaTermistor` |
| as quatro bands de um resistor: por onde começar a ler e a band separada da tolerance | `CodigoCores` |
| lead-acid battery em corte: uma cell, as seis em série, ou os riscos (gás e short) | `Bateria` |
| o surface discharge test: a fuga pela sujeira da tampa da battery | `DescargaSuperficial` |
| onde vai cada clamp do jump pack, e onde ele não vai | `JumpStart` |
| as três fases de um charge ao longo do tempo: bulk, absorption e float | `CurvaCarga` |
| solid e stranded wire em corte, as bitolas AWG comparadas, coaxial cable e twisted pair wire | `TiposDeWire` |
| chicote com conduit, grommet e clip; as duas metades de um connector; tirar um terminal do corpo | `Chicote` |
| crush zone e passenger compartment de lado; a mesma parada em duas distâncias | `Colisao` |
| air bag module em corte; o magnet-and-ball sensor; quem fala com quem no SRS | `AirBag` |
| reconhecer pela aparência: crosta de corrosion, case estufado, plate sulfatada | `Foto` |
| cylinder em corte no leakage test: o ar do tester e os quatro caminhos de vazamento (intake valve, exhaust valve, piston rings, head gasket) | `VazamentoCilindro` |
| cylinder em corte no compression test: o gauge no furo da plug e o piston subindo | `CompressaoNoCilindro` |
| as leituras de um compression test em barras, com a linha dos 75 % | `LeiturasCompressao` |
| o V6 visto de cima, com os cylinders numerados e os vizinhos que se tocam | `IdentificacaoCilindros` |
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

## BancadaPratica

O circuit do midterm practical da TRN-120 — battery, fuse, switch e duas bulbs
em série, voltando pelo ground — e as seis medições que o instrutor pede nele.
Usado na lição
[As seis medições na bancada](../../docs/trn-120-eletricidade/09-prova-pratica.mdx).

```mdx
{/* o caminho da power, com o top e o bottom de cada peça */}
<BancadaPratica modo="fluxo" caption="..." />

{/* a conferência dos fuses do próprio meter */}
<BancadaPratica modo="fusiveis" caption="..." />

{/* as cinco medições */}
<BancadaPratica modo="fonte" leitura="12\,\text{V}" caption="..." />
<BancadaPratica modo="disponivel" alvo="bulb1" leitura="12\,\text{V}" caption="..." />
<BancadaPratica modo="queda" alvo="switch" leitura="0.0\,\text{V}" caption="..." />
<BancadaPratica modo="resistencia" alvo="switch" leitura="0.3\,\Omega" caption="..." />
<BancadaPratica modo="corrente" leitura="0.25\,\text{A}" caption="..." />
```

| Prop | O que faz |
|---|---|
| `modo` | `'fluxo'` (padrão, sem meter: só o circuit, com top e bottom), `'fusiveis'`, `'fonte'`, `'disponivel'`, `'queda'`, `'resistencia'` ou `'corrente'` |
| `alvo` | a peça medida em `disponivel`, `queda` e `resistencia`: `'fuse'`, `'switch'`, `'bulb1'` (padrão) ou `'bulb2'` |
| `leitura` | LaTeX no visor |
| `caption` | **texto simples** |

**Por que o circuit é desenhado em pé**, e não deitado como no `Medicao`: o
instrutor chama **top** o terminal por onde a power entra numa peça e
**bottom** aquele por onde ela sai. Os dois nomes só ficam óbvios se a power
descer na página; deitado, o aluno teria de decorar que “top” quer dizer “o
lado da esquerda”.

Decisões de desenho que as figuras dependem — mexer numa delas exige rodar
`npm run figuras` de novo:

- **Cada modo tem a sua largura** (`W_FLUXO`, `W_CIRCUITO`, `W_SOZINHO`),
  encostada no que ele desenha. A primeira versão desenhava tudo em 520 e o
  circuit sozinho ocupava 360 deles: a sobra à direita encolhia a figura no
  celular sem motivo.
- **O meter fica todo à direita do circuit**, e por isso nenhuma ponta de prova
  cruza um fio. Quando a vermelha precisa cruzar a preta, passa por cima com a
  borda da cor do fundo (`casing`), como no `Medicao`.
- **Os contatos do switch ficam 14 para dentro dos terminais.** Sem esse recuo,
  as duas pontas de prova da voltage drop pousam em cima dos dois contatos,
  tapam os dois, e o switch vira uma linha reta igual à de um wire.
- **Na conferência dos fuses, a entrada A não é preenchida de vermelho**: a
  ponta de prova é desenhada como uma cunha encostando nela. Um furo vermelho
  no A leria como “a lead está plugada aqui também”, que é o contrário do que
  a conferência manda fazer.
- **O dial** mostra a função escolhida com um ponteiro e o nome ao lado
  (`volts DC`, `ohms`, `amps`): é metade da instrução de cada medição.

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

## VazamentoCilindro

Cylinder em corte no cylinder leakage test: piston no TDC, as duas valves
fechadas, o furo da spark plug aberto e os quatro caminhos do ar que vaza
(intake valve → throttle body, exhaust valve → tailpipe, piston rings →
crankcase, head gasket → cylinder vizinho). Tom 1 é o ar do tester; tom 2 é o ar
que vaza.

```mdx
<VazamentoCilindro caption="..." />
```

## CompressaoNoCilindro

Cylinder em corte no compression test: o compression gauge e o adapter no furo da
spark plug, as duas valves fechadas e o piston subindo no compression stroke. Tom
1 é o ar que o piston aperta e leva ao gauge; tom 2 é o ar que escapa pelos
rings.

```mdx
<CompressaoNoCilindro caption="..." />
```

## LeiturasCompressao

Gráfico de barras das leituras de um compression test, uma barra por cylinder,
com uma linha tracejada em 75 % da maior leitura. Tom 1 é o cylinder dentro do
limite; tom 2 é o cylinder abaixo. A escala é fixa (0 a 200 psi).

```mdx
<LeiturasCompressao leituras={[188, 190, 186, 189, 118, 121]} caption="..." />
```

## IdentificacaoCilindros

O engine V6 3.5L visto de cima, com um bank de cylinders 1-2-3 e o outro 4-5-6,
redesenhado a partir da figura “Engine Cylinder Identification” do manual
(303-01C). `destaque` pinta de tom 2 os cylinders da queixa.

```mdx
<IdentificacaoCilindros destaque={[5, 6]} caption="..." />
```

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
  `acionado`, `cinco` (contact 87a), `diodo`, `resistor` (o resistor em
  paralelo com a coil do símbolo da Ford) e `nomes` (os números dos pinos, na
  ordem coil em cima, coil embaixo, contato em cima, contato embaixo, 87a; a
  Ford usa `['2', '1', '3', '5']`). A caixa é contínua: tracejada, no diagram,
  quer dizer componente incompleto.

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

## ReleBancada

O horn relay do Ford Edge fora do carro, com a numeração da Ford (coil 2 e 1,
contato 3 e 5) e o resistor em paralelo com a coil. Usado na lição
[Testar um relay com o service manual](../../docs/trn-120-eletricidade/30-testar-relay-com-service-manual.mdx).

```mdx
<ReleBancada modo="bobina" leitura="71.6\,\Omega" caption="..." />      {/* ohmmeter na coil, 2 e 1 */}
<ReleBancada modo="contato" leitura="\text{OL}" caption="..." />        {/* ohmmeter no contato, 3 e 5 */}
<ReleBancada modo="contato" acionado leitura="0.1\,\Omega" />           {/* o mesmo, com 12 V na coil */}
<ReleBancada modo="bancada" caption="..." />                            {/* battery, relay e bulb; jumper do pino 1 solto */}
<ReleBancada modo="bancada" acionado caption="..." />                   {/* jumper ligado: a bulb acende */}
```

O meter fica em cima, à direita. A ponta vermelha chega ao pino de cima por
cima do relay e a preta ao pino de baixo por baixo, para nenhuma das duas
cruzar um wire. Na bancada, o jumper do pino 1 ao ground faz o papel do FET
do BCM: solto, ele aparece como duas pontas abertas.

## FiguraManual

Figura do service manual do Ford Edge, copiada para estudo, em
`static/img/manual-edge/<id>.jpg`. O crédito sai sozinho embaixo da legenda, e
tocar na figura abre o arquivo em tamanho cheio (no celular, é assim que se dá
zoom num wiring diagram).

```mdx
<FiguraManual id="E198668" alt="..." caption="..." largura={400} />
<FiguraManual id="wd-044-002-rele" titulo="Wiring diagram, célula 44, página 2 (recorte)." alt="..." caption="..." />
```

As figuras com número (E198668) são copiadas do manual como estão. As páginas
do wiring diagram vêm em SVG no manual e não têm número: elas são renderizadas
no Chrome e recortadas (arquivo `wd-<célula>-<página>-<parte>.jpg`), e
`titulo` diz de onde vieram. Recorte uma parte por figura, do tamanho que o
texto explica: a página inteira fica ilegível no celular.

## DiagramaNeblina

`<DiagramaNeblina caption="..." />` — o wiring diagram das fog lamps da lição
Electrical symbols, com fuse block tracejada, F12 15 A, splices S100 e S101,
fog lamp switch, relay, connectors C101 e C102, grounds G100, G101 e G102 e as
cores dos wires. Os códigos e as cores são ilustrativos, e a lição se apoia
neles: mudar um código aqui exige mudar o texto da lição.

## Instrumentos

`<Instrumentos caption="..." />` — o mesmo ponto de teste medido por dois
instrumentos: o multimeter, que puxa 1.2 µA, e a test light, que puxa 0.25 A.
É a figura central da lição **Outros instrumentos de teste**: o instrumento
escolhido muda o que o circuit faz, e por isso muda a resposta.

Tom 2 só na test light, que é a que carrega o circuit; o multimeter fica na
cor do texto. Os dois valores são ilustrativos (multimeter de 10 MΩ, test
light de 3 W) e aparecem calculados na lição — mudar um aqui exige mudar o
exemplo resolvido de lá.

Não recebe props além de `caption`.

## Oscilograma

`<Oscilograma falha pontos caption="..." />` — a tela do oscilloscope: a
voltage de um sensor (vertical) ao longo do tempo (horizontal). A linha sobe
como a do TPS abrindo e, no meio, cai quase a zero por um instante — o ponto
morto da trilha do potentiometer.

| Prop | Padrão | O que faz |
|---|---|---|
| `falha` | `true` | desenha a queda e o anel tracejado que a marca |
| `pontos` | `false` | marca por cima as leituras do scan tool |
| `caption` | — | a legenda |

A lição **Scan tool e oscilloscope** usa as duas versões em sequência: sem
`pontos`, para mostrar o defeito; com `pontos`, para mostrar que nenhuma
leitura do scan tool caiu dentro dele. As leituras ficam na constante
`amostras`, escolhidas de propósito para passar ao largo da queda: é esse o
ponto da figura, e mexer nelas desfaz o argumento da lição.

Tom 2 (laranja) é o sinal; tom 3 (verde) marca o defeito, como no `Circuito`.

## Strands

`<Strands caption="..." />` — o wire em corte, duas vezes: à esquerda o feixe
inteiro de 18 strands, à direita o mesmo wire depois de um descasque que
cortou metade deles. Os cortados ficam no tom 3, em contorno tracejado, para
lerem como “não estão mais aqui”.

A figura ensina duas coisas de uma vez, e as duas estão na lição **Reparar um
wire**: sobrou metade do cobre para conduzir (a resistance daquele trecho
dobra, de 0.02 Ω para 0.04 Ω, valores ilustrativos) e sobrou metade do fio
para aguentar a vibração.

O feixe é hexagonal, montado pela constante `LINHAS` (`[4, 5, 5, 4]`). O
número de linhas tem que permitir um corte pela metade exata — `LINHAS` com
soma ímpar quebra a correspondência com o texto da lição.

Não recebe props além de `caption`.

---

# Wiring (TRN-120, tópico 8)

## TiposDeWire

```mdx
<TiposDeWire modo="condutor" caption="..." />  {/* solid e stranded */}
<TiposDeWire modo="bitola" caption="..." />    {/* 10, 14 e 18 AWG */}
<TiposDeWire modo="cabos" caption="..." />     {/* coaxial e twisted pair */}
```

As três figuras da lição
[Tipos de wire e wire gauge](../../docs/trn-120-eletricidade/25-tipos-de-wire-e-bitola.mdx).
Nenhuma usa tom: as três são anatomia, não caminho de current nem defeito. Os
tons ficam reservados para as figuras que mostram o que a mão faz e onde está
a falha.

| `modo` | O que mostra |
|---|---|
| `'condutor'` (padrão) | o mesmo diâmetro externo com um condutor maciço e com um feixe de 13 strands, e os rótulos `conductor` e `insulation` |
| `'bitola'` | 10, 14 e 18 AWG em corte, na mesma escala de px por mm, com o diâmetro real do cobre embaixo |
| `'cabos'` | coaxial cable em corte e twisted pair wire visto de lado |

Quatro decisões de desenho que as figuras dependem:

- **A escala de `bitola` é px por mm, igual para os três.** Os diâmetros vêm
  da própria escala AWG (2.588, 1.628 e 1.024 mm), e por isso a comparação de
  área que a lição faz com a conta bate com o que o olho vê.
- **O 18 AWG leva capa grossa de propósito**, até ficar com o mesmo diâmetro
  externo do 14 AWG. É assim que a figura ensina que a bitola é só o cobre —
  o erro comum que a lição trata.
- **No coaxial, shield e conductor dividem o mesmo preenchimento**, porque os
  dois são metal; a capa externa e o isolamento de dentro dividem o outro. Com
  um terceiro preenchimento só para o shield, o condutor central ficava pálido
  demais e lia como vazio.
- **No twisted pair, os dois fios são interrompidos alternadamente** nos
  cruzamentos: no primeiro some o de baixo, no seguinte o de cima. Com os dois
  inteiros, o desenho parecia uma corrente de elos, não uma trança.

## Chicote

```mdx
<Chicote modo="protecao" caption="..." />  {/* conduit, tie, grommet, clip */}
<Chicote modo="conector" caption="..." />  {/* as duas connector halves */}
<Chicote modo="terminal" caption="..." />  {/* tirar o terminal do corpo */}
```

As três figuras da lição
[O wiring harness](../../docs/trn-120-eletricidade/26-chicote-terminals-e-connectors.mdx).
Um tom só, o **1** (azul), e sempre para a mesma coisa: **o que a mão faz** —
a seta de apertar a trava, a ferramenta e o puxão no wire. Peça, chapa e
chicote ficam na cor do texto.

| `modo` | O que mostra |
|---|---|
| `'conector'` (padrão) | as duas metades separadas, com o tracejado ligando cada pino à sua cavidade, e a locking tab com a seta de apertar |
| `'terminal'` | o corpo em corte, a locking tab interna encaixada na janela do terminal, a ferramenta entrando pela frente e o puxão no wire |
| `'protecao'` | conduit com nervuras, wire tie, a chapa em corte com o grommet forrando o furo, e o clip |

Quatro decisões de desenho, todas vindas da folha de conferência:

- **A chapa de `protecao` vai de borda a borda do viewBox.** Recortada no meio
  da altura, ela lia como dois postes; tocando as bordas, lê como parede.
- **O chicote atravessa o furo inteiro**, e o grommet são as duas peças de
  borracha que forram a borda. Desenhar o chicote interrompido na chapa fazia
  parecer que ele acabava ali.
- **O clip é uma cinta opaca com um pé**, e não um quadro em volta dos wires:
  o quadro cruzava os três wires nas laterais e lia como ligação.
- **Em `terminal`, a parede da frente é aberta** na altura da cavidade. Com ela
  fechada, a ferramenta parecia atravessar o plástico. E a tab entra numa
  **janela** do terminal: encostada no topo do metal, ela não mostrava o que
  prende o terminal no lugar.

---

# Restraint systems (TRN-120, tópico 9)

## Colisao

A colisão vista de dois jeitos, nas lições
[O restraint system](../../docs/trn-120-eletricidade/27-restraint-system-e-air-bag.mdx)
e seguinte.

```jsx
<Colisao modo="zonas" caption="..." />   {/* crush zones e habitáculo */}
<Colisao modo="parada" caption="..." />  {/* a mesma parada em 0.50 m e em 0.05 m */}
```

Um tom só, o 1, e com o mesmo sentido nos dois modos: **o que cede**. Em
`zonas` é a lata que amassa de propósito; em `parada` é o caminho que o corpo
ainda percorre depois que o veículo já parou.

Quatro decisões de desenho que vale a pena não desfazer:

- **As duas setas de `parada` estão na mesma escala**: 234 px valem 0.50 m e
  23 px valem 0.05 m. É a razão de dez entre os comprimentos que ensina a
  razão de dez entre as forças. Encurtar a de cima para "caber melhor" destrói
  o argumento da figura.
- **Os dois corpos partem do mesmo ponto**, e não chegam ao mesmo ponto. A
  primeira versão alinhava as chegadas e a de baixo ficava com o boneco em
  cima do rótulo da distância.
- **Em `zonas`, o habitáculo é um traço contínuo só** — assoalho, colunas e
  teto —, porque é assim que ele trabalha: uma caixa. A primeira versão tinha
  a carroceria baixa demais e o desenho lia como uma caixa sobre uma prancha;
  a linha de cintura em `y = 112` resolveu.
- **Os rótulos `crush zone` apontam para o meio da área sombreada**, não para
  a borda de baixo: na borda, o ponto da chamada se confundia com a linha do
  assoalho e com a roda.

## AirBag

O restraint system por dentro, em três figuras, nas lições 27 e 28.

```jsx
<AirBag modo="modulo" caption="..." />    {/* o módulo em corte */}
<AirBag modo="sensor" caption="..." />    {/* o magnet-and-ball sensor */}
<AirBag modo="circuito" caption="..." />  {/* sensors, módulo, squib e lamp */}
```

Um tom só, o 1: em `sensor` é o movimento da ball, em `circuito` é o sinal
que atravessa os blocos. Peça e carcaça ficam na cor do texto.

Quatro decisões de desenho:

- **A trim cover é uma faixa com espessura, não uma linha.** Desenhada como um
  fio curvo, ela parecia uma tampa flutuando acima do módulo. A costura é um
  entalhe em V **dentro** da faixa — na primeira versão ele ficava acima da
  curva, solto no ar.
- **Em `sensor`, os dois contatos são lâminas horizontais, uma em cima e outra
  embaixo**, e a ball fecha o circuit encostando nas duas. Lado a lado, como
  na primeira versão, os wires de saída precisavam cruzar um contato para
  sair, e os contatos ficavam desalinhados da altura da ball.
- **A ball encosta no magnet.** Com a folga de quatro pixels da primeira
  versão, a figura dizia o contrário do texto: que nada segurava a ball.
- **`gas generant` é rótulo de duas linhas.** Em uma linha ele passava da
  borda direita do viewBox e saía cortado — o desenho tem 480 de largura e o
  rótulo começa em 400.

---

# Battery (TRN-120, tópico 7)

## Bateria

A lead-acid battery em corte, em três figuras. Usada nas lições
[Segurança com a battery](../../docs/trn-120-eletricidade/21-seguranca-da-battery.mdx)
e [A battery por dentro](../../docs/trn-120-eletricidade/22-a-battery-por-dentro.mdx).

```mdx
<Bateria modo="celula" caption="..." />   {/* uma cell por dentro */}
<Bateria modo="bateria" caption="..." />  {/* as seis cells em série */}
<Bateria modo="risco" caption="..." />    {/* o gás e o short circuit */}
```

| `modo` | O que mostra |
|---|---|
| `'celula'` (padrão) | uma cell: positive plates, negative plates, separators, electrolyte, os dois straps e os 2.1 V entre eles |
| `'bateria'` | as seis cells em série dentro do battery case, com os cell straps, os dois terminals e `6 × 2.1 V = 12.6 V` |
| `'risco'` | uma chave de boca caída sobre os dois terminals, a current do short e a faísca; o hydrogen gas saindo pela vent cap; o electrolyte embaixo |

Tons: 1 (azul) é o líquido e a current; 2 (laranja) é a positive plate e a
faísca; 3 (verde) é o gás, que aqui é o perigo.

Três decisões de desenho que as figuras dependem:

- **Três preenchimentos diferentes para três materiais**: positive plate
  laranja, negative plate cinza escuro (`escuro`), separator na cor do papel
  (`vazio`). A primeira versão usava cinza claro na negative plate e cinza
  médio no separator, e os dois se confundiam na folha de conferência.
- **As positive plates atravessam o strap negativo sem tocá-lo.** Um retângulo
  da cor do papel abre o vão por onde cada uma passa — a regra do cruzamento
  sem ligação da seção “Conferência obrigatória”.
- **No modo `risco`, a vent cap fica no canto direito do cover**, e não no
  meio: no meio, a coluna de bolhas subiria em cima da chave de boca.

## DescargaSuperficial

`<DescargaSuperficial caption="..." />` — o surface discharge test da lição
[Manutenção da battery](../../docs/trn-120-eletricidade/23-manutencao-da-battery.mdx):
a ponta vermelha no positive terminal, a ponta preta correndo pela tampa suja,
e o caminho de fuga tracejado ligando um terminal ao outro por fora. O tom 3
(verde) é o caminho da fuga, que é o defeito; o tom 2, a ponta vermelha, como
no `Medicao`.

A leitura de 0.2 V é ligada ao caminho por um traço fino. Solta no canto, ela
parecia um número sem dono. O valor é o limite usual de referência, e a lição
diz isso. Não recebe props além de `caption`.

## JumpStart

`<JumpStart caption="..." />` — onde vai cada clamp do jump pack num veículo
de negative ground, na lição
[Jump start e memory saver](../../docs/trn-120-eletricidade/24-jump-start-e-memory-saver.mdx):
(1) o clamp vermelho no positive terminal, (2) o clamp preto no metal do
engine block, longe da battery. O negative terminal leva um X no tom 3 — o
lugar onde o clamp preto **não** vai.

Duas decisões de desenho:

- **os clamps ficam encostados no post, não por cima dele.** Tapando o post, a
  figura deixava de mostrar justamente o que ela ensina;
- **o rótulo “não aqui” usa `anchor="start"`**, para a linha de chamada sair da
  esquerda do texto em direção ao post. Com `anchor="end"`, o `RotuloTermo`
  começa a linha à direita do texto, e ela atravessava o rótulo por trás.

Não recebe props além de `caption`.

## CurvaCarga

`<CurvaCarga caption="..." />` — as três fases de um smart charger ao longo do
tempo, na lição
[Carregar a battery](../../docs/trn-120-eletricidade/25-carregar-a-battery.mdx):
a voltage (tom 1) sobe na bulk, fica presa no teto durante a absorption e cai
para o nível de manutenção na float; a current (tom 2) fica alta na bulk, cai
aos poucos na absorption — o taper — e termina perto de zero.

As duas curvas saem de `V_PONTOS` e `I_PONTOS`, pares `[t, fração da altura]`
interpolados linearmente, como no `Oscilograma`. As divisas tracejadas em
`DIVISAS` ficam **no meio da transição de cada curva**: postas no começo ou no
fim da rampa, a figura passava a dizer que a fase muda depois que a curva já
mudou.

Quatro decisões de desenho:

- **largura 470, como a do `Oscilograma`.** A primeira versão tinha 620, e aí
  o rótulo de 13 px caía para 7.5 px efetivos na coluna do celular (`fs × 358
  ÷ W`), bem abaixo do mínimo legível. Gráfico largo é a armadilha: ele cabe
  no computador e some no celular;
- **a cauda da current para em 0.11 da altura, não em 0.06.** O rótulo
  `current` fica na ponta da curva, e perto demais do eixo ele era lido como
  rótulo da seta do tempo;
- **o eixo vertical é “alto” e “baixo”, sem número.** voltage e current não
  têm a mesma unidade, e pôr escala em uma delas faria a outra mentir — a
  legenda da lição diz isso em palavras;
- **o nome de cada fase é `RotuloTermo` com `chaveDoTermo`**, embaixo do eixo:
  os três são termos do dicionário, e o aluno toca neles ali mesmo.

Não recebe props além de `caption`.

---

# Fotos

## Foto

```mdx
import Foto from '@site/src/components/Foto';

<Foto k="terminal-corroido" caption="..." />
```

| Prop | O que faz |
|---|---|
| `k` | chave em `src/data/fotos.json`, que guarda o arquivo, o texto alternativo, as medidas e o crédito |
| `caption` | a legenda, em texto simples |
| `largura` | largura máxima em px, se a do `fotos.json` não servir naquela página |

**Quando foto e quando desenho.** Desenho ensina estrutura, caminho e ordem:
ele escolhe o que mostrar, tem rótulo clicável, três tons e funciona no tema
escuro. Foto ensina a **reconhecer pela aparência** — a crosta de corrosion, o
case estufado, a plate sulfatada —, e isso um SVG não entrega, porque cor e
textura são o conteúdo. Lição boa usa as duas na sequência: o desenho explica,
a foto mostra o que vai aparecer no pátio.

**Licença.** O repositório é público, então entra só foto do próprio aluno ou
com licença livre que permita redistribuição. Nada de figura de livro, de
apostila ou de manual — vale a mesma regra do `CLAUDE.md`, seção “Material de
aula”. O crédito é montado pelo componente a partir do `fotos.json`: autor com
link para a página de origem, Wikimedia Commons, a licença com link, e o que
foi alterado. Nenhuma lição escreve isso à mão, e por isso nenhuma esquece.

**Antes de commitar uma foto nova:**

- confira a licença **na página do arquivo**, não no resultado de busca;
- redimensione para no máximo 1000 px no lado maior e salve em JPEG de
  qualidade 82, progressivo (as quatro atuais ficaram entre 70 e 170 KB);
- **apague o EXIF** — a foto do terminal corroído vinha com coordenadas de GPS
  do celular de quem tirou. `ImageOps.exif_transpose` seguido de `save` resolve:
  aplica a rotação e descarta o resto;
- escreva uma legenda que diga **o que olhar**, e não só o que é. "A crosta é
  branca, azulada ou esverdeada, e cresce por baixo da garra" ensina; "terminal
  corroído" não;
- se a foto não for exatamente do objeto da lição — a do case estufado é de uma
  battery selada menor que a do carro —, **diga isso na legenda**.

As fotos entram em `static/img/<assunto>/` e são capturadas pelo
`npm run figuras` como qualquer `<figure>`: confira no claro, no escuro, no
celular e no Safari, que é onde se vê se a borda está segurando a foto no tema
escuro.
