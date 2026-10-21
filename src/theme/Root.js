import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import dicionario from '@site/src/data/termos.json';
import styles from './Root.module.css';

// Balão com o português de um termo técnico. Um só balão para o site todo:
// ele escuta o clique em qualquer elemento com `data-termo` — o botão <Termo>
// do texto ou o rótulo de uma figura — e aparece logo abaixo dele (ou acima,
// se não couber). Fecha com outro clique, com Esc ou quando a página rola.

const porChave = new Map(dicionario.termos.map((t) => [t.en, t]));

function Balao() {
  const [aberto, setAberto] = useState(null); // {chave, alvo}
  const [pos, setPos] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const abrir = (alvo) => {
      const chave = alvo.getAttribute('data-termo');
      setAberto((atual) =>
        atual && atual.alvo === alvo ? null : {chave, alvo},
      );
    };
    const clique = (e) => {
      const alvo = e.target.closest?.('[data-termo]');
      if (alvo) abrir(alvo);
      else if (!ref.current?.contains(e.target)) setAberto(null);
    };
    // Rótulo de figura é <text> de SVG: não vira botão, então Enter e espaço
    // precisam ser tratados aqui. O <button> do texto já dispara o clique.
    const tecla = (e) => {
      if (e.key === 'Escape') setAberto(null);
      const alvo = e.target.closest?.('[data-termo]');
      if (alvo && alvo.tagName !== 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        abrir(alvo);
      }
    };
    const fechar = () => setAberto(null);
    document.addEventListener('click', clique);
    document.addEventListener('keydown', tecla);
    window.addEventListener('scroll', fechar, {passive: true});
    window.addEventListener('resize', fechar);
    return () => {
      document.removeEventListener('click', clique);
      document.removeEventListener('keydown', tecla);
      window.removeEventListener('scroll', fechar);
      window.removeEventListener('resize', fechar);
    };
  }, []);

  useLayoutEffect(() => {
    if (!aberto || !ref.current) {
      setPos(null);
      return;
    }
    const r = aberto.alvo.getBoundingClientRect();
    const b = ref.current.getBoundingClientRect();
    const margem = 8;
    const vw = document.documentElement.clientWidth;
    let left = r.left + r.width / 2 - b.width / 2;
    left = Math.max(margem, Math.min(left, vw - b.width - margem));
    let top = r.bottom + margem;
    if (top + b.height > window.innerHeight - margem && r.top - b.height - margem > 0) {
      top = r.top - b.height - margem;
    }
    setPos({left, top});
  }, [aberto]);

  if (!aberto) return null;
  const t = porChave.get(aberto.chave);
  if (!t) return null;
  return (
    <div
      ref={ref}
      className={styles.balao}
      role="tooltip"
      aria-live="polite"
      style={pos ? {left: pos.left, top: pos.top} : {visibility: 'hidden'}}
    >
      <div className={styles.en}>{t.en}</div>
      <div className={styles.pt}>{t.pt}</div>
      {t.def && <div className={styles.def}>{t.def}</div>}
    </div>
  );
}

export default function Root({children}) {
  return (
    <>
      {children}
      <Balao />
    </>
  );
}
