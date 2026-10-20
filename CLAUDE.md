# CLAUDE.md

Este repositório é um material de estudo em português, publicado como site
Docusaurus, que acompanha o programa **Automotive Systems Technology** (AAS
A60160) da Wake Tech Community College. Ele é escrito para um adulto que cursa
o programa e estuda boa parte do conteúdo sozinho. As aulas, os manuais de
serviço e as provas ASE são em inglês: o material explica em português e ensina
os termos em inglês junto.

**As diretrizes didáticas — perfil do aluno, método de ensino, segurança,
raciocínio de diagnóstico, estrutura de lição, exercícios e gabarito — estão na
skill `tutor-automotivo`** (`.claude/skills/tutor-automotivo/`). Leia o
`SKILL.md` antes de escrever, revisar ou explicar qualquer conteúdo técnico, e o
`escrever-licao.md` antes de tocar numa página de `docs/`. Este arquivo cobre o
programa e o funcionamento técnico do repositório.

## Estado do repositório

O site foi montado a partir do projeto anterior de curso de matemática
(`../math_study`), do qual vieram a configuração do Docusaurus, a paleta de
cores dos diagramas, o `SvgMath` e o quadro branco. Conteúdo pronto: os tópicos
1 e 2 da TRN-120 (sete lições).

Repositório público: `https://github.com/bobboyms/automotive-study`. Todo push
na `main` publica o site no GitHub Pages pelo workflow
`.github/workflows/deploy.yml`, em `https://bobboyms.github.io/automotive-study/`.
Como o repositório é público, nada de material da Wake Tech (`material/`) nem
do caderno do aluno vai para ele — os dois estão no `.gitignore`.

## Referência rápida

- **Idioma:** português com acentuação completa; todo termo técnico também em
  inglês na primeira aparição. Nomes de arquivo em ASCII.
- **Nunca invente especificação** (torque, folga, pressão, resistência,
  capacidade). Especificação vem do manual do veículo; valor usado para ensinar
  é marcado como ilustrativo.
- **Segurança vem antes do procedimento.** Todo passo com risco traz o aviso
  antes, nunca depois.
- **Toda conta, conversão de unidade e gabarito são conferidos por cálculo**,
  nunca de cabeça.
- **O prefixo numérico do arquivo não faz parte do id.** `03-lei-de-ohm.md` tem
  o id `lei-de-ohm`.
- **`npm run build` precisa passar** antes de considerar qualquer tarefa pronta.

## O programa

Fonte: Program Planning Guide A60160, revisão FA2026
(`https://www.waketech.edu/sites/default/files/planning-guides/A60160-Fall.pdf`)
e a página de descrição das disciplinas AUT
(`https://www.waketech.edu/programs-courses/credit/automotive-systems-technology/classes/AUT`).
Se o guia for revisado, atualize esta seção a partir da fonte, não de memória.

O programa é acreditado pela ASE Education Foundation nas oito áreas da
certificação Master. Entrada no outono ou na primavera.

### Em andamento

**Outubro de 2026:** o aluno cursa **TRN-120** e **AUT-116**. São as
prioridades do material: as primeiras lições devem servir a essas duas
disciplinas. Atualize esta linha quando o semestre mudar.

### Sequência oficial (65 créditos)

| Sem. | Disciplina | Título | Créd. |
|---|---|---|---|
| 1 | AUT-114 | Safety and Emissions | 2 |
| 1 | AUT-116 | Engine Repair | 3 |
| 1 | TRN-110 | Introduction to Transport Technology | 2 |
| 1 | TRN-170 | PC Skills for Transportation | 2 |
| 1 | MAT-110 | Math Measurement and Literacy | 3 |
| 2 | AUT-141 | Suspension & Steering Systems | 3 |
| 2 | AUT-151 | Brake Systems | 3 |
| 2 | TRN-120 | Basic Transportation Electricity | 5 |
| 2 | ENG-110 | Workplace Writing Essentials | 3 |
| 3 | AUT-123 | Powertrain Diagnosis & Service | 2 |
| 3 | AUT-213 | Automotive Servicing II | 2 |
| 3 | TRN-140 | Transportation Climate Control | 2 |
| 3 | HUM-121 | The Nature of America | 3 |
| 4 | AUT-181 | Engine Performance I | 3 |
| 4 | AUT-183 | Engine Performance II | 4 |
| 4 | AUT-231 | Manual Transm/Transaxles/Drive Trains | 3 |
| 4 | PSY-118 | Interpersonal Psychology | 3 |
| 5 | AUT-221 | Automatic Transmissions/Transaxles | 3 |
| 5 | AUT-281 | Advanced Engine Performance | 3 |
| 5 | COM-120 | Intro to Interpersonal Communication | 3 |

Mais **8 créditos de eletivas** (2 por semestre nos semestres 1, 2, 4 e 5),
escolhidas entre: laboratórios extras das disciplinas AUT e TRN (`116A`,
`141A`, `151A`, `181A`, `221A`, `TRN-120A`, `TRN-140A`), veículos elétricos e
híbridos (`EVX-110`, `115`, `120`, `130`, `240`), ADAS (`TRN-150`), diesel
(`HET-134`), solda (`TRN-180`), funilaria e pintura (`AUB`) e estágio
(`WBL`).

O material cobre as disciplinas técnicas (AUT, TRN, EVX). As de formação geral
(ENG, HUM, PSY, COM) ficam fora; MAT-110 entra só no que serve à oficina —
medição, conversão de unidades, leitura de instrumentos.

### Disciplinas e áreas ASE

A Wake Tech **não publica** este mapeamento; ele foi inferido pelos títulos e
descrições das disciplinas. Use-o para orientar a preparação, e não o apresente
ao aluno como informação oficial.

| Área ASE | Disciplinas |
|---|---|
| A1 Engine Repair | AUT-116 |
| A2 Automatic Transmission/Transaxle | AUT-221, AUT-123 |
| A3 Manual Drive Train and Axles | AUT-231, AUT-123 |
| A4 Suspension and Steering | AUT-141 |
| A5 Brakes | AUT-151 |
| A6 Electrical/Electronic Systems | TRN-120 |
| A7 Heating and Air Conditioning | TRN-140 (mais a certificação EPA 609) |
| A8 Engine Performance | AUT-181, AUT-183, AUT-281 |
| L1 Advanced Engine Performance | AUT-281 |
| L3 Light Duty Hybrid/Electric | EVX |
| G1 Maintenance and Light Repair | AUT-213 e o conjunto |

AUT-114 prepara para a inspeção estadual de segurança e emissões da Carolina do
Norte, não para uma área ASE.

## Idioma e escrita

- Todo o texto visível é em **português com acentuação e cedilha completas**.
- **Termos em inglês.** Na primeira aparição do termo na página, escreva o
  português em negrito e o inglês em itálico entre parênteses: **pastilha de
  freio** (*brake pad*). Daí em diante, use o português. O aluno precisa
  reconhecer o termo em inglês na aula, no manual e na prova, então esse par
  não é opcional.
- **Termos que a oficina usa em inglês** — *scan tool*, DTC, OBD-II, *freeze
  frame* — ficam em inglês, explicados na primeira aparição.
- **Siglas:** expanda em inglês e traduza: **PCM** (*Powertrain Control
  Module*, módulo de controle do trem de força).
- **Nomes de arquivo e ids** são ASCII, minúsculos, com hífen e sem acento:
  `05-queda-de-tensao.md`, `aut-116-motor`.
- Aspas tipográficas (`“ ”`) e travessão (`—`) são bem-vindos no texto.

## Sistema do projeto

### Estrutura

- Conteúdo de estudo em `docs/`, **uma pasta por disciplina**, com o código no
  nome: `docs/trn-120-eletricidade/`, `docs/aut-116-motor/`,
  `docs/aut-151-freios/`. Cada pasta tem um `index.md` com o roteiro das lições,
  a descrição oficial da disciplina (citação curta, em inglês) e a área ASE
  correspondente.
- `docs/glossario.md` reúne os termos de todas as lições (português, inglês,
  uma linha de definição).
- `docs/intro.md` é a raiz do site (`slug: /`).
- `.md` para páginas de texto. `.mdx` apenas quando a página importa um
  componente React.
- Componentes visuais em `src/components/<Nome>/index.jsx`, documentados em
  `src/components/README.md` — leia esse arquivo antes de desenhar qualquer
  coisa numa lição.

### Material de aula

Slides, *job sheets*, apostilas e PDFs que o aluno trouxer da Wake Tech ficam
em `material/`, pasta **ignorada pelo git e fora do build**. Eles servem de
referência — para alinhar o vocabulário e a ordem do material com a aula —, mas
o conteúdo deles **não é copiado** para `docs/`: é material protegido por
direito autoral. O mesmo vale para figuras de livro e de manual: redesenhe em
SVG.

### Nomes de arquivo, ids e URLs

O Docusaurus **remove o prefixo numérico** ao gerar o id e a URL. Essa é a fonte
de erro mais comum:

| Arquivo | id (usado em `sidebars.js`) | URL |
|---|---|---|
| `docs/trn-120-eletricidade/03-lei-de-ohm.md` | `trn-120-eletricidade/lei-de-ohm` | `/trn-120-eletricidade/lei-de-ohm` |

Dois pontos que decorrem disso:

- **Nunca escreva o prefixo numérico em `sidebars.js`** — o build quebra.
- **Não existe `/docs/` na URL.** O `routeBasePath` é `/`. O site fica sob o
  `baseUrl` `/automotive-study/`, inclusive no `npm run start`:
  `http://localhost:3000/automotive-study/trn-120-eletricidade/lei-de-ohm`.

O prefixo numérico serve só para manter os arquivos em ordem de leitura no
diretório.

### Frontmatter

Toda página começa com, no mínimo:

```md
---
title: Lei de Ohm
---
```

O `title` é o `<h1>` da aba e do SEO; repita-o como `# Título` na primeira linha
do corpo. Se o título ficar longo demais para a barra lateral, use
`sidebar_label` no frontmatter em vez de encurtar o `title`.

### Barra lateral

`sidebars.js` não é gerado automaticamente. Toda página nova precisa ser
adicionada lá, ou ela existe no site sem nenhum caminho de navegação até ela.

Cada disciplina é uma categoria com o código e o nome em português
(`'TRN-120 — Eletricidade básica'`). As lições dentro dela são numeradas à mão:
`'3. Lei de Ohm'`. Esses números **não** têm relação com o prefixo do arquivo —
mantê-los sincronizados é responsabilidade de quem edita.

### Inserir uma lição no meio de uma disciplina

É uma operação de três partes; fazer só uma delas deixa a disciplina
inconsistente:

1. renomear os arquivos seguintes para abrir o número (`git mv`, para preservar
   histórico);
2. renumerar os rótulos em `sidebars.js` e inserir a entrada nova;
3. atualizar o roteiro e os links em `docs/<disciplina>/index.md`.

### Links entre páginas

`onBrokenLinks` fica em `'throw'`: um link errado **derruba o build**, não gera
apenas um aviso.

O formato é relativo e sem o prefixo numérico:

```md
[Lei de Ohm](./lei-de-ohm)
[Queda de tensão](../trn-120-eletricidade/queda-de-tensao)
```

### Comandos

```bash
npm run start   # servidor local em http://localhost:3000
npm run build   # validação de verdade: links, MDX, sidebar
npm run clear   # limpa cache quando o start fica com conteúdo velho
npm run quadro  # quadro branco do aluno em http://localhost:4123
```

Se o build estourar com `Ineffective mark-compacts near heap limit`, rode
`npm run clear` e depois `NODE_OPTIONS=--max-old-space-size=10240 npm run build`.

## Caderno do aluno

`caderno/` é onde o aluno resolve exercícios — não é conteúdo do site e não
participa do build. `npm run quadro` sobe um quadro branco local cujo botão
"Salvar para correção" grava PNGs em `caderno/imagens/` (pasta ignorada pelo
git). O aluno também pode deixar em `caderno/` fotos e textos: tarefas,
*job sheets* preenchidas, um raciocínio de diagnóstico. A correção desse
material é o trabalho da skill `corrigir`. Não edite nem apague os arquivos do
caderno — são o registro do aluno.

## Fórmulas, unidades e notação

Fórmulas usam LaTeX renderizado por KaTeX (`remark-math` + `rehype-katex`).

```md
Inline: $V = I \times R$

Bloco:

$$
P = V \times I
$$
```

### Escapes obrigatórios

- **Valores em dólar:** `\$45` ou `US\$ 45`. Sem a barra, o cifrão abre um
  delimitador de fórmula e o texto seguinte vira matemática até o próximo `$`.
- **Em arquivos `.mdx`**, `{` e `<` no texto corrido são sintaxe JSX e quebram a
  compilação — escreva `\{` e `\<`. Dentro de `$...$` e `$$...$$` não há
  problema.
- **Nunca use `<` ou `>` num título (`##`), nem dentro de fórmula.** O
  Docusaurus copia o texto do título para o índice lateral **sem passar pelo
  KaTeX**, e o `<` cru chega ao minificador de HTML, que falha com um erro de
  parse difícil de ligar à causa. Escreva a relação em palavras: "queda de
  tensão acima do limite".

### Notação da casa

Mantenha consistente entre as lições — o aluno não deve ter que decidir se dois
símbolos diferentes significam a mesma coisa:

- **Grandezas elétricas:** $V$ tensão, $I$ corrente, $R$ resistência, $P$
  potência. Unidades V, A, Ω (`\Omega`), W. Lei de Ohm escrita
  `V = I \times R`; potência `P = V \times I`. Se o livro da aula usar $E$
  para tensão, avise o aluno da equivalência na primeira vez, mas mantenha $V$.
- **Multiplicação:** `\times`, não `\cdot`. **Divisão:** fração ou `\div`.
- **Unidade dentro de fórmula:** `12.6\,\text{V}`, `25\,\text{lb-ft}`. No texto
  corrido: 12.6 V.
- **Ponto decimal**, não vírgula: 12.6 V, 0.003 in. É uma escolha deliberada:
  multímetro, manual e prova mostram ponto, e o aluno precisa ler o número do
  jeito que vai encontrá-lo. Diga isso na primeira lição.
- **Milhar sem separador** (1500 rpm, 2000 psi), porque vírgula e ponto
  confundem em português e inglês. Acima de 9999, use espaço fino: 15 000 mi.
- **Sistema de medida:** use o que o manual do veículo usa e dê o outro entre
  parênteses na primeira aparição: 89 lb-in (10 N·m), 35 psi (241 kPa),
  195 °F (91 °C). Toda conversão é conferida com `python3`.
- **Torque:** `lb-ft`, `lb-in` e `N·m` — nunca "libras" sozinho, porque lb-ft e
  lb-in diferem por um fator de 12 (ver os erros comuns no `SKILL.md`).
- **Pressão** em psi (kPa); **vácuo** em inHg (kPa); **cilindrada** em L ou
  cm³ (ci quando o manual usar).
- **Texto dentro de fórmula:** `\text{potência} = \text{tensão} \times \text{corrente}`.

## Corretude técnica

Uma especificação inventada, uma conta errada ou um aviso de segurança faltando
é a pior falha possível neste repositório. O aluno não tem como saber que o erro
é do material, e na oficina ele vira peça danificada ou acidente.

- **Especificações não se escrevem de memória.** Torque, folga, pressão,
  resistência de sensor e capacidade de fluido variam por veículo. Quando a
  lição precisar de um número para ensinar, use uma faixa típica e marque:
  "valor típico, só para o exemplo — o valor que vale é o do manual do
  veículo".
- **Confira toda conta calculando**, não de cabeça: lei de Ohm, potência,
  cilindrada, taxa de compressão, conversões de unidade e cada item do gabarito.
  Use `python3 -c "..."`.
- **Confira a coerência interna:** se um exemplo é retomado adiante, os números
  têm que bater entre as duas passagens.
- **Segurança:** todo procedimento com risco traz o aviso antes do primeiro
  passo — veja a seção de segurança no `SKILL.md`. Nunca o corte por brevidade.

## Revisão de páginas existentes

- **Não renomeie títulos sem necessidade.** Cada `##` vira uma âncora, e outras
  páginas podem linkar para ela — com `onBrokenLinks: 'throw'`, isso quebra o
  build.
- **Diff mínimo.** Melhore a passagem problemática; não reescreva o que já está
  bom.

## Antes de concluir

Toda entrega passa por esta lista:

- [ ] `npm run build` passa sem erro;
- [ ] página nova está em `sidebars.js`, com o id **sem** prefixo numérico;
- [ ] links relativos resolvem, e a numeração das lições está coerente;
- [ ] fórmulas renderizam (confira no `npm run start`, não só no código-fonte);
- [ ] valores em dólar escritos como `\$`;
- [ ] todas as contas, conversões e o gabarito conferidos por cálculo;
- [ ] nenhuma especificação de memória; valores ilustrativos marcados;
- [ ] avisos de segurança antes de todo passo com risco;
- [ ] termos técnicos com o par em inglês na primeira aparição, e incluídos em
      `docs/glossario.md`;
- [ ] acentuação completa no texto que você escreveu;
- [ ] o checklist didático da skill `tutor-automotivo` foi aplicado.

Mensagens de commit em português, no imperativo, descrevendo o ganho pedagógico:
`Explica a queda de tensão com o caso do motor de partida lento`.
