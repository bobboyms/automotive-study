import React, {useState} from 'react';
import Motor, {estadoCiclo} from '../Motor';
import styles from './styles.module.css';
import LegendaLivro from '../LegendaLivro';

// O ciclo de quatro tempos para girar com a mão. O controle deslizante é o
// virabrequim: de 0° a 720°, duas voltas, um ciclo completo. O desenho mostra
// o pistão, as válvulas, o gás e os comandos — que giram a metade do ângulo
// do virabrequim. Os botões pulam para o meio de cada tempo.
//
// É interativo porque mexer no ângulo é a ideia: ver que as válvulas só abrem
// em um dos dois tempos em que o pistão desce (ou sobe), e que o comando dá
// meia volta enquanto o virabrequim dá uma.

const TEMPOS = [
  {id: 'admissao', k: 'intake stroke', meio: 90},
  {id: 'compressao', k: 'compression stroke', meio: 270},
  {id: 'combustao', k: 'power stroke', meio: 450},
  {id: 'escape', k: 'exhaust stroke', meio: 630},
];

export default function CicloQuatroTempos({inicio = 0, caption}) {
  const [fase, setFase] = useState(inicio);
  const e = estadoCiclo(fase);
  const tempo = TEMPOS.find((t) => t.id === e.tempo);
  const volta = fase < 360 ? 1 : 2;
  const estado = (lift) => (lift > 0.5 ? 'aberta' : 'fechada');
  return (
    <figure className={styles.figure}>
      <div className={styles.painel}>
        <div className={styles.desenho}>
          <Motor fase={fase} rotulos="nenhum" gas setas embutido ariaLabel={`Motor em ${fase}° do ciclo: ${tempo.k}.`} />
        </div>
        <div className={styles.leitura}>
          <div className={styles.tempo}>
            <button type="button" className={styles.termo} data-termo={tempo.k}>
              {tempo.k}
            </button>
          </div>
          <dl className={styles.dados}>
            <dt>virabrequim (crankshaft)</dt>
            <dd>
              {fase}° — {volta}ª volta
            </dd>
            <dt>comando (camshaft)</dt>
            <dd>{fase / 2}°</dd>
            <dt>pistão (piston)</dt>
            <dd>{e.descendo ? 'descendo' : 'subindo'}</dd>
            <dt>válvula de admissão</dt>
            <dd>{estado(e.liftAdm)}</dd>
            <dt>válvula de escape</dt>
            <dd>{estado(e.liftEsc)}</dd>
          </dl>
        </div>
      </div>
      <label className={styles.controle}>
        <span>gire o virabrequim: {fase}°</span>
        <input
          type="range"
          min={0}
          max={720}
          step={5}
          value={fase}
          onChange={(ev) => setFase(Number(ev.target.value))}
        />
      </label>
      <div className={styles.botoes}>
        {TEMPOS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={t.id === e.tempo ? styles.ativo : styles.botao}
            onClick={() => setFase(t.meio)}
          >
            {t.k}
          </button>
        ))}
      </div>
      {caption && <figcaption className={styles.caption}><LegendaLivro texto={caption} /></figcaption>}
    </figure>
  );
}
