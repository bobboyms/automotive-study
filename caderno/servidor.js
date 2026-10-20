#!/usr/bin/env node
// Servidor local do quadro do caderno. Sem dependências: serve quadro.html e
// grava cada PNG enviado pelo botão "Salvar para correção" em caderno/imagens/.
// Uso: npm run quadro  (ou: node caderno/servidor.js)

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORTA = Number(process.env.PORTA_QUADRO || 4123);
const PAGINA = path.join(__dirname, 'quadro.html');
const PASTA_IMAGENS = path.join(__dirname, 'imagens');
const LIMITE_BYTES = 30 * 1024 * 1024;

fs.mkdirSync(PASTA_IMAGENS, { recursive: true });

function doisDigitos(n) {
  return String(n).padStart(2, '0');
}

function carimbo() {
  const d = new Date();
  return (
    d.getFullYear() + '-' + doisDigitos(d.getMonth() + 1) + '-' + doisDigitos(d.getDate()) +
    '-' + doisDigitos(d.getHours()) + 'h' + doisDigitos(d.getMinutes()) + 'm' + doisDigitos(d.getSeconds())
  );
}

// "Lei de Ohm — exercício 3" vira "lei-de-ohm-exercicio-3" (nomes de arquivo em ASCII)
function sanearTitulo(bruto) {
  const semAcento = Array.from(String(bruto || '').normalize('NFD'))
    .filter((ch) => {
      const codigo = ch.codePointAt(0);
      return codigo < 0x0300 || codigo > 0x036f;
    })
    .join('');
  return semAcento
    .toLowerCase().replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 40);
}

const servidor = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/quadro.html')) {
    fs.readFile(PAGINA, (erro, corpo) => {
      if (erro) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('quadro.html não encontrado ao lado do servidor.');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(corpo);
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/salvar') {
    const pedacos = [];
    let total = 0;
    let excedeu = false;
    req.on('data', (pedaco) => {
      total += pedaco.length;
      if (total > LIMITE_BYTES) {
        excedeu = true;
        res.writeHead(413, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Imagem grande demais.');
        req.destroy();
        return;
      }
      pedacos.push(pedaco);
    });
    req.on('end', () => {
      if (excedeu) return;
      if (total === 0) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Nenhuma imagem recebida.');
        return;
      }
      const titulo = sanearTitulo(url.searchParams.get('titulo'));
      const nome = carimbo() + (titulo ? '-' + titulo : '') + '.png';
      fs.writeFile(path.join(PASTA_IMAGENS, nome), Buffer.concat(pedacos), (erro) => {
        if (erro) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Falha ao gravar o arquivo: ' + erro.message);
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ arquivo: 'caderno/imagens/' + nome }));
        console.log('salvo: caderno/imagens/' + nome);
      });
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Nada aqui. O quadro fica em /.');
});

servidor.on('error', (erro) => {
  if (erro.code === 'EADDRINUSE') {
    console.error('A porta ' + PORTA + ' já está em uso — o quadro já está rodando em outro terminal?');
    console.error('Para usar outra porta: PORTA_QUADRO=4124 npm run quadro');
    process.exit(1);
  }
  throw erro;
});

servidor.listen(PORTA, '0.0.0.0', () => {
  console.log('Quadro do caderno no ar:');
  console.log('  neste computador:  http://localhost:' + PORTA);
  for (const enderecos of Object.values(os.networkInterfaces())) {
    for (const e of enderecos || []) {
      if (e.family === 'IPv4' && !e.internal) {
        console.log('  iPad/celular:      http://' + e.address + ':' + PORTA + '  (mesma rede Wi-Fi)');
      }
    }
  }
  console.log('Cada "Salvar para correção" grava um PNG em caderno/imagens/.');
});
