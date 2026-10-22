# Escrever ou revisar uma lição

Complementa o `SKILL.md` — perfil do aluno, princípios, segurança,
especificações, diagnóstico, continuidade, regra anti-mágica, erros comuns e
estilo continuam valendo aqui. Este arquivo cobre só o que é específico de
produzir uma página em `docs/`.

## Conteúdo

- Antes de editar
- Estrutura de uma lição
- Linguagem
- Recursos visuais
- Exercícios e gabarito
- Tamanho e escopo
- Revisão de lições existentes
- Checklist didático

## Antes de editar

**Leia a lição anterior e a seguinte** antes de mexer numa página: é a única
forma de saber o que já foi ensinado e o que virá — e as quatro perguntas da
continuidade não têm resposta sem isso.

**O fenômeno vem antes do sistema.** Antes de ensinar um sistema do carro,
confira se o fenômeno físico que ele usa já foi ensinado neste material: a
eletricidade antes do circuito, a pressão antes da hidráulica do freio, a
combustão antes do ciclo do motor. Se não foi, a primeira lição é sobre o
fenômeno, partindo do zero. Nenhum conceito físico conta como “senso comum” —
o aluno é leigo, e a TRN-120 começou pelo circuito sem explicar o que é
eletricidade, o que teve de ser corrigido com uma lição nova antes dela.

**Alinhe com a aula.** Se houver material da disciplina em `material/`
(slides, *job sheets*, apostila), confira a ordem dos tópicos e o vocabulário
usado pelo instrutor. A lição explica do jeito da casa, mas usa os mesmos
termos em inglês que o aluno vai ouvir na aula. Não copie texto nem figura
desse material (veja `CLAUDE.md`, seção "Material de aula").

## Estrutura de uma lição

A ordem abaixo deve ser respeitada. Os títulos não precisam ser literalmente
estes — títulos descritivos, como "Queda de tensão: a tensão que fica no
caminho", funcionam melhor que rótulos genéricos.

1. **A queixa** — uma situação de oficina que torna o conceito necessário,
   antes de qualquer definição: "o cliente diz que o carro demora para pegar de
   manhã". A lição **volta e resolve essa queixa** assim que a ferramenta fica
   pronta: a ideia precisa pagar o que prometeu na abertura.
2. **Mapa das ideias** — glossário mínimo dos termos que a lição vai construir,
   em tabela com três colunas: inglês · português · o que é, em uma linha. O
   texto da lição usa o termo em inglês (convenção em `CLAUDE.md`, “Idioma e
   escrita”).
3. **Onde isso aparece** — em que sistemas do carro, em qual disciplina da Wake
   Tech e em qual área da prova ASE.
4. **Ideias anteriores que voltam aqui** — nomeadas explicitamente, com link
   para a página onde foram estudadas, e **reativadas** com duas ou três
   perguntas rápidas de resgate, respondidas ali mesmo. Citar não basta: o
   aluno precisa trazer o bloco anterior de volta à memória antes de usá-lo —
   e descobrir agora, não no meio da lição, se precisa reler a página antiga.
5. **Intuição** — a ideia nova em linguagem comum, sem fórmula. Quando usar
   analogia (água no cano para eletricidade, por exemplo), diga qual parte
   corresponde a qual e onde a analogia deixa de valer.
6. **Modelo visual** — esquema elétrico, vista em corte, diagrama do ciclo,
   tabela.
7. **Ponte para a formalização** — por que a passagem para a lei, a fórmula ou
   o termo técnico é legítima.
8. **Formalização** — definições, leis e fórmulas, só agora. Toda definição vem
   com **um exemplo e um contraexemplo** — é o contraexemplo que delimita o
   conceito ("uma lâmpada é uma carga porque transforma a energia elétrica em
   luz e calor; um fio em bom estado não é, porque quase não gasta tensão").
9. **Como falha e como diagnosticar** — sintomas, o teste que separa as causas
   possíveis e o que cada resultado significa, no formato do `SKILL.md`, seção
   "Raciocínio de diagnóstico". Mesmo uma lição de teoria pura (o que é tensão)
   mostra onde a ideia entra num diagnóstico.
10. **Na oficina** — quando a lição envolve trabalho prático: **riscos e
    equipamento de proteção primeiro**, depois ferramentas, procedimento geral e
    onde buscar a especificação. Procedimento genérico, nunca de um veículo
    específico com números inventados.
11. **Exemplos resolvidos** — contas e casos de diagnóstico, do simples ao
    composto. A partir do segundo, convide o aluno a tentar antes de ler a
    solução ("pause e tente"): exemplo lido passivamente ensina muito menos que
    exemplo tentado.
12. **Perguntas de verificação** — sobre o porquê, não sobre o procedimento,
    **com respostas** em `<details>`. Para quem estuda sozinho, pergunta sem
    resposta é beco sem saída, não estímulo.
13. **Exercícios** com gabarito, incluindo questões no formato da prova ASE.
14. **Revisão curta** — a ideia central, quando usá-la, com o que ela se
    conecta, e a lista dos termos em inglês da lição para revisar.

Sempre concreto → visual → abstrato. Fórmula só depois de intuição e imagem.

## Linguagem

A estrutura acima decide o que a lição diz. Esta seção decide como cada frase
chega ao aluno — e ela vale em todo o texto da página: corpo, enunciados de
exercício, gabarito, dicas e legendas de figura.

O aluno lê sozinho, sem ninguém a quem perguntar o que uma frase quis dizer.
Frase que precisa ser relida cobra esforço no lugar errado: ele gasta a atenção
decifrando o português em vez de acompanhar o sistema. E quando trava, não tem
como saber se o problema é o conceito ou a redação.

### 1. Termo abstrato vira ação concreta

Nome de processo — "a verificação", "a aplicação do teste", "o procedimento de
medição" — esconde quem faz o quê. Escreva o verbo e diga o que a mão faz.

> ❌ Realiza-se a verificação da integridade do circuito de massa do motor de
> partida.

> ✅ Coloque o multímetro na escala de tensão contínua. Encoste a ponta preta
> no polo negativo da bateria e a ponta vermelha na carcaça do motor de
> partida. Peça para alguém dar partida e leia o valor. Esse número é a tensão
> que se perde no caminho de volta para a bateria.

Teste: **consigo executar isso na bancada lendo só esta frase?** Se a frase
descreve o destino em vez do movimento, ela ainda é abstrata.

O mesmo vale para os verbos do jargão. "Isolar a falha", "sangrar o freio",
"torquear", "zerar o relógio comparador" são nomes de destino, não instruções.
Na primeira aparição, diga o movimento junto com o nome: "sangrar o freio é
abrir o parafuso de sangria enquanto alguém pisa no pedal, para que o fluido
empurre o ar para fora da linha". Depois de ensinado assim uma vez, o nome já
pode andar sozinho.

Palavras que parecem comuns e não são, e por isso pedem uma explicação na
primeira vez que aparecem, mesmo com o botão do português: **voltage,
current, load** (carga como consumidor) e **state of charge** (carga da
battery) — em português as duas são “carga” —, **ground** (massa),
**short circuit, open circuit, clearance, stroke, vácuo, compression,
intermitente, sinal, referência**.

### 2. Uma ideia por frase

Frase longa obriga o aluno a segurar três coisas na cabeça enquanto lê a
quarta. Corte em frases curtas, cada uma com uma afirmação.

> ❌ No tempo de compressão, com as duas válvulas fechadas, o pistão sobe e
> comprime a mistura, que esquenta — e é essa mistura comprimida e quente que a
> vela inflama perto do ponto morto superior, empurrando o pistão para baixo no
> tempo seguinte.

> ✅ No tempo de compressão, as duas válvulas estão fechadas. O pistão sobe e
> aperta a mistura de ar e combustível num espaço menor. Por isso a mistura
> esquenta. Perto do topo do curso, a vela solta a faísca e a mistura queima.
> A queima empurra o pistão para baixo: esse é o tempo seguinte, o de
> combustão.

Sinais de que a frase precisa ser quebrada: passou de 25 palavras; tem dois
travessões; tem "— e", "— ou seja", "isto é" emendados; tem uma oração
explicativa dependurada em outra ("..., que ..., que ..."). Cada emenda dessas
é um ponto final esperando para acontecer.

Uma ressalva que importa: **quebrar a frase não pode apagar a ligação entre as
partes**. O conectivo que estava implícito na vírgula precisa aparecer escrito —
"Por isso", "Mas", "Então", "Só que". Frases curtas justapostas sem conectivo
transferem para o aluno o trabalho de descobrir se a segunda é consequência,
condição ou contraste da primeira. Isso é a regra 4 sendo violada para cumprir
a 2.

### 3. Nada de linguagem figurada que exija interpretação

Cuidado para não confundir duas coisas opostas:

- **Analogia construída** é o método da casa e continua obrigatória — "a
  tensão é como a pressão da água no cano; a corrente, como a quantidade de
  água que passa por segundo". O texto diz qual parte corresponde a qual, e o
  aluno conhece o lado concreto. E diz onde ela para de valer: cano aberto
  derrama água, mas circuito aberto não derrama eletricidade — a corrente
  simplesmente para.
- **Figura decorativa** é o que sai. Ela carrega conteúdo técnico sem explicar
  nada, e o aluno tem que adivinhar o que ela quer dizer.

> ❌ O PCM é o cérebro do carro.

> ✅ O PCM recebe os sinais dos sensores, calcula quanto combustível injetar e
> quando soltar a faísca, e manda os comandos para os injetores e as bobinas.

> ❌ O sensor está mentindo para o módulo.

> ✅ O sensor manda um sinal que não corresponde à condição real. O motor está
> quente, mas o sensor de temperatura informa ao módulo que ele está frio.

Regra prática: **se a metáfora não é explicada na frase seguinte, ela é
decoração** — troque pelo que ela queria dizer.

Saem pelo mesmo motivo: ironia, pergunta retórica sem resposta, "digamos",
"não é bem assim" — construções em que o sentido pretendido é diferente do
literal. A fala do cliente ("o carro está engasgando") é exceção: ela entra
entre aspas, como dado da queixa, e o texto traduz o que ela pode significar.

### 4. Relação subentendida vira relação escrita

Duas omissões típicas:

**O conectivo que ficou na vírgula.** Causa, condição, contraste, finalidade e
consequência precisam estar escritas, não deduzidas do contexto.

> ❌ A bateria mostra 12.6 V. No motor de partida chegam 10.8 V. Há resistência
> no cabo.

> ✅ A bateria mostra 12.6 V, mas no motor de partida chegam só 10.8 V. **Então**
> 1.8 V ficaram em algum ponto do caminho. Tensão só se perde onde há
> resistência, **por isso** o próximo passo é procurar essa resistência: medir
> a queda em cada trecho do cabo até achar o trecho que fica com a maior parte
> dos 1.8 V.

**A referência solta.** "Isso", "essa leitura", "ele", "aqui", "o mesmo
teste" apontando para algo que ficou três parágrafos atrás. Troque o pronome
pelo nome da coisa, mesmo que soe repetitivo — repetição custa uma palavra,
ambiguidade custa a lição.

Vale também para os números: **quando um valor reaparece num passo adiante, diga
de onde ele veio.** "Os 1.8 V aqui são a diferença que medimos entre a bateria
e o motor de partida" evita que o aluno pare a leitura para caçar a origem do
número.

Teste de revisão: **para entender esta frase, o aluno precisa de alguma ligação
que o texto não escreveu?**

### 5. Dificuldade não é tratada como trivial

Corte "basta", "apenas", "é só", "simplesmente", "obviamente", "claramente",
"naturalmente", "fácil", "nada mais é do que", "como todos sabem".

O estrago é duplo. A palavra ocupa o lugar da explicação — é a regra
anti-mágica do `SKILL.md` outra vez. E, quando o aluno não acha aquilo fácil,
ele conclui que a falha é dele. Não há professor para dizer o contrário, e a
confiança é justamente o que sustenta o estudo sozinho (princípio 5).

> ❌ Com compressão baixa em dois cilindros vizinhos, basta trocar a junta do
> cabeçote.

> ✅ Compressão baixa em dois cilindros vizinhos sugere a junta do cabeçote,
> porque a junta é a peça que separa um cilindro do outro. Mas a mesma leitura
> pode vir de válvulas ou anéis. Antes de desmontar, faça o teste de
> vazamento: se o ar injetado num cilindro sai pelo vizinho, a junta está
> confirmada.

Ao revisar, aplique o teste da omissão: **apague o advérbio e veja se a frase
ainda ensina**. Se ela perde o sentido, é porque dependia dele para pular um
passo — escreva o passo. Se não perde nada, a palavra era só ruído.

O movimento contrário é bem-vindo: **avisar que um trecho é difícil ajuda.**
"Este é o ponto que mais confunde nesta lição", "se esta passagem não fechar na
primeira leitura, isso é esperado — releia depois do exemplo 3". Reconhecer a
dificuldade protege a confiança do aluno; negá-la é o que a destrói.

### A passada de linguagem

Depois que o conteúdo estiver certo, releia a página inteira olhando **só** para
a redação — as cinco regras acima, uma varredura de cada vez. Na revisão de uma
lição existente, isso se limita ao trecho que você tocou, pelo diff mínimo do
`CLAUDE.md`; se você encontrar problemas de linguagem fora dele, aponte ao
usuário em vez de reescrever a página.

## Recursos visuais

A etapa "modelo visual" não é opcional. Escolha a ferramenta pela natureza da
ideia, não pelo que é mais rápido de escrever:

- **Diagrama em SVG** — é o padrão para desenho: esquema elétrico, vista em
  corte de motor ou pinça de freio, ciclo de quatro tempos, caminho do fluido.
  Os componentes ficam em `src/components/` e são documentados em
  `src/components/README.md`. Ainda não existe nenhum: a primeira lição que
  precisar de um desenho cria o componente, documenta no README e as seguintes
  reaproveitam. Candidatos óbvios: um esquema de circuito com os símbolos
  usados nos diagramas elétricos dos manuais, e um diagrama de cilindro com
  pistão e válvulas. Use KaTeX nos rótulos, para o desenho sair na mesma fonte
  das fórmulas.
- **Tabela markdown** — para correspondências: sintoma → causa possível →
  teste; leitura → significado; os quatro tempos e a posição de cada válvula.
- **Matriz KaTeX** (`\begin{array}`) — para alinhar os passos de uma conta lado
  a lado.
- **Bloco ` ```text `** — só para fluxograma de diagnóstico simples ou rascunho.
  Nunca para um desenho que um componente SVG faria: arte ASCII ao lado de
  fórmulas KaTeX parece saída de terminal colada na página.
- **Componente interativo** — React com estado e controle deslizante, em `.mdx`.
  Use apenas quando **mexer no parâmetro é a ideia** que está sendo ensinada:
  variar a resistência e ver a corrente mudar, girar o virabrequim e ver as
  válvulas abrirem. Uma figura que só ilustra deve ser SVG estático.
- **Fotos** — só as tiradas pelo aluno ou com licença livre. Nunca copie figura
  de livro, apostila ou manual.

Duas obrigações ao entregar qualquer desenho:

- **Confira renderizado e corrija até ficar perfeito.** Rode
  `npm run build && npm run figuras`, abra cada folha de `.figuras/` e olhe cada
  figura no claro, no escuro e no celular. Achou rótulo pequeno, texto
  encostando, linha apagada, fio cruzando fio ou desenho cortado: corrija e
  rode de novo, até não sobrar nada. O ciclo e as regras de desenho estão em
  `CLAUDE.md` (seção “Figuras”) e em `src/components/README.md`.
- **Nunca mais de três cores.** Quando um diagrama parece precisar de uma
  quarta, quase sempre duas regiões representam a mesma coisa e devem dividir a
  mesma cor. Em esquema elétrico, siga a convenção do manual quando ela existir
  (vermelho para positivo, preto para massa) e diga isso na legenda.

## Exercícios e gabarito

Exercícios desenvolvem domínio, não repetição mecânica. Use a progressão em
seções numeradas:

1. **Reconhecimento** — identificar a peça, o símbolo, o termo em inglês ou o
   tipo de circuito.
2. **Explicação** — dizer com palavras o que está acontecendo no sistema.
3. **Aplicação direta** — uma conta ou uma leitura de medição simples.
4. **Variação** — caso parecido, com uma mudança importante.
5. **Caso de diagnóstico** — queixa, dados de teste, causa provável e próximo
   teste, combinando com ideias de lições anteriores.
6. **Justificativa** — por que o procedimento ou o teste funciona.
7. **Formato ASE** — duas ou três questões no estilo da prova, **em inglês**,
   incluindo o formato *Technician A says… Technician B says… Who is right?*

Perguntas de verificação úteis: que ideia anterior estamos usando aqui? o que
o sistema deveria fazer? o que este teste descarta? por que a medição é feita
neste ponto e não em outro? que leitura você esperaria se a peça estivesse boa?

**Toda lista de exercícios termina com gabarito**, no formato:

```md
<details>
<summary>Respostas para conferência</summary>

1. ...

</details>
```

O gabarito não traz só o resultado: nos itens de explicação, diagnóstico e
justificativa, traz a razão em uma ou duas frases. Nas questões de formato ASE,
o gabarito é em português e explica **por que cada alternativa está certa ou
errada** — é aí que a questão ensina.

Dois reforços para quem não tem professor:

- **Dica antes da solução**, nos problemas mais difíceis: um `<details>` com
  `<summary>Dica</summary>` antes do gabarito, contendo o empurrão mínimo —
  nunca a resposta.
- **Diagnóstico de erro** no gabarito, quando o erro é previsível: "se você
  encontrou 48 A para a lâmpada de 4 Ω em 12 V, provavelmente multiplicou a
  tensão pela resistência em vez de dividir; a corrente certa é 3 A". Ninguém vai olhar a conta do aluno e apontar onde ele escorregou —
  o gabarito faz esse papel.

## Tamanho e escopo

**Não existe alvo de número de linhas.** A estrutura acima custa o que custa, e
cortar para caber num número é cortar exatamente o que o aluno que estuda
sozinho não tem como repor.

O critério é outro: **uma ideia central por página**. A pergunta não é "está
longa demais?", e sim:

- a página tem **uma** ideia central, ou duas que só estão juntas por vizinhança
  temática?
- se são duas, a segunda **depende** da primeira ao ponto de separá-las obrigar
  a página nova a começar reensinando a anterior? Se depende, mantenha juntas.
- alguma seção repete o que outra já disse, ou acrescenta exemplo sem
  acrescentar entendimento?

Só a segunda resposta autoriza propor uma divisão — e proponha, em vez de
continuar acrescentando. O que sempre vale cortar é redundância, não
profundidade.

## Revisão de lições existentes

- Ao aprofundar uma explicação, verifique se o resto da página ainda flui: um
  parágrafo novo no meio pode duplicar algo que já vinha depois.
- Se a lição usa uma ideia sem ter apresentado, o conserto pode estar na página
  anterior, não nesta.
- **O texto que você escreveu passa pela seção Linguagem antes de entregar** —
  inclusive o parágrafo curto que você só ajustou.

## Checklist didático

Antes de entregar qualquer lição nova ou revisada (além do checklist técnico de
`CLAUDE.md`):

- [ ] a lição responde: para que serve · que queixa resolve · em que ideias
      anteriores se apoia · que princípio justifica cada conclusão · o que muda
      e o que permanece igual em cada passo;
- [ ] a lição não usa nenhum conceito físico que o material ainda não ensinou,
      nem os que parecem de senso comum;
- [ ] a queixa da abertura é resolvida na própria lição;
- [ ] toda definição nova tem exemplo e contraexemplo;
- [ ] os erros comuns do conceito estão tratados no corpo da lição;
- [ ] a seção de diagnóstico mostra o que o sistema deveria fazer e o que cada
      teste descarta;
- [ ] todo procedimento com risco traz o aviso de segurança antes do primeiro
      passo;
- [ ] nenhuma especificação de memória; todo valor ilustrativo está marcado;
- [ ] todo termo técnico está em inglês no texto e existe no dicionário
      `src/data/termos.json`;
- [ ] há questões no formato ASE, com gabarito que explica cada alternativa;
- [ ] as perguntas de verificação têm resposta;
- [ ] a passada de linguagem foi feita no texto novo ou alterado: termo
      abstrato trocado por ação concreta · nenhuma frase com duas ideias ·
      nenhuma figura de linguagem por explicar · conectivos e referências
      escritos, sem "isso" solto e sem número de origem desconhecida ·
      nenhum "basta / apenas / é só / simplesmente / obviamente / fácil";
- [ ] todo desenho novo ou alterado passou por `npm run figuras` e foi olhado
      na folha, nos temas claro e escuro e no celular, e corrigido até não ter
      nenhum defeito;
- [ ] releitura final na pele do aluno: que pergunta ele faria que o texto não
      responde?
