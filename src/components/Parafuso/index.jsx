import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import styles from './styles.module.css';
import LegendaLivro from '../LegendaLivro';

// O parafuso de perto.
//
//   modo="anatomia"  bolt de lado, com a vista da cabeça: bolt head, shank,
//                    threads, e as três medidas que identificam o bolt —
//                    diameter, thread pitch e length (da face de baixo da
//                    cabeça até a ponta) — mais o wrench size
//   modo="aperto"    head bolt prendendo o cylinder head no cylinder block,
//                    com a head gasket no meio: o bolt estica (tom 2) e as
//                    peças são apertadas uma contra a outra (tom 1)
//
// Cores: tom 2 (laranja) é a tensão do bolt; tom 1 (azul) é o clamp load.

function Seta({de, para, cls}) {
  const ang = Math.atan2(para[1] - de[1], para[0] - de[0]);
  const p = (a) => `${para[0] - 9 * Math.cos(ang + a)} ${para[1] - 9 * Math.sin(ang + a)}`;
  return (
    <g className={cls}>
      <line x1={de[0]} y1={de[1]} x2={para[0]} y2={para[1]} />
      <path d={`M ${p(0.5)} L ${para[0]} ${para[1]} L ${p(-0.5)}`} />
    </g>
  );
}

function Anatomia({caption}) {
  const W = 560;
  const H = 240;
  const cy = 100; // eixo do bolt
  const r = 34; // raio da hexagonal vista de frente
  const hx = 62;
  const hex = [0, 60, 120, 180, 240, 300]
    .map((a) => `${hx + r * Math.cos((a * Math.PI) / 180)},${cy + r * Math.sin((a * Math.PI) / 180)}`)
    .join(' ');
  const meio = r * Math.cos(Math.PI / 6); // meia distância entre faces
  const x0 = 160; // face de baixo da cabeça
  const x1 = 300; // começo das roscas
  const x2 = 430; // ponta
  const d = 17; // meio diâmetro
  const passo = 14;
  const ticks = [];
  for (let x = x1; x < x2 - passo / 2; x += passo) ticks.push(x);
  return (
    <figure className={styles.figure}>
      <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label={caption}>
        {/* vista de frente da cabeça e a abertura da chave */}
        <polygon className={styles.parafuso} points={hex} />
        <circle className={styles.cota} cx={hx} cy={cy} r={d} />
        <line className={styles.guia} x1={hx - 40} y1={cy - meio} x2={hx + 10} y2={cy - meio} />
        <line className={styles.guia} x1={hx - 40} y1={cy + meio} x2={hx + 10} y2={cy + meio} />
        <Seta de={[hx - 28, cy - meio - 22]} para={[hx - 28, cy - meio]} cls={styles.cota} />
        <Seta de={[hx - 28, cy + meio + 22]} para={[hx - 28, cy + meio]} cls={styles.cota} />
        <RotuloTermo k="wrench size" texto={'wrench\nsize'} x={hx} y={cy + meio + 30} anchor="middle" fs={18} />
        {/* bolt de lado */}
        <rect className={styles.parafuso} x={x0 - 30} y={cy - meio} width={30} height={2 * meio} />
        <rect className={styles.parafuso} x={x0} y={cy - d} width={x2 - x0 - 8} height={2 * d} />
        <path className={styles.parafuso} d={`M ${x2 - 8} ${cy - d} L ${x2} ${cy - d + 6} V ${cy + d - 6} L ${x2 - 8} ${cy + d} Z`} />
        {ticks.map((x) => (
          <line key={x} className={styles.rosca} x1={x} y1={cy + d} x2={x + passo / 2} y2={cy - d} />
        ))}
        {/* rótulos de cima */}
        <RotuloTermo k="bolt head" x={x0 - 20} y={28} anchor="middle" para={[x0 - 16, cy - meio]} fs={18} />
        <RotuloTermo k="shank" x={235} y={28} anchor="middle" para={[235, cy - d]} fs={18} />
        <RotuloTermo k="thread" texto="threads" x={365} y={28} anchor="middle" para={[365, cy - d]} fs={18} />
        {/* thread pitch: dois filetes vizinhos */}
        <line className={styles.guia} x1={x1 + 2 * passo} y1={cy + d} x2={x1 + 2 * passo} y2={cy + d + 36} />
        <line className={styles.guia} x1={x1 + 3 * passo} y1={cy + d} x2={x1 + 3 * passo} y2={cy + d + 36} />
        <Seta de={[x1 + 2 * passo - 26, cy + d + 28]} para={[x1 + 2 * passo, cy + d + 28]} cls={styles.cota} />
        <Seta de={[x1 + 3 * passo + 26, cy + d + 28]} para={[x1 + 3 * passo, cy + d + 28]} cls={styles.cota} />
        <RotuloTermo k="thread pitch" x={x1 + 2.5 * passo} y={cy + d + 50} anchor="middle" fs={18} />
        {/* length: da face de baixo da cabeça até a ponta */}
        <line className={styles.guia} x1={x0} y1={cy + d + 4} x2={x0} y2={196} />
        <line className={styles.guia} x1={x2} y1={cy + d + 4} x2={x2} y2={196} />
        <line className={styles.cota} x1={x0 + 2} y1={188} x2={x2 - 2} y2={188} />
        <Seta de={[x0 + 40, 188]} para={[x0, 188]} cls={styles.cota} />
        <Seta de={[x2 - 40, 188]} para={[x2, 188]} cls={styles.cota} />
        <RotuloTermo k="bolt length" texto="length" x={(x0 + x2) / 2} y={214} anchor="middle" fs={18} />
        {/* diameter */}
        <line className={styles.guia} x1={x2 - 20} y1={cy - d} x2={x2 + 34} y2={cy - d} />
        <line className={styles.guia} x1={x2 - 20} y1={cy + d} x2={x2 + 34} y2={cy + d} />
        <Seta de={[x2 + 28, cy - d - 24]} para={[x2 + 28, cy - d]} cls={styles.cota} />
        <Seta de={[x2 + 28, cy + d + 24]} para={[x2 + 28, cy + d]} cls={styles.cota} />
        <RotuloTermo k="bolt diameter" texto="diameter" x={x2 + 40} y={cy} fs={18} />
      </svg>
      {caption && <figcaption className={styles.caption}><LegendaLivro texto={caption} /></figcaption>}
    </figure>
  );
}

function Aperto({caption}) {
  const W = 460;
  const H = 350;
  const bx = 150; // lado esquerdo do bolt
  const bw = 20;
  const furo = 5; // folga do furo no cylinder head, exagerada
  const topo = 70; // face de cima do cylinder head
  const fundo = 140; // face de baixo do cylinder head
  const bloco = 150; // face de cima do cylinder block
  const ponta = 262;
  const roscas = [];
  for (let y = 196; y < ponta - 4; y += 12) roscas.push(y);
  return (
    <figure className={styles.figure}>
      <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label={caption}>
        {/* cylinder block com o furo roscado */}
        <path className={styles.peca} fillRule="evenodd" d={`M 40 ${bloco} H 300 V 280 H 40 Z M ${bx} ${bloco} H ${bx + bw} V ${ponta + 4} H ${bx} Z`} />
        {/* head gasket */}
        <path className={styles.junta} fillRule="evenodd" d={`M 40 ${fundo} H 300 V ${bloco} H 40 Z M ${bx - furo} ${fundo} H ${bx + bw + furo} V ${bloco} H ${bx - furo} Z`} />
        {/* cylinder head com o furo de passagem */}
        <path className={styles.peca} fillRule="evenodd" d={`M 40 ${topo} H 300 V ${fundo} H 40 Z M ${bx - furo} ${topo} H ${bx + bw + furo} V ${fundo} H ${bx - furo} Z`} />
        {/* bolt: cabeça, corpo e roscas dentro do block */}
        <rect className={styles.parafuso} x={bx - 22} y={40} width={bw + 44} height={30} />
        <rect className={styles.parafuso} x={bx} y={topo} width={bw} height={ponta - topo} />
        {roscas.map((y) => (
          <line key={y} className={styles.rosca} x1={bx} y1={y + 8} x2={bx + bw} y2={y} />
        ))}
        {/* tensão: o bolt é puxado nas duas pontas */}
        <Seta de={[bx + bw / 2, 124]} para={[bx + bw / 2, 96]} cls={styles.tensao} />
        <Seta de={[bx + bw / 2, 176]} para={[bx + bw / 2, 204]} cls={styles.tensao} />
        {/* clamp load: as duas peças são apertadas contra a head gasket */}
        <Seta de={[80, 92]} para={[80, 130]} cls={styles.aperto} />
        <Seta de={[80, 206]} para={[80, 162]} cls={styles.aperto} />
        <Seta de={[255, 92]} para={[255, 130]} cls={styles.aperto} />
        <Seta de={[255, 206]} para={[255, 162]} cls={styles.aperto} />
        {/* rótulos */}
        <RotuloTermo k="head bolt" x={318} y={48} para={[bx + bw + 22, 52]} />
        <RotuloTermo k="cylinder head" x={318} y={105} para={[300, 105]} />
        <RotuloTermo k="head gasket" x={318} y={145} para={[300, 145]} />
        <RotuloTermo k="cylinder block" texto={'cylinder\nblock'} x={318} y={218} para={[300, 218]} />
        {/* legenda das cores */}
        <Seta de={[26, 306]} para={[26, 322]} cls={styles.tensao} />
        <text className={styles.texto} x={44} y={318} fontSize={15}>tensão: o bolt estica</text>
        <Seta de={[26, 332]} para={[26, 346]} cls={styles.aperto} />
        <text className={styles.texto} x={44} y={343} fontSize={15}>as peças são apertadas: </text>
        <RotuloTermo k="clamp load" x={220} y={338} tone={1} />
      </svg>
      {caption && <figcaption className={styles.caption}><LegendaLivro texto={caption} /></figcaption>}
    </figure>
  );
}

export default function Parafuso({modo = 'anatomia', caption}) {
  if (modo === 'aperto') return <Aperto caption={caption} />;
  return <Anatomia caption={caption} />;
}
