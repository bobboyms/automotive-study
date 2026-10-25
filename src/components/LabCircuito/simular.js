// Simulação do circuito montado na bancada do LabCircuito.
//
// Cada peça liga dois pontos da grade. Os pontos viram os nós de uma análise
// nodal: cada peça entra como uma condutância (1 ÷ resistance) entre os seus
// dois nós, e a battery entra como uma fonte de current em paralelo com a
// resistance interna dela (o equivalente de Norton de 12 V em série com
// 0.01 Ω). Resolvendo o sistema, sai a voltage de cada nó; a voltage e a
// current de cada peça vêm daí, pela lei de Ohm. Assim qualquer montagem —
// série, paralelo, misto, short circuit — dá o resultado certo, sem casos
// preparados de antemão.
//
// Os valores são ilustrativos, escolhidos para as contas baterem com as lições:
// a bulb de 24 Ω é a taillight da lição de parallel circuit.

export const VALORES = {
  tensao: 12, // V da battery
  rInterna: 0.01, // Ω dentro da battery: limita a current de um short circuit
  rBulb: 24, // Ω da bulb acesa (fixa; o filamento real muda ao esquentar)
  rFio: 0.001, // Ω de um trecho de wire, de um switch fechado ou de um fuse
  fuse: 10, // A: acima disso o fuse queima
  // a bulb queima quando a power passa do dobro da normal (6 W em 12 V)
  limiteBulb: 2,
};

export const POTENCIA_NOMINAL = (VALORES.tensao * VALORES.tensao) / VALORES.rBulb;

// Liga todos os nós a uma referência por uma condutância desprezível. Sem isso,
// um pedaço de circuito solto na bancada deixaria o sistema sem solução.
const GMIN = 1e-8;

function condutancia(e, queimadas) {
  if (queimadas.has(e.id) || e.queimado) return 0;
  switch (e.tipo) {
    case 'wire':
    case 'fuse':
      return 1 / VALORES.rFio;
    case 'switch':
      return e.aberto ? 0 : 1 / VALORES.rFio;
    case 'bulb':
      return 1 / VALORES.rBulb;
    case 'battery':
      return 1 / VALORES.rInterna;
    default:
      return 0;
  }
}

// Eliminação de Gauss com pivô parcial. G é alterada.
function resolverSistema(G, I) {
  const n = I.length;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let l = c + 1; l < n; l++) if (Math.abs(G[l][c]) > Math.abs(G[p][c])) p = l;
    [G[c], G[p]] = [G[p], G[c]];
    [I[c], I[p]] = [I[p], I[c]];
    for (let l = c + 1; l < n; l++) {
      const f = G[l][c] / G[c][c];
      if (f === 0) continue;
      for (let k = c; k < n; k++) G[l][k] -= f * G[c][k];
      I[l] -= f * I[c];
    }
  }
  const v = new Array(n).fill(0);
  for (let l = n - 1; l >= 0; l--) {
    let s = I[l];
    for (let k = l + 1; k < n; k++) s -= G[l][k] * v[k];
    v[l] = s / G[l][l];
  }
  return v;
}

function resolver(elementos, queimadas, colunas, linhas) {
  const n = colunas * linhas;
  const no = ([i, j]) => j * colunas + i;
  const G = Array.from({length: n}, (_, l) => {
    const linha = new Array(n).fill(0);
    linha[l] = GMIN;
    return linha;
  });
  const I = new Array(n).fill(0);

  for (const e of elementos) {
    const g = condutancia(e, queimadas);
    if (g === 0) continue;
    const p = no(e.a);
    const q = no(e.b);
    G[p][p] += g;
    G[q][q] += g;
    G[p][q] -= g;
    G[q][p] -= g;
    if (e.tipo === 'battery') {
      // `a` é o terminal positivo
      const fonte = VALORES.tensao * g;
      I[p] += fonte;
      I[q] -= fonte;
    }
  }

  const v = resolverSistema(G, I);
  const porId = {};
  for (const e of elementos) {
    const g = condutancia(e, queimadas);
    const tensao = v[no(e.a)] - v[no(e.b)];
    // current de a para b pela peça; na battery, a que sai pelo positivo
    let corrente =
      e.tipo === 'battery' ? (VALORES.tensao - tensao) * g : tensao * g;
    if (Math.abs(corrente) < 1e-6) corrente = 0;
    const potencia = Math.abs(tensao * corrente);
    porId[e.id] = {
      tensao,
      corrente,
      potencia,
      brilho: e.tipo === 'bulb' ? potencia / POTENCIA_NOMINAL : 0,
    };
  }
  return porId;
}

// Resolve o circuito e queima o que passou do limite: o fuse acima de 10 A, a
// bulb acima do dobro da power normal. Queima uma peça por vez — a mais
// sobrecarregada — e resolve de novo, porque, quando ela abre, a current das
// outras muda. Devolve os resultados por peça e a lista do que queimou agora.
export function simular(elementos, colunas, linhas) {
  const queimadas = new Set();
  for (let volta = 0; volta <= elementos.length; volta++) {
    const porId = resolver(elementos, queimadas, colunas, linhas);
    let pior = null;
    let maior = 1;
    for (const e of elementos) {
      if (e.queimado || queimadas.has(e.id)) continue;
      const r = porId[e.id];
      let razao = 0;
      if (e.tipo === 'fuse') razao = Math.abs(r.corrente) / VALORES.fuse;
      if (e.tipo === 'bulb') razao = r.brilho / VALORES.limiteBulb;
      if (razao > maior) {
        maior = razao;
        pior = e.id;
      }
    }
    if (pior === null) return {porId, queimar: [...queimadas]};
    queimadas.add(pior);
  }
  return {porId: resolver(elementos, queimadas, colunas, linhas), queimar: [...queimadas]};
}
