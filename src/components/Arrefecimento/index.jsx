import React from 'react';
import RotuloTermo from '../diagramas/RotuloTermo';
import {Figura, Seta, styles} from '../diagramas/util';

// O cooling system com o motor quente e o thermostat aberto. O coolant sai
// das water jackets pelo thermostat, vai pela radiator hose de cima até o
// radiator, perde calor para o ar que o atravessa e volta pela hose de baixo
// até a water pump, que o empurra de novo para dentro do engine. Um ramo
// passa pelo heater core, que aquece a cabine.
// Tom 2 (laranja): coolant quente. Tom 1 (azul): coolant que já perdeu calor.

export default function Arrefecimento({caption}) {
  const W = 500;
  const H = 380;
  return (
    <Figura W={W} H={H} caption={caption}>
      {/* engine: bloco com o cylinder e as water jackets */}
      <rect className={styles.bloco} x={40} y={90} width={180} height={210} rx={6} />
      <rect className={styles.preenche2} x={64} y={110} width={20} height={150} rx={4} />
      <rect className={styles.preenche2} x={176} y={110} width={20} height={150} rx={4} />
      <rect className={styles.vazio} x={88} y={110} width={84} height={150} />
      <rect className={styles.metal} x={92} y={200} width={76} height={50} rx={3} />

      {/* heater core: radiador pequeno ligado ao engine por duas mangueiras */}
      <rect className={styles.preenche2} x={70} y={22} width={60} height={30} rx={3} />
      {[80, 92, 104, 116].map((x) => (
        <line key={x} className={styles.fina} x1={x} y1={24} x2={x} y2={50} />
      ))}
      <path className={styles.traco2} style={{strokeWidth: 6}} d="M 80 52 V 90" />
      <path className={styles.traco1} style={{strokeWidth: 6}} d="M 120 52 V 90" />

      {/* thermostat (aberto) na saída de cima */}
      <rect className={styles.metal} x={190} y={66} width={30} height={24} rx={3} />
      <line className={styles.linha} x1={196} y1={72} x2={214} y2={84} />

      {/* radiator hose de cima: quente */}
      <path className={styles.traco2} style={{strokeWidth: 10}} d="M 220 78 C 280 78 290 70 340 70" />
      {/* radiator: metade de cima quente, de baixo fria */}
      <rect className={styles.preenche2} x={340} y={58} width={50} height={120} />
      <rect className={styles.preenche1} x={340} y={178} width={50} height={120} />
      <rect className={styles.linha} x={340} y={58} width={50} height={240} />
      {Array.from({length: 11}, (_, i) => 78 + i * 20).map((y) => (
        <line key={y} className={styles.fina} x1={342} y1={y} x2={388} y2={y} />
      ))}
      {/* radiator cap */}
      <rect className={styles.metal} x={352} y={44} width={26} height={14} rx={3} />
      {/* radiator hose de baixo: fria, até a water pump */}
      <path className={styles.traco1} style={{strokeWidth: 10}} d="M 340 286 C 290 286 280 262 250 262" />
      {/* water pump, encostada no engine */}
      <circle className={styles.metal} cx={236} cy={262} r={16} />
      <path className={styles.linha} d="M 236 250 L 236 274 M 224 262 L 248 262" />
      <path className={styles.traco1} style={{strokeWidth: 6}} d="M 220 262 H 198" />

      {/* cooling fan, entre o engine e o radiator */}
      <rect className={styles.escuro} x={306} y={150} width={8} height={40} rx={2} />
      <ellipse className={styles.metal} cx={310} cy={130} rx={7} ry={22} />
      <ellipse className={styles.metal} cx={310} cy={210} rx={7} ry={22} />

      {/* ar atravessando o radiator */}
      <Seta de={[470, 120]} para={[400, 120]} />
      <Seta de={[470, 240]} para={[400, 240]} />

      <RotuloTermo k="heater core" x={140} y={30} />
      <RotuloTermo k="thermostat" x={232} y={54} para={[212, 68]} />
      <RotuloTermo k="radiator cap" x={396} y={36} para={[372, 46]} />
      <RotuloTermo k="radiator hose" x={232} y={118} para={[268, 82]} />
      <RotuloTermo k="radiator" x={404} y={180} />
      <RotuloTermo k="engine" x={130} y={282} anchor="middle" />
      <RotuloTermo k="water jacket" x={40} y={334} anchor="start" para={[74, 250]} de={[70, 324]} />
      <RotuloTermo k="water pump" x={180} y={334} anchor="start" para={[236, 278]} de={[220, 324]} />
      <RotuloTermo k="cooling fan" x={330} y={334} anchor="start" para={[312, 228]} de={[340, 324]} />
    </Figura>
  );
}
