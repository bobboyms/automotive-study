import React, {useEffect, useMemo, useRef, useState} from 'react';
import Simbolo, {S, M, px} from './simbolos';
import {simular, VALORES, POTENCIA_NOMINAL} from './simular';
import styles from './styles.module.css';

// Laboratório de circuits: uma bancada em grade onde o aluno arrasta battery,
// bulb, switch, fuse e wire, liga as peças e vê o circuit funcionar. Cada peça
// ocupa um trecho entre dois pontos vizinhos da grade; peças que tocam o mesmo
// ponto estão ligadas. A simulação (`simular.js`) resolve o circuit inteiro a
// cada mudança.
//
// É interativo porque montar é a ideia: descobrir com a mão que a current só
// circula num caminho completo, que duas bulbs em série dividem a voltage e
// que um short circuit queima o fuse.
//
// A montagem fica salva no navegador, uma por `id`: duas bancadas na mesma
// página precisam de ids diferentes.

const COLUNAS = 8;
const LINHAS = 6;
const W = 2 * M + S * (COLUNAS - 1);
const H = 2 * M + S * (LINHAS - 1);
const ARRASTO = 6; // deslocamento, em unidades do desenho, que separa toque de arrasto

const PECAS = ['battery', 'bulb', 'switch', 'fuse', 'wire'];
const DIRECOES = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

// Trechos de wire de um ponto a outro: primeiro na horizontal, depois na
// vertical, um trecho por espaço da grade.
function trechos(de, ate) {
  const lista = [];
  let [i, j] = de;
  while (i !== ate[0] || j !== ate[1]) {
    const prox = i !== ate[0] ? [i + Math.sign(ate[0] - i), j] : [i, j + Math.sign(ate[1] - j)];
    lista.push([[i, j], prox]);
    [i, j] = prox;
  }
  return lista;
}

function caminho(pontos) {
  return pontos.slice(1).flatMap((p, k) => trechos(pontos[k], p).map(([a, b]) => ['wire', a, b]));
}

// Montagens prontas. `simples` é o circuit da lição 2: battery, fuse, switch e
// bulb num laço, na ordem dos esquemas — fonte, proteção, controle, carga.
const MONTAGENS = {
  vazio: [],
  simples: [
    ['battery', [1, 2], [1, 3]],
    ...caminho([
      [1, 2],
      [1, 1],
    ]),
    ['fuse', [1, 1], [2, 1]],
    ['switch', [2, 1], [3, 1]],
    ...caminho([
      [3, 1],
      [6, 1],
      [6, 2],
    ]),
    ['bulb', [6, 2], [6, 3]],
    ...caminho([
      [6, 3],
      [6, 4],
      [1, 4],
      [1, 3],
    ]),
  ],
};

function montar(nome) {
  return (MONTAGENS[nome] ?? []).map(([tipo, a, b], k) => ({id: k + 1, tipo, a, b}));
}

const chave = (a, b) => {
  const p = a.join(',');
  const q = b.join(',');
  return p < q ? `${p}|${q}` : `${q}|${p}`;
};
const igual = (p, q) => p[0] === q[0] && p[1] === q[1];
const dentro = ([i, j]) => i >= 0 && j >= 0 && i < COLUNAS && j < LINHAS;
const limitar = (v, max) => Math.max(0, Math.min(max, v));

function ocupado(elementos, a, b, ignorar) {
  const k = chave(a, b);
  return elementos.some((e) => e.id !== ignorar && chave(e.a, e.b) === k);
}

function pontoPerto(x, y) {
  return [
    limitar(Math.round((x - M) / S), COLUNAS - 1),
    limitar(Math.round((y - M) / S), LINHAS - 1),
  ];
}

// Trecho da grade mais perto do centro (x, y), na direção d.
function encaixar(x, y, d) {
  let a = [Math.round((x - M) / S - d[0] / 2), Math.round((y - M) / S - d[1] / 2)];
  const desloca = (k, max) => {
    const menor = Math.min(a[k], a[k] + d[k]);
    const maior = Math.max(a[k], a[k] + d[k]);
    if (menor < 0) return -menor;
    if (maior > max) return max - maior;
    return 0;
  };
  a = [a[0] + desloca(0, COLUNAS - 1), a[1] + desloca(1, LINHAS - 1)];
  return {a, b: [a[0] + d[0], a[1] + d[1]]};
}

function valida(dados) {
  if (!Array.isArray(dados)) return null;
  const ok = dados.every(
    (e) =>
      e &&
      Number.isInteger(e.id) &&
      PECAS.includes(e.tipo) &&
      Array.isArray(e.a) &&
      Array.isArray(e.b) &&
      dentro(e.a) &&
      dentro(e.b),
  );
  return ok ? dados : null;
}

// Números com ponto decimal, como no multimeter.
function volts(v) {
  const a = Math.abs(v);
  return `${a < 1 ? a.toFixed(2) : a.toFixed(1)} V`;
}
function amps(i) {
  const a = Math.abs(i);
  if (a >= 100) return `${Math.round(a)} A`;
  return `${a >= 10 ? a.toFixed(1) : a.toFixed(2)} A`;
}
function watts(p) {
  return `${p >= 100 ? Math.round(p) : p.toFixed(1)} W`;
}

export default function LabCircuito({id = 'livre', inicial = 'vazio', caption}) {
  const [elementos, setElementos] = useState(() => montar(inicial));
  const [selecionado, setSelecionado] = useState(null);
  const [arrasto, setArrasto] = useState(null); // peça sendo movida: {id, a, b, valido}
  const [fantasma, setFantasma] = useState(null); // peça nova vindo da paleta
  const [rascunho, setRascunho] = useState(null); // wire sendo puxado: {de, ate}
  const [aviso, setAviso] = useState(null);
  const [carregado, setCarregado] = useState(false);
  const svgRef = useRef(null);
  const gesto = useRef(null);
  const paleta = useRef(null);
  const semClique = useRef(0); // hora do último arrasto vindo da paleta
  const salvo = `lab-circuito-v1:${id}`;

  // A montagem salva só é lida depois de a página abrir no navegador: no build
  // não existe localStorage, e a primeira pintura precisa ser igual à do build.
  useEffect(() => {
    try {
      const dados = valida(JSON.parse(localStorage.getItem(salvo)));
      if (dados) setElementos(dados);
    } catch {}
    setCarregado(true);
  }, [salvo]);

  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(salvo, JSON.stringify(elementos));
    } catch {}
  }, [elementos, carregado, salvo]);

  const sim = useMemo(() => simular(elementos, COLUNAS, LINHAS), [elementos]);

  // O que passou do limite na simulação queima de verdade: fica queimado até o
  // aluno trocar a peça.
  useEffect(() => {
    if (sim.queimar.length === 0) return;
    setElementos((els) =>
      els.map((e) =>
        sim.queimar.includes(e.id)
          ? {...e, queimado: e.tipo === 'bulb' ? 'sobrecarga' : true}
          : e,
      ),
    );
  }, [sim]);

  const proximoId = () => elementos.reduce((m, e) => Math.max(m, e.id), 0) + 1;

  function paraDesenho(clientX, clientY) {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    return {x: p.x, y: p.y};
  }

  function adicionar(tipo, a, b) {
    const nova = {id: proximoId(), tipo, a, b};
    setElementos((els) => [...els, nova]);
    setSelecionado(nova.id);
    setAviso(null);
  }

  // Peça tocada na paleta, sem arrastar: entra num trecho livre, longe das
  // outras peças, para não ficar ligada a nada sem querer.
  function adicionarLivre(tipo) {
    const usados = new Set(elementos.flatMap((e) => [e.a.join(','), e.b.join(',')]));
    let livre = null;
    let qualquer = null;
    for (let j = 0; j < LINHAS && !livre; j++) {
      for (let i = 0; i < COLUNAS - 1 && !livre; i++) {
        const a = [i, j];
        const b = [i + 1, j];
        if (ocupado(elementos, a, b)) continue;
        qualquer = qualquer ?? {a, b};
        if (!usados.has(a.join(',')) && !usados.has(b.join(','))) livre = {a, b};
      }
    }
    const lugar = livre ?? qualquer;
    if (!lugar) {
      setAviso('A bancada está cheia. Apague uma peça para abrir espaço.');
      return;
    }
    adicionar(tipo, lugar.a, lugar.b);
  }

  function criarFio(de, ate) {
    const lista = trechos(de, ate);
    if (lista.some(([a, b]) => elementos.some((e) => e.tipo !== 'wire' && chave(e.a, e.b) === chave(a, b)))) {
      setAviso('O wire passaria por cima de uma peça. Puxe o wire por outro caminho.');
      return;
    }
    let n = proximoId();
    const novos = lista
      .filter(([a, b]) => !ocupado(elementos, a, b))
      .map(([a, b]) => ({id: n++, tipo: 'wire', a, b}));
    setElementos((els) => [...els, ...novos]);
    setSelecionado(null);
    setAviso(null);
  }

  function alterar(idPeca, mudanca) {
    setElementos((els) => els.map((e) => (e.id === idPeca ? {...e, ...mudanca} : e)));
  }

  function apagar(idPeca) {
    setElementos((els) => els.filter((e) => e.id !== idPeca));
    setSelecionado(null);
  }

  // Gira a peça um quarto de volta em torno do terminal `a`. Na battery, duas
  // voltas trocam o + de lado.
  function girar(peca) {
    const d = [peca.b[0] - peca.a[0], peca.b[1] - peca.a[1]];
    const k = DIRECOES.findIndex((x) => igual(x, d));
    for (let passo = 1; passo < 4; passo++) {
      const nd = DIRECOES[(k + passo) % 4];
      const b = [peca.a[0] + nd[0], peca.a[1] + nd[1]];
      if (dentro(b) && !ocupado(elementos, peca.a, b, peca.id)) {
        alterar(peca.id, {b});
        setAviso(null);
        return;
      }
    }
    setAviso('Não há espaço para girar a peça aqui. Arraste para um lugar livre e tente de novo.');
  }

  // --- gestos na bancada ---------------------------------------------------

  function pegarPeca(ev, peca) {
    ev.stopPropagation();
    svgRef.current.setPointerCapture(ev.pointerId);
    const p = paraDesenho(ev.clientX, ev.clientY);
    const [ax, ay] = px(peca.a);
    const [bx, by] = px(peca.b);
    gesto.current = {
      tipo: 'mover',
      peca,
      x0: p.x,
      y0: p.y,
      cx: (ax + bx) / 2,
      cy: (ay + by) / 2,
      moveu: false,
    };
  }

  function pegarPonto(ev, ponto) {
    ev.stopPropagation();
    svgRef.current.setPointerCapture(ev.pointerId);
    const p = paraDesenho(ev.clientX, ev.clientY);
    gesto.current = {tipo: 'fio', de: ponto, x0: p.x, y0: p.y, moveu: false};
  }

  function mover(ev) {
    const g = gesto.current;
    if (!g) return;
    const p = paraDesenho(ev.clientX, ev.clientY);
    if (!g.moveu && Math.hypot(p.x - g.x0, p.y - g.y0) < ARRASTO) return;
    g.moveu = true;
    if (g.tipo === 'mover') {
      const d = [g.peca.b[0] - g.peca.a[0], g.peca.b[1] - g.peca.a[1]];
      const {a, b} = encaixar(g.cx + p.x - g.x0, g.cy + p.y - g.y0, d);
      setArrasto({id: g.peca.id, a, b, valido: !ocupado(elementos, a, b, g.peca.id)});
    } else {
      setRascunho({de: g.de, ate: pontoPerto(p.x, p.y)});
    }
  }

  function soltar() {
    const g = gesto.current;
    gesto.current = null;
    if (!g) return;
    if (g.tipo === 'mover') {
      if (!g.moveu) {
        // toque: seleciona; no switch, também abre ou fecha
        setSelecionado(g.peca.id);
        if (g.peca.tipo === 'switch') alterar(g.peca.id, {aberto: !g.peca.aberto});
      } else if (arrasto?.valido) {
        alterar(g.peca.id, {a: arrasto.a, b: arrasto.b});
        setSelecionado(g.peca.id);
      } else if (arrasto) {
        setAviso('Esse lugar já tem uma peça. A peça voltou para onde estava.');
      }
      setArrasto(null);
    } else {
      if (rascunho && !igual(rascunho.de, rascunho.ate)) criarFio(rascunho.de, rascunho.ate);
      else setSelecionado(null);
      setRascunho(null);
    }
  }

  function cancelar() {
    gesto.current = null;
    setArrasto(null);
    setRascunho(null);
  }

  // --- paleta: arrastar uma peça nova para a bancada ------------------------

  function lugarNaBancada(ev) {
    const p = paraDesenho(ev.clientX, ev.clientY);
    if (p.x < 0 || p.y < 0 || p.x > W || p.y > H) return null;
    return encaixar(p.x, p.y, [1, 0]);
  }

  function paletaDown(ev, tipo) {
    ev.currentTarget.setPointerCapture(ev.pointerId);
    paleta.current = {tipo, x: ev.clientX, y: ev.clientY, moveu: false};
  }

  function paletaMove(ev) {
    const g = paleta.current;
    if (!g) return;
    if (!g.moveu && Math.hypot(ev.clientX - g.x, ev.clientY - g.y) < ARRASTO) return;
    g.moveu = true;
    const lugar = lugarNaBancada(ev);
    setFantasma(lugar && {tipo: g.tipo, ...lugar, valido: !ocupado(elementos, lugar.a, lugar.b)});
  }

  function paletaUp(ev) {
    const g = paleta.current;
    paleta.current = null;
    setFantasma(null);
    if (!g?.moveu) return; // toque: o onClick trata
    // o clique que o navegador às vezes dispara depois do arrasto não pode pôr
    // uma segunda peça; no toque ele nem sempre vem, então vale só por instantes
    semClique.current = Date.now();
    const lugar = lugarNaBancada(ev);
    if (!lugar) return;
    if (ocupado(elementos, lugar.a, lugar.b)) {
      setAviso('Esse lugar já tem uma peça. Solte a peça nova num trecho livre.');
      return;
    }
    adicionar(g.tipo, lugar.a, lugar.b);
  }

  function paletaClick(tipo) {
    if (Date.now() - semClique.current < 500) return;
    adicionarLivre(tipo);
  }

  function teclado(ev) {
    const peca = elementos.find((e) => e.id === selecionado);
    if (!peca) return;
    if (ev.key === 'Delete' || ev.key === 'Backspace') {
      ev.preventDefault();
      apagar(peca.id);
    } else if (ev.key === 'r' || ev.key === 'R') {
      girar(peca);
    }
  }

  // --- desenho ------------------------------------------------------------

  // pontos onde três ou mais pontas se encontram ganham o ponto de ligação
  const pontas = new Map();
  for (const e of elementos) {
    for (const p of [e.a, e.b]) pontas.set(p.join(','), (pontas.get(p.join(',')) ?? 0) + 1);
  }
  const nos = [...pontas].filter(([, n]) => n >= 3).map(([k]) => k.split(',').map(Number));

  const pontos = [];
  for (let j = 0; j < LINHAS; j++) for (let i = 0; i < COLUNAS; i++) pontos.push([i, j]);

  const peca = elementos.find((e) => e.id === selecionado);
  const r = peca && sim.porId[peca.id];

  return (
    <figure className={styles.figure}>
      <div className={styles.paleta} role="toolbar" aria-label="Peças para a bancada">
        {PECAS.map((tipo) => (
          <button
            key={tipo}
            type="button"
            className={styles.peca}
            onPointerDown={(ev) => paletaDown(ev, tipo)}
            onPointerMove={paletaMove}
            onPointerUp={paletaUp}
            onPointerCancel={() => {
              paleta.current = null;
              setFantasma(null);
            }}
            onClick={() => paletaClick(tipo)}
            aria-label={`Pôr ${tipo} na bancada`}
          >
            <svg viewBox="-4 -38 68 62" className={styles.icone} aria-hidden="true">
              <Simbolo peca={{tipo, a: [0, 0], b: [1, 0]}} origem={[0, 0]} />
            </svg>
            <span>{tipo}</span>
          </button>
        ))}
      </div>

      <svg
        ref={svgRef}
        className={styles.bancada}
        viewBox={`0 0 ${W} ${H}`}
        role="application"
        aria-label="Bancada do laboratório de circuits"
        tabIndex={0}
        onKeyDown={teclado}
        onPointerDown={() => setSelecionado(null)}
        onPointerMove={mover}
        onPointerUp={soltar}
        onPointerCancel={cancelar}
      >
        {pontos.map((p) => {
          const [x, y] = px(p);
          return <circle key={p.join(',')} className={styles.ponto} cx={x} cy={y} r={2.5} />;
        })}

        {elementos.map((e) => {
          const movendo = arrasto?.id === e.id;
          const pos = movendo ? {...e, a: arrasto.a, b: arrasto.b} : e;
          return (
            <g key={e.id} className={movendo && !arrasto.valido ? styles.invalido : undefined}>
              <Simbolo peca={pos} brilho={sim.porId[e.id]?.brilho} />
            </g>
          );
        })}

        {/* a current nos wires: pontos andando no sentido convencional, do +
            para o −, mais depressa quanto maior a current */}
        {elementos.map((e) => {
          if (e.tipo !== 'wire' || arrasto?.id === e.id) return null;
          const i = sim.porId[e.id]?.corrente ?? 0;
          if (Math.abs(i) < 0.001) return null;
          const [x1, y1] = px(i > 0 ? e.a : e.b);
          const [x2, y2] = px(i > 0 ? e.b : e.a);
          const velocidade = Math.min(300, Math.max(6, 20 * Math.sqrt(Math.abs(i) / 0.5)));
          return (
            <line
              key={`c${e.id}`}
              className={styles.corrente}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              style={{animationDuration: `${15 / velocidade}s`}}
            />
          );
        })}

        {nos.map((p) => {
          const [x, y] = px(p);
          return <circle key={`n${p.join(',')}`} className={styles.no} cx={x} cy={y} r={4.5} />;
        })}

        {peca && !arrasto && <Selecao peca={peca} />}

        {fantasma && (
          <g className={fantasma.valido ? styles.fantasma : styles.invalido}>
            <Simbolo peca={fantasma} />
          </g>
        )}

        {/* áreas de toque: as peças embaixo, os pontos da grade por cima, para
            que puxar perto de uma ponta comece um wire */}
        {elementos.map((e) => {
          const [x1, y1] = px(e.a);
          const [x2, y2] = px(e.b);
          return (
            <line
              key={`h${e.id}`}
              className={styles.alvoPeca}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              onPointerDown={(ev) => pegarPeca(ev, e)}
            />
          );
        })}
        {pontos.map((p) => {
          const [x, y] = px(p);
          return (
            <circle
              key={`a${p.join(',')}`}
              className={styles.alvoPonto}
              cx={x}
              cy={y}
              r={15}
              onPointerDown={(ev) => pegarPonto(ev, p)}
            />
          );
        })}

        {rascunho && (
          <polyline
            className={styles.rascunho}
            points={[rascunho.de, [rascunho.ate[0], rascunho.de[1]], rascunho.ate]
              .map((p) => px(p).join(' '))
              .join(' ')}
          />
        )}
      </svg>

      <Painel
        peca={peca}
        r={r}
        elementos={elementos}
        sim={sim}
        aviso={aviso}
        girar={girar}
        alterar={alterar}
        apagar={apagar}
        recomecar={() => {
          setElementos(montar(inicial));
          setSelecionado(null);
          setAviso(null);
        }}
        limpar={() => {
          setElementos([]);
          setSelecionado(null);
          setAviso(null);
        }}
        inicial={inicial}
      />

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}

function Selecao({peca}) {
  const [x, y] = px(peca.a);
  const g = (Math.atan2(peca.b[1] - peca.a[1], peca.b[0] - peca.a[0]) * 180) / Math.PI;
  return (
    <rect
      className={styles.selecao}
      x={9}
      y={-24}
      width={S - 18}
      height={48}
      rx={8}
      transform={`translate(${x} ${y}) rotate(${g})`}
    />
  );
}

function Termo({k}) {
  return (
    <button type="button" className={styles.termo} data-termo={k}>
      {k}
    </button>
  );
}

// Estado do circuit inteiro, em uma ou duas frases.
function situacao(elementos, sim) {
  const frases = [];
  const baterias = elementos.filter((e) => e.tipo === 'battery');
  const correnteBateria = Math.max(0, ...baterias.map((e) => Math.abs(sim.porId[e.id].corrente)));
  const acesas = elementos.filter((e) => e.tipo === 'bulb' && sim.porId[e.id].brilho > 0.02).length;

  if (baterias.length === 0) {
    frases.push({texto: 'Ponha uma battery na bancada: sem power source, a current não tem quem a empurre.'});
  } else if (correnteBateria > 30) {
    frases.push({
      alerta: true,
      texto: `Short circuit: saem ${amps(correnteBateria)} da battery, por um caminho quase sem resistance. Num carro, essa current esquenta o wire até derreter o insulator. É para isso que existe o fuse.`,
    });
  } else if (correnteBateria < 0.001) {
    frases.push({
      texto: 'A current não circula: não existe um complete circuit. Ela precisa de um caminho que sai do + da battery, passa pelas peças e volta ao −.',
    });
  } else {
    const lampadas = acesas === 1 ? '1 bulb acesa' : `${acesas} bulbs acesas`;
    frases.push({texto: `Saem ${amps(correnteBateria)} da battery. ${acesas ? lampadas : 'Nenhuma bulb acesa'}.`});
  }
  if (elementos.some((e) => e.tipo === 'fuse' && e.queimado)) {
    frases.push({
      alerta: true,
      texto: `Um fuse queimou: passaram por ele mais de ${VALORES.fuse} A. Ache e desfaça o short circuit antes de trocar o fuse; senão, o novo queima também.`,
    });
  }
  if (elementos.some((e) => e.tipo === 'bulb' && e.queimado === 'sobrecarga')) {
    frases.push({
      alerta: true,
      texto: `Uma bulb queimou: recebeu voltage demais, e a power passou de ${VALORES.limiteBulb} vezes a normal.`,
    });
  }
  return frases;
}

function Painel({peca, r, elementos, sim, aviso, girar, alterar, apagar, recomecar, limpar, inicial}) {
  const linhas = [];
  if (peca && r) {
    if (peca.tipo === 'battery') {
      linhas.push(['voltage nos terminals', volts(r.tensao)]);
      linhas.push(['current que sai do +', amps(r.corrente)]);
    } else if (peca.tipo === 'bulb') {
      linhas.push(['estado', peca.queimado ? 'queimada (filamento partido)' : r.brilho > 0.02 ? 'acesa' : 'apagada']);
      linhas.push(['voltage drop', volts(r.tensao)]);
      linhas.push(['current', amps(r.corrente)]);
      linhas.push(['power', watts(r.potencia)]);
      if (!peca.queimado) linhas.push(['brilho', `${Math.round(r.brilho * 100)}% do normal`]);
    } else if (peca.tipo === 'switch') {
      linhas.push(['estado', peca.aberto ? 'aberto (desligado)' : 'fechado (ligado)']);
      linhas.push(['voltage entre os dois lados', volts(r.tensao)]);
      linhas.push(['current', amps(r.corrente)]);
    } else if (peca.tipo === 'fuse') {
      linhas.push(['estado', peca.queimado ? 'queimado (aberto)' : 'inteiro']);
      linhas.push(['queima acima de', `${VALORES.fuse} A`]);
      linhas.push(['current', amps(r.corrente)]);
      if (peca.queimado) linhas.push(['voltage entre os dois lados', volts(r.tensao)]);
    } else {
      linhas.push(['current', amps(r.corrente)]);
      linhas.push(['voltage drop', volts(r.tensao)]);
    }
  }

  return (
    <div className={styles.painel} aria-live="polite">
      {situacao(elementos, sim).map((f) => (
        <p key={f.texto} className={f.alerta ? styles.alerta : styles.situacao}>
          {f.texto}
        </p>
      ))}
      {aviso && <p className={styles.aviso}>{aviso}</p>}

      {peca && r ? (
        <div className={styles.leitura}>
          <div className={styles.nome}>
            <Termo k={peca.tipo} />
          </div>
          <dl className={styles.dados}>
            {linhas.map(([k, v]) => (
              <React.Fragment key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </React.Fragment>
            ))}
          </dl>
          <div className={styles.acoes}>
            {peca.tipo === 'switch' && (
              <button type="button" className={styles.botao} onClick={() => alterar(peca.id, {aberto: !peca.aberto})}>
                {peca.aberto ? 'Fechar o switch' : 'Abrir o switch'}
              </button>
            )}
            {peca.tipo === 'bulb' && (
              <button
                type="button"
                className={styles.botao}
                onClick={() => alterar(peca.id, {queimado: peca.queimado ? false : 'manual'})}
              >
                {peca.queimado ? 'Trocar a bulb' : 'Queimar a bulb'}
              </button>
            )}
            {peca.tipo === 'fuse' && peca.queimado && (
              <button type="button" className={styles.botao} onClick={() => alterar(peca.id, {queimado: false})}>
                Trocar o fuse
              </button>
            )}
            <button type="button" className={styles.botao} onClick={() => girar(peca)}>
              Girar
            </button>
            <button type="button" className={styles.botao} onClick={() => apagar(peca.id)}>
              Apagar
            </button>
          </div>
        </div>
      ) : (
        <p className={styles.dica}>
          Toque numa peça para ver a voltage e a current nela.
        </p>
      )}

      <div className={styles.acoesBancada}>
        {inicial !== 'vazio' && (
          <button type="button" className={styles.botaoLeve} onClick={recomecar}>
            Recomeçar a montagem
          </button>
        )}
        <button type="button" className={styles.botaoLeve} onClick={limpar}>
          Limpar a bancada
        </button>
      </div>
      <p className={styles.nota}>
        Valores ilustrativos: battery de {VALORES.tensao} V, bulb de {VALORES.rBulb} Ω (
        {POTENCIA_NOMINAL} W em {VALORES.tensao} V), fuse de {VALORES.fuse} A e wire quase sem
        resistance.
      </p>
    </div>
  );
}
