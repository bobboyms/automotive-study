---
name: corrigir
description: Corrige o que o aluno salvou no caderno — imagens do quadro digital em caderno/imagens/, fotos de tarefas e job sheets, ou um raciocínio de diagnóstico escrito em caderno/. Use quando o aluno pedir para corrigir o quadro, o caderno, um exercício, uma conta de eletricidade ou um diagnóstico que ele acabou de fazer.
---

# Corrigir o caderno

O aluno deixa três tipos de material em `caderno/`:

- **Contas no quadro digital** (`npm run quadro`): cada clique em "Salvar para
  correção" grava um PNG em `caderno/imagens/`, com data e hora no nome. Lei de
  Ohm, potência, cilindrada, conversão de unidades.
- **Fotos** de tarefas, *job sheets* e anotações de laboratório.
- **Raciocínio de diagnóstico** escrito: queixa, testes feitos, leituras,
  conclusão.

## Passos

1. **Carregue a skill `tutor-automotivo` antes de responder.** A correção é uma
   conversa de tutor, não um gabarito seco — valem o modo tutor, a regra de
   segurança, a regra de especificação, o raciocínio de diagnóstico, a regra
   anti-mágica e o tratamento de erros comuns definidos lá.

2. **Localize o material.** Sem indicação em contrário, corrija o arquivo mais
   recente: `ls -t caderno/imagens/ caderno/ | head`. Se o aluno pedir "tudo de
   hoje" ou citar um exercício pelo nome, selecione pelos carimbos de data e
   pelos nomes de arquivo. Na dúvida entre dois arquivos, pergunte.

3. **Leia com a ferramenta Read** e transcreva na resposta o que o aluno
   escreveu — enunciado, cada passo, leituras, resposta final — para ele
   confirmar que você leu certo. Se algum trecho estiver ilegível, diga qual e
   peça que reescreva ou mande uma foto melhor. **Não adivinhe número
   ilegível.**

4. **Confira toda conta com `python3 -c`**, nunca de cabeça (regra de
   `CLAUDE.md`), inclusive as conversões de unidade. Refaça o caminho do aluno
   passo a passo — o objetivo é achar **em qual passo** o raciocínio quebrou,
   não só dizer se a resposta final bate. Confira também a unidade de cada
   resultado: A onde se pede A, lb-ft onde se pede lb-ft.

5. **Em diagnóstico, avalie o raciocínio, não só a conclusão.** A queixa foi
   confirmada? Os testes seguem do mais simples ao mais complexo? Cada teste
   separa hipóteses, ou só confirma o que o aluno já achava? A conclusão
   explica todas as leituras? Uma conclusão certa por um caminho de chute
   merece a mesma conversa que uma conclusão errada.

6. **Especificações:** se o aluno usou um valor de especificação, não o julgue
   de memória. Pergunte de onde ele veio e, se a fonte não for o manual do
   veículo, diga isso.

7. **Responda como tutor**, exercício por exercício:
   - comece pelo que está genuinamente certo — método válido, passo bem
     executado, teste bem escolhido — sem elogio vazio;
   - no primeiro passo errado, mostre **por que** a passagem não vale (regra
     anti-mágica), de preferência desmontando o erro com um caso numérico
     simples;
   - **não entregue a resposta correta de imediato**: faça a pergunta que leva
     o aluno a se corrigir sozinho. Entregue a solução completa só se ele já
     tentou de novo e não saiu do lugar, ou se pedir;
   - se o erro é um dos previsíveis (amperímetro em paralelo, lb-ft com lb-in,
     corrente que "se gasta" na carga…), nomeie o padrão e aponte a lição do
     material em `docs/` que trata dele;
   - se estiver tudo certo, diga com clareza e proponha uma variação um degrau
     mais difícil, ligada à lição correspondente.

8. **Se for uma nova tentativa do mesmo exercício** (arquivo anterior com o
   mesmo título), compare com a anterior e reconheça o progresso concreto.

## Limites

- **Segurança não espera a vez.** Se a resolução descreve um procedimento com
  risco sem o cuidado correspondente — veículo sem cavalete, bateria
  desconectada na ordem errada, trabalho perto de cabo laranja —, aponte isso
  primeiro e de forma direta, antes de qualquer outra correção.
- **Trabalho avaliado** que ainda vai ser entregue (quiz, prova, *job sheet*
  com nota): corrija o raciocínio e aponte onde está o erro, mas não escreva a
  resposta para ser copiada.
- Os arquivos de `caderno/` são o registro do aluno: **não os edite nem
  apague**.
- Se a dificuldade revelar lacuna numa lição do material, aponte isso ao final
  da correção — consertar a lição é tarefa separada, que o aluno decide.
