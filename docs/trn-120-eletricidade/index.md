---
title: TRN-120 — Eletricidade básica
sidebar_label: Roteiro da disciplina
---

# TRN-120 — Eletricidade básica

**Basic Transportation Electricity** é a disciplina de eletricidade do programa.
Ela vale 5 créditos, com 4 horas de aula e 3 de laboratório por semana, e não
tem pré-requisito. É pré-requisito de AUT-123 e de TRN-150, e a base de tudo o
que vem depois em desempenho do motor, climatização e veículos híbridos. Na
prova ASE, corresponde à área **A6** (*Electrical/Electronic Systems*).

A descrição oficial do catálogo da Wake Tech:

> This course covers basic electrical theory, wiring diagrams, test equipment,
> and diagnosis, repair and replacement of batteries, starters, and
> alternators. Topics include Ohm's Law, circuit construction, wiring diagrams,
> circuit testing, and basic troubleshooting. Upon completion, students should
> be able to properly use wiring diagrams, diagnose, test, and repair basic
> wiring, battery, starting, charging, and electrical concerns.

Em português: teoria elétrica básica, esquemas elétricos, instrumentos de teste,
e diagnóstico, reparo e substituição de baterias, motores de partida e
alternadores.

## Roteiro

Os tópicos seguem a descrição oficial. A ordem das aulas pode ser outra; se o
instrutor seguir uma sequência diferente, use o roteiro como mapa e vá à lição
do assunto da semana.

### Tópico 1 — Teoria elétrica básica e lei de Ohm

1. [O que é eletricidade](./o-que-e-eletricidade) — do zero: átomos, elétrons,
   carga elétrica, condutores e isolantes, e o que a bateria guarda de verdade.
2. [O circuito elétrico](./o-circuito-eletrico) — a corrente só circula num
   caminho completo; retorno pela massa e circuito aberto.
3. [Tensão, corrente e resistência](./tensao-corrente-e-resistencia) — as três
   grandezas, suas unidades e prefixos, e onde cada uma se mede.
4. [Lei de Ohm](./lei-de-ohm) — $V = I \times R$: prever a corrente, conferir
   uma medição e explicar o sintoma de cada falha.
5. [Potência elétrica](./potencia-eletrica) — $P = V \times I$: de watts para
   ampères, e por que uma conexão ruim esquenta.

Se você nunca estudou eletricidade, comece pela lição 1. Ela não supõe nenhum
conhecimento anterior.

### Tópico 2 — Montagem de circuitos

6. [Circuito em série](./circuito-em-serie) — um caminho só: a corrente é a
   mesma em todo o circuito, as resistências se somam e as quedas de tensão
   somam a tensão da fonte. Por que o ventilador só funciona no máximo.
7. [Circuito em paralelo](./circuito-em-paralelo) — um ramo para cada carga:
   cada ramo recebe a tensão da fonte, as correntes se somam e a resistência
   total fica menor que a do menor ramo. Por que um curto num ramo apaga todos.

### Tópico 3 — Instrumentos de teste

8. [Medições com o multímetro](./medicoes-com-multimetro) — as cinco medições:
   tensão da fonte, tensão disponível, queda de tensão, corrente e resistência.
   Onde vão as pontas, em que estado fica o circuito e por que uma tensão
   medida sem corrente pode enganar.

### Próximos tópicos (em preparação)

9. **Circuito misto** — série e paralelo no mesmo circuito, como o fusível em
   série com um conjunto de lâmpadas em paralelo.
10. **Componentes de controle e proteção** — fusíveis, disjuntores, interruptores
    e relés.
11. **Esquemas elétricos** — símbolos, códigos de cor dos fios, conectores e
    como seguir um circuito no esquema do fabricante.
12. **Outros instrumentos de teste** — lâmpada de teste, pinça amperimétrica e
    *jumper* com fusível.
13. **Diagnóstico de circuitos** — circuito aberto, curto-circuito à massa e ao
    positivo, resistência alta e queda de tensão.
14. **Bateria** — construção, estado de carga, testes, carga, partida com
    bateria auxiliar e consumo parasita.
15. **Sistema de partida** — motor de partida, solenoide e testes.
16. **Sistema de carga** — alternador, retificador, regulador e testes.

## Como estudar cada lição

1. Leia a queixa da abertura e tente imaginar a resposta antes de continuar.
2. Responda às perguntas de “Ideias anteriores” antes de abrir as respostas.
3. Nos exemplos marcados com **pause e tente**, tente de verdade antes de abrir
   a solução — no papel ou no quadro (`npm run quadro`).
4. Faça os exercícios e confira no gabarito, lendo também a explicação dos que
   você acertou.
5. As questões no formato ASE são em inglês, como na prova. Se uma palavra
   travar, procure no [glossário](../glossario).
