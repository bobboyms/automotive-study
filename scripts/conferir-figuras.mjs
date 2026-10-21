#!/usr/bin/env node
// Conferência visual das figuras das lições.
//
// Sobe o site já construído (`npm run build` antes), abre cada lição .mdx e
// tira uma captura de cada <figure> em três situações: tema claro, tema escuro
// e celular (390 px de largura). No macOS, captura também com o WebKit do
// sistema — o motor do Safari —, no computador e no celular, pelo
// `capturar-safari.swift`: há defeito que só o Safari mostra (o KaTeX dentro
// de <foreignObject> saía gigante e fora de lugar, e o Chrome desenhava certo).
// Depois monta folhas de até 3 figuras, com uma linha por figura e as versões
// lado a lado, para conferir com os olhos.
//
// Uso:
//   npm run build && npm run figuras             # todas as lições
//   npm run figuras -- lei-de-ohm circuito-em-serie   # só essas
//
// Saída em .figuras/ (fora do git): uma pasta por lição e as folhas
// .figuras/<licao>-1.png, -2.png... Abra cada folha e olhe figura por figura.
//
// Precisa do Google Chrome instalado. Outro caminho: CHROME_PATH=/caminho.

import {execFileSync, spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, '.figuras');
const PORT = 3999;
const BASE = `http://localhost:${PORT}/automotive-study`;
const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const MODES = [
  {name: 'claro', width: 1100, query: ''},
  {name: 'escuro', width: 1100, query: '?docusaurus-theme=dark'},
  {name: 'celular', width: 390, query: ''},
];
const SAFARI = [
  {name: 'safari', width: 1100},
  {name: 'safari-celular', width: 390},
];

// Compila o capturador do WebKit uma vez (e de novo quando o .swift muda).
function safariBin() {
  if (process.platform !== 'darwin') return null;
  const src = path.join(ROOT, 'scripts', 'capturar-safari.swift');
  const bin = path.join(OUT, '.bin', 'capturar-safari');
  if (!fs.existsSync(bin) || fs.statSync(bin).mtimeMs < fs.statSync(src).mtimeMs) {
    fs.mkdirSync(path.dirname(bin), {recursive: true});
    execFileSync('swiftc', ['-O', src, '-o', bin], {stdio: 'inherit'});
  }
  return bin;
}

// docs/trn-120-eletricidade/04-lei-de-ohm.mdx -> trn-120-eletricidade/lei-de-ohm
function lessons() {
  const found = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.mdx')) {
        const rel = path.relative(path.join(ROOT, 'docs'), full);
        const route = rel
          .replace(/\.mdx$/, '')
          .split(path.sep)
          .map((part) => part.replace(/^\d+-/, ''))
          .join('/');
        found.push(route);
      }
    }
  };
  walk(path.join(ROOT, 'docs'));
  return found.sort();
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('O servidor não subiu. Rode `npm run build` antes.');
}

async function main() {
  if (!fs.existsSync(path.join(ROOT, 'build'))) {
    throw new Error('Pasta build/ não existe. Rode `npm run build` antes.');
  }
  const filter = process.argv.slice(2);
  const routes = lessons().filter(
    (r) => filter.length === 0 || filter.some((f) => r.endsWith(f)),
  );

  const server = spawn(
    'npx',
    ['docusaurus', 'serve', '--port', String(PORT), '--no-open'],
    {cwd: ROOT, stdio: 'ignore'},
  );
  const browser = await puppeteer.launch({executablePath: CHROME});
  try {
    await waitForServer();
    fs.mkdirSync(OUT, {recursive: true});
    const safari = safariBin();
    const modes = safari ? [...MODES, ...SAFARI] : MODES;
    if (!safari) console.log('Fora do macOS: sem as colunas do Safari.');

    for (const route of routes) {
      const slug = route.replace(/\//g, '__');
      const dir = path.join(OUT, slug);
      fs.rmSync(dir, {recursive: true, force: true});
      fs.mkdirSync(dir, {recursive: true});
      const shots = {};

      for (const mode of MODES) {
        const page = await browser.newPage();
        await page.setViewport({
          width: mode.width,
          height: 900,
          deviceScaleFactor: 2,
        });
        await page.goto(`${BASE}/${route}${mode.query}`, {
          waitUntil: 'networkidle0',
        });
        await page.evaluate(() => document.fonts.ready);
        // Abre os blocos recolhidos (soluções, gabaritos): figura escondida
        // também precisa ser conferida. À mão, e não clicando no <summary>: o
        // clique antes de o React assumir a página às vezes não abria, e a
        // figura sumia da conferência sem aviso.
        await page.evaluate(() => {
          document.querySelectorAll('article details').forEach((d) => {
            d.setAttribute('open', '');
            for (const c of d.children) if (c.tagName !== 'SUMMARY') c.removeAttribute('style');
          });
        });
        await new Promise((r) => setTimeout(r, 600));
        const figures = [];
        for (const fig of await page.$$('article figure')) {
          if (await fig.boundingBox()) figures.push(fig);
        }
        shots[mode.name] = [];
        if (process.env.DEBUG) console.log(route, mode.name, figures.length);
        for (let i = 0; i < figures.length; i++) {
          const file = path.join(dir, `${String(i + 1).padStart(2, '0')}-${mode.name}.png`);
          await figures[i].screenshot({path: file});
          shots[mode.name].push(file);
        }
        await page.close();
      }

      if (safari) {
        for (const mode of SAFARI) {
          execFileSync(safari, [`${BASE}/${route}`, String(mode.width), dir, mode.name]);
          shots[mode.name] = shots.claro.map((f) => f.replace(/-claro\.png$/, `-${mode.name}.png`));
          const faltando = shots[mode.name].filter((f) => !fs.existsSync(f));
          if (faltando.length) {
            throw new Error(`${route}: o Safari não capturou ${faltando.join(', ')}`);
          }
        }
      }

      const count = shots.claro.length;
      if (count === 0) {
        console.log(`${route}: nenhuma figura`);
        continue;
      }

      // Folhas: até 3 figuras cada, uma linha por figura, colunas
      // claro | escuro | celular. Folhas maiores saem reduzidas demais para
      // enxergar um rótulo cortado.
      const sheets = [];
      for (let start = 0; start < count; start += 3) {
        const idx = [...Array(Math.min(3, count - start)).keys()].map((k) => start + k);
        const rows = idx
          .map(
            (i) => `<tr><th>${i + 1}</th>${modes.map(
              (m) =>
                `<td class="${m.name}"><img src="file://${shots[m.name][i]}"></td>`,
            ).join('')}</tr>`,
          )
          .join('');
        const html = `<!doctype html><meta charset="utf-8"><style>
          body{margin:0;font:14px sans-serif;background:#999}
          table{border-collapse:collapse}
          th{padding:8px;background:#ddd;vertical-align:top}
          td{padding:10px;vertical-align:top;border:1px solid #777}
          td{background:#fff} td.escuro{background:#1b1b1d}
          td img{width:460px} td.celular img,td.safari-celular img{width:358px}
          caption{padding:8px;font-weight:bold;background:#ddd;text-align:left}
        </style><table><caption>${route} — ${modes.map((m) => m.name).join(' | ')} (celular em tamanho real)</caption>${rows}</table>`;
        const n = sheets.length + 1;
        const sheetHtml = path.join(dir, `folha-${n}.html`);
        fs.writeFileSync(sheetHtml, html);
        const page = await browser.newPage();
        await page.setViewport({width: 2400, height: 800});
        await page.goto(`file://${sheetHtml}`, {waitUntil: 'load'});
        const sheet = path.join(OUT, `${slug}-${n}.png`);
        await page.screenshot({path: sheet, fullPage: true});
        await page.close();
        sheets.push(path.relative(ROOT, sheet));
      }
      console.log(`${route}: ${count} figura(s) -> ${sheets.join(', ')}`);
    }
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
