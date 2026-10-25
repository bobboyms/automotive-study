import React, {useEffect, useState} from 'react';
import CATALOGO from '../Simbolos/catalogo';
import {SimboloSolto} from '../Simbolos/desenhos';
import {Nome, texto} from '../Simbolos';
import styles from '../Simbolos/styles.module.css';

// Flash cards dos símbolos: mostra o desenho, o aluno tenta dizer o nome em
// inglês, vira o cartão e marca se acertou. No fim, pode repetir só os que
// errou. Os cartões saem do catálogo da `TabelaSimbolos`.
//
//   <FlashSimbolos />                         // o catálogo inteiro
//   <FlashSimbolos itens={['diodo', 'led']} /> // só esses

// Duas versões do mesmo símbolo (o fuse do site e o dos manuais) seriam o
// mesmo cartão com a mesma resposta: fica uma só.
const PADRAO = Object.keys(CATALOGO).filter((k) => k !== 'fusivel');

function embaralhar(lista) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashSimbolos({itens = PADRAO, caption}) {
  // a primeira ordem é a do catálogo, igual no build e no navegador; o
  // embaralhamento acontece só depois que a página abre
  const [fila, setFila] = useState(itens);
  const [pos, setPos] = useState(0);
  const [virado, setVirado] = useState(false);
  const [erros, setErros] = useState([]);

  useEffect(() => {
    setFila(embaralhar(itens));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const recomecar = (lista) => {
    setFila(embaralhar(lista));
    setPos(0);
    setVirado(false);
    setErros([]);
  };

  const marcar = (acertou) => {
    if (!acertou) setErros((e) => [...e, fila[pos]]);
    setPos((p) => p + 1);
    setVirado(false);
  };

  const fim = pos >= fila.length;
  const atual = fim ? null : CATALOGO[fila[pos]];

  return (
    <figure className={styles.figure}>
      <div className={styles.flash}>
        {fim ? (
          <>
            <div className={styles.flashResposta}>
              <strong>
                Você acertou {fila.length - erros.length} de {fila.length}.
              </strong>
              {erros.length > 0 && (
                <span className={styles.nota}>
                  Para revisar: {erros.map((k) => texto(CATALOGO[k].nome)).join(', ')}.
                </span>
              )}
            </div>
            <div className={styles.flashBotoes}>
              {erros.length > 0 && (
                <button
                  type="button"
                  className={styles.botaoPrincipal}
                  onClick={() => recomecar(erros)}
                >
                  Repetir os que errei
                </button>
              )}
              <button type="button" className={styles.botao} onClick={() => recomecar(itens)}>
                Recomeçar todos
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.flashTopo}>
              <span>
                Cartão {pos + 1} de {fila.length}
              </span>
              <span>Erros: {erros.length}</span>
            </div>
            <SimboloSolto
              tipo={fila[pos]}
              className={styles.flashSvg}
              rotulo="Símbolo para identificar"
            />
            <div className={styles.flashResposta} aria-live="polite">
              {virado ? (
                <>
                  <span className={styles.nome}>
                    <Nome partes={atual.nome} />
                  </span>
                  <span className={styles.nota}>{atual.nota}</span>
                </>
              ) : (
                <span className={styles.nota}>
                  Diga o nome em inglês em voz alta antes de virar o cartão.
                </span>
              )}
            </div>
            <div className={styles.flashBotoes}>
              {virado ? (
                <>
                  <button type="button" className={styles.botaoPrincipal} onClick={() => marcar(true)}>
                    Acertei
                  </button>
                  <button type="button" className={styles.botao} onClick={() => marcar(false)}>
                    Errei
                  </button>
                </>
              ) : (
                <button type="button" className={styles.botaoPrincipal} onClick={() => setVirado(true)}>
                  Virar o cartão
                </button>
              )}
            </div>
          </>
        )}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
