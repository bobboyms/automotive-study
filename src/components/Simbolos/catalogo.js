// Os símbolos que as lições mostram, com o nome em inglês (clicável quando é
// termo do dicionário) e uma nota curta em português. `nome` é uma lista de
// pedaços: texto comum ou [chave do termo, texto].
//
// A ordem é a dos grupos da lição Electrical symbols. Os flash cards usam o
// catálogo inteiro.

const CATALOGO = {
  bateria: {nome: [['battery', 'battery']], nota: 'placa longa é o +; o tracejado quer dizer “mais células”'},
  fusivel: {nome: [['fuse', 'fuse']], nota: 'como nas figuras deste site: o S dentro da caixinha'},
  fusivelS: {nome: [['fuse', 'fuse']], nota: 'como em muitos manuais americanos: o S solto'},
  fusivelEuro: {nome: [['fuse', 'fuse'], ' (Euro)'], nota: 'retângulo com o wire passando por dentro'},
  fusivelNumero: {nome: [['fuse', 'fuse'], ' # e ', ['fuse rating', 'rating']], nota: 'número do fuse na fuse box e a amperagem'},
  interruptor: {nome: [['switch', 'switch']], nota: 'aberto: a current não passa'},
  interruptorPosicoes: {nome: [['switch', 'switch'], ' de posições'], nota: 'um contato comum e uma saída por posição'},
  rele: {nome: [['relay', 'relay']], nota: 'coil (85, 86) e contato normally open (30, 87)'},
  rele5: {nome: [['relay', 'relay'], ' de 5 pinos'], nota: 'o 87a fica ligado ao 30 em repouso'},
  releDiodo: {nome: [['relay', 'relay'], ' com ', ['diode', 'diode']], nota: 'o diode em paralelo com a coil'},
  lampada: {nome: [['bulb', 'bulb']], nota: 'a bulb em geral'},
  filamento: {nome: [['single filament bulb', 'single filament bulb']], nota: 'um filament, dois terminais'},
  filamentoDuplo: {nome: [['double filament bulb', 'double filament bulb']], nota: 'dois filaments e um terminal comum'},
  motor: {nome: [['electric motor', 'motor']], nota: 'o M dentro do círculo'},
  buzina: {nome: [['horn', 'horn']], nota: 'a corneta ao lado do corpo'},
  led: {nome: [['LED', 'LED']], nota: 'diode com as setas saindo: solta luz'},
  resistor: {nome: [['resistor', 'resistor']], nota: 'o zigue-zague americano'},
  resistorEuro: {nome: [['resistor', 'resistor'], ' (Euro)'], nota: 'o retângulo vazio'},
  variavel: {nome: [['variable resistor', 'variable resistor']], nota: 'a seta atravessada: resistance ajustável'},
  potenciometro: {nome: [['potentiometer', 'potentiometer']], nota: 'três terminais; o wiper é a seta'},
  ntc: {nome: [['NTC thermistor', 'NTC'], ' ', ['resistor', 'resistor']], nota: '−T: esquenta, a resistance cai'},
  ptc: {nome: [['PTC thermistor', 'PTC'], ' ', ['resistor', 'resistor']], nota: '+T: esquenta, a resistance sobe'},
  bobina: {nome: [['coil', 'coil']], nota: 'wire enrolado'},
  bobinaNucleo: {nome: [['coil', 'coil'], ' com ', ['iron core', 'core']], nota: 'as linhas retas são o iron core'},
  diodo: {nome: [['diode', 'diode']], nota: 'a seta aponta o sentido em que a current passa'},
  fotodiodo: {nome: [['photodiode', 'light sensitive diode']], nota: 'diode com as setas entrando: sente a luz'},
  massa: {nome: [['ground', 'ground'], ' e local'], nota: 'G101 é o código do ponto de ground'},
  splice: {nome: [['splice', 'splice']], nota: 'o ponto preto: wires emendados'},
  cruzamento: {nome: ['wires que se cruzam'], nota: 'sem ponto: não há ligação'},
  conector: {nome: [['inline connector', 'double connector']], nota: 'C201 é o connector; 3 é o pino'},
  pinos: {nome: [['pinout', 'connector pinout']], nota: 'os pinos numerados na borda do componente'},
  corDoFio: {nome: [['wire color code', 'wire color']], nota: 'GRN/RED: verde com listra (tracer) vermelha'},
  completo: {nome: ['componente completo'], nota: 'caixa contínua: o componente está todo aqui'},
  incompleto: {nome: ['componente incompleto'], nota: 'caixa tracejada: o resto está em outra página'},
  versoes: {nome: ['versões'], nota: 'cada número é uma versão do carro'},
};

export default CATALOGO;
