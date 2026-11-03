#!/usr/bin/env node
/**
 * Transcreve uma gravação de aula e extrai os frames do vídeo.
 *
 *   npm run transcrever -- material/aula-dmm/aula.mp4
 *   npm run transcrever -- material/aula-dmm/aula.m4a --segundos 15
 *
 * O resultado fica numa pasta `<nome-do-arquivo>.transcricao/` ao lado da
 * gravação, com:
 *   - transcricao.txt  texto corrido
 *   - transcricao.srt  texto com marca de tempo (para achar o trecho no vídeo)
 *   - frames/          uma imagem a cada N segundos (só se houver vídeo)
 *
 * Tudo isso vive em `material/`, que é ignorado pelo git: é material de aula
 * da Wake Tech, protegido por direito autoral. Serve de referência para
 * escrever a lição; o texto não é copiado para `docs/`.
 */

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

const RAIZ = resolve(import.meta.dirname, '..');
const MODELO = join(RAIZ, 'material', '.whisper', 'ggml-large-v3-turbo.bin');

function erro(mensagem) {
  console.error(`\n  ✗ ${mensagem}\n`);
  process.exit(1);
}

function rodar(comando, argumentos, opcoes = {}) {
  const r = spawnSync(comando, argumentos, { stdio: 'inherit', ...opcoes });
  if (r.error) erro(`não consegui rodar ${comando}: ${r.error.message}`);
  if (r.status !== 0) erro(`${comando} terminou com erro (código ${r.status}).`);
}

// ---------------------------------------------------------------- argumentos

const args = process.argv.slice(2);
const entradaArg = args.find((a) => !a.startsWith('--'));
const idxSegundos = args.indexOf('--segundos');
const segundos = idxSegundos !== -1 ? Number(args[idxSegundos + 1]) : 10;
const idioma = args.includes('--pt') ? 'pt' : 'en';

if (!entradaArg) {
  erro(
    'diga qual é a gravação:\n' +
      '      npm run transcrever -- material/aula-dmm/aula.mp4\n\n' +
      '    Opções:\n' +
      '      --segundos N   um frame a cada N segundos (padrão: 10)\n' +
      '      --pt           a aula é em português (padrão: inglês)',
  );
}

const entrada = resolve(entradaArg);
if (!existsSync(entrada)) erro(`não achei o arquivo: ${entrada}`);
if (!existsSync(MODELO)) {
  erro(
    `falta o modelo do whisper em:\n      ${MODELO}\n\n` +
      '    Baixe com:\n' +
      '      curl -L -o material/.whisper/ggml-large-v3-turbo.bin \\\n' +
      '        https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo.bin',
  );
}
if (!Number.isFinite(segundos) || segundos <= 0) {
  erro('--segundos precisa ser um número maior que zero.');
}

// ------------------------------------------------------------------- preparo

const nome = basename(entrada).replace(/\.[^.]+$/, '');
const saida = join(dirname(entrada), `${nome}.transcricao`);
mkdirSync(saida, { recursive: true });

const duracao = Number(
  execFileSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    entrada,
  ]).toString().trim(),
);

const temVideo =
  execFileSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=codec_type',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    entrada,
  ]).toString().trim() === 'video';

const minutos = Math.floor(duracao / 60);
const resto = Math.round(duracao % 60);
console.log(`\n  Gravação: ${basename(entrada)}`);
console.log(`  Duração:  ${minutos} min ${resto} s${temVideo ? ' (com vídeo)' : ' (só áudio)'}`);
console.log(`  Saída:    ${saida}\n`);

// --------------------------------------------------------------------- áudio

const wav = join(saida, 'audio-16k.wav');
console.log('  [1/3] Extraindo o áudio…');
rodar('ffmpeg', [
  '-y', '-loglevel', 'error',
  '-i', entrada,
  '-ar', '16000',   // whisper.cpp exige 16 kHz
  '-ac', '1',       // mono
  '-c:a', 'pcm_s16le',
  wav,
]);

// --------------------------------------------------------------- transcrição

console.log('  [2/3] Transcrevendo (pode demorar alguns minutos)…\n');
rodar('whisper-cli', [
  '-m', MODELO,
  '-f', wav,
  '-l', idioma,
  '-otxt', '-osrt',
  '-of', join(saida, 'transcricao'),
  '-pp',
]);
rmSync(wav, { force: true });

// -------------------------------------------------------------------- frames

if (temVideo) {
  const frames = join(saida, 'frames');
  mkdirSync(frames, { recursive: true });
  console.log(`\n  [3/3] Extraindo um frame a cada ${segundos} s…`);
  rodar('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-i', entrada,
    '-vf', `fps=1/${segundos},scale=1280:-2`,
    '-q:v', '3',
    join(frames, 'frame_%04d.jpg'),
  ]);
  const quantos = readdirSync(frames).filter((f) => f.endsWith('.jpg')).length;
  console.log(`        ${quantos} frames — o frame N cobre o segundo ${segundos} × (N − 1).`);
} else {
  console.log('\n  [3/3] Sem vídeo: nenhum frame a extrair.');
}

// -------------------------------------------------------------------- pronto

const txt = join(saida, 'transcricao.txt');
const tamanho = existsSync(txt) ? statSync(txt).size : 0;
const legivel = tamanho >= 1024 ? `${(tamanho / 1024).toFixed(1)} KB` : `${tamanho} bytes`;
console.log(`\n  ✓ Pronto. Transcrição: ${legivel}`);
console.log(`    ${txt}\n`);
