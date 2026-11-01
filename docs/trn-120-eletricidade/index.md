---
title: TRN-120 — Basic Transportation Electricity
sidebar_label: Roteiro da disciplina
---

# TRN-120 — Basic Transportation Electricity

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
e diagnóstico, reparo e substituição de batteries, starter motors e
alternators.

## Como ler os termos em inglês

Nesta disciplina, **o nome das peças e os termos técnicos ficam em inglês**, no
meio do texto em português. É como você vai ouvir na aula, ler no manual de
serviço e no multimeter, e encontrar na prova ASE. Por isso as frases ficam
assim:

> A current sai da battery, passa pelo fuse e pelo switch, acende a bulb e
> volta pelo ground.

**Toque ou clique em qualquer termo sublinhado com pontinhos** para ver o nome
em português e uma definição curta. O mesmo vale para os nomes nas figuras.
Para fechar o balão, toque fora dele ou aperte Esc.

O artigo segue o gênero da palavra em português: **a** voltage (a tensão),
**a** current (a corrente), **a** resistance (a resistência), **o** fuse (o
fusível), **a** bulb (a lâmpada), **o** ground (o terra, a massa).

O que é física pura — átomo, elétron, carga elétrica, energia, calor — fica em
português, com o inglês na tabela “Mapa das ideias” de cada lição e no
[glossário](../glossario).

## Roteiro

Os tópicos seguem a descrição oficial. A ordem das aulas pode ser outra; se o
instrutor seguir uma sequência diferente, use o roteiro como mapa e vá à lição
do assunto da semana.

### Tópico 1 — Electrical theory e Ohm's law

1. [O que é eletricidade](./o-que-e-eletricidade) — do zero: átomos, elétrons,
   carga elétrica, conductors e insulators, e o que a battery guarda de
   verdade.
2. [O electrical circuit](./o-circuito-eletrico) — a current só circula num
   complete circuit; retorno pelo ground e open circuit.
3. [Voltage, current e resistance](./tensao-corrente-e-resistencia) — as três
   grandezas, suas unidades e prefixos, e onde cada uma se mede.
4. [Ohm's law](./lei-de-ohm) — $V = I \times R$: prever a current, conferir
   uma medição e explicar o sintoma de cada falha.
5. [Electrical power](./potencia-eletrica) — $P = V \times I$: de watts para
   amps, e por que uma conexão ruim esquenta.

Se você nunca estudou eletricidade, comece pela lição 1. Ela não supõe nenhum
conhecimento anterior.

### Tópico 2 — Circuit construction

6. [Series circuit](./circuito-em-serie) — um caminho só: a current é a mesma
   em todo o circuit, as resistances se somam e as voltage drops somam a
   source voltage. Por que o blower motor só funciona no máximo.
7. [Parallel circuit](./circuito-em-paralelo) — um branch para cada load:
   cada branch recebe a source voltage, as currents se somam e a total
   resistance fica menor que a do menor branch. Por que um short circuit num
   branch apaga todos.

### Tópico 3 — Test equipment

8. [Medições com o multimeter](./medicoes-com-multimetro) — as cinco
   medições: source voltage, available voltage, voltage drop, current e
   resistance. Onde vão as test leads, em que estado fica o circuit e por que
   uma voltage medida sem current pode enganar.

### Tópico 4 — Componentes do circuit

9. [Electromagnetism e o relay](./eletromagnetismo-e-rele) — a current cria
   um campo magnético; a coil com iron core vira eletroímã. O relay usa esse
   eletroímã para que uma current pequena (control circuit) ligue uma current
   grande (load circuit). O clique que divide o diagnóstico em dois.
10. [Resistances que mudam e o diode](./resistencias-variaveis-e-diodo) —
    variable resistor, potentiometer e thermistor (NTC e PTC): a base dos
    sensores. O diode, que deixa a current passar num sentido só; o LED, o
    photodiode e o clamping diode do relay.
11. [O resistor fixo](./resistor-fixo) — ler o color code e a tolerance, e
    escolher o watt rating: por que dois resistors com as mesmas faixas
    coloridas não servem um no lugar do outro. O tapped resistor do blower.
12. [Switches](./switches) — poles e throws, normally open e normally
    closed, momentary e maintained; push-button, thermal switch, pressure
    switch e mercury switch. O contactor dos híbridos. Por que o diagram
    sempre desenha o switch em repouso.
13. [Circuit protection](./protecao-do-circuito) — o fuse protege o **wire**,
    não a load: blade fuse, cartridge, maxi, fusible link e circuit breaker.
    Por que aumentar o fuse causa incêndio, e como testar um fuse sem tirá-lo
    do lugar.
14. [Loads: bulbs e motores](./cargas-bulbs-e-motores) — a current que uma
    load puxa não é fixa. Inrush current da bulb, a bulb de dois filaments e
    o feedback por ground ruim, o flasher que pisca rápido como aviso, e a
    counter-voltage que explica o current draw de todo electric motor.
15. [Capacitor e transformer](./capacitor-e-transformer) — as duas peças que
    trabalham por campo: o capacitor guarda carga e tira ruído do rádio; o
    transformer troca voltage por current, e a ignition coil é o exemplo do
    carro.

### Tópico 5 — Wiring diagrams

16. [Electrical symbols](./simbolos-eletricos) — os símbolos dos wiring
    diagrams, grupo por grupo, e onde cada peça entra no circuit; cores de
    wire, splices, connectors, pins e ground points. Um diagram inteiro lido
    para decidir onde medir, e flash cards para praticar.

### Tópico 6 — Ferramentas de teste e reparo

17. [Outros instrumentos de teste](./instrumentos-de-teste) — todo
    instrumento puxa alguma current do circuit, e **quanta** decide o que ele
    revela e o que ele pode danificar. Test light, logic probe, fused jumper
    wire, clamp meter, noid light, power probe, o gauss gauge que acha o
    short e os instrumentos de alta tensão.
18. [Scan tool e oscilloscope](./scan-tool-e-osciloscopio) — o scan tool
    mostra o que o módulo entendeu; o oscilloscope mostra o que o wire
    realmente fez. DTC, live data, freeze frame e por que um código aponta um
    **circuit**, nunca uma peça.
19. [Reparar um wire](./reparar-um-wire) — as quatro coisas que uma emenda
    precisa fazer. Wire stripper, crimp, solda rosin core, heat shrink, e a
    voltage drop que verifica o reparo.

### Laboratório

- [Laboratório de circuits](./laboratorio-de-circuitos) — uma bancada para
  montar circuits com a mão: battery, wire, bulb, switch e fuse. Você arrasta
  as peças, liga com wires e vê a current circular. Os experimentos retomam as
  lições 2, 6 e 7: o complete circuit, as bulbs em série e em paralelo, e o
  short circuit que queima o fuse.

### Próximos tópicos (em preparação)

20. **Series-parallel circuit** — série e paralelo no mesmo circuit, como o
    fuse em série com um conjunto de bulbs em paralelo.
21. **Ler wiring diagrams do fabricante** — as páginas que distribuem a power
    e os grounds, o component locator e como seguir um circuit por várias
    páginas.
22. **Diagnóstico de circuits** — open circuit, short to ground, short to
    power, high resistance e voltage drop.
23. **Battery** — construção, state of charge, testes, recarga, jump start e
    parasitic draw.
24. **Starting system** — starter motor, solenoid e testes.
25. **Charging system** — alternator, rectifier, voltage regulator e testes.

## Como estudar cada lição

1. Leia a queixa da abertura e tente imaginar a resposta antes de continuar.
2. Responda às perguntas de “Ideias anteriores” antes de abrir as respostas.
3. Nos exemplos marcados com **pause e tente**, tente de verdade antes de abrir
   a solução — no papel ou no quadro (`npm run quadro`).
4. Faça os exercícios e confira no gabarito, lendo também a explicação dos que
   você acertou.
5. As questões no formato ASE são em inglês, como na prova. Se uma palavra
   travar, procure no [glossário](../glossario).
