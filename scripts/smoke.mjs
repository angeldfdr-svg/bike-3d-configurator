#!/usr/bin/env node
/**
 * Dependency-free smoke test for the Phase 1 build.
 *
 * Boots the production server, checks the routes, SEO endpoints and the
 * editorial asset, then shuts the server down.
 *
 * Usage: npm run build && npm run smoke
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createConnection } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';

const PORT = Number(process.env.SMOKE_PORT ?? 3100);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const STARTUP_TIMEOUT_MS = 60_000;
const nextBin = new URL('../node_modules/next/dist/bin/next', import.meta.url).pathname;

const failures = [];
let passed = 0;

function report(ok, name, detail) {
  if (ok) {
    passed += 1;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

async function fetchText(path) {
  const response = await fetch(`${BASE_URL}${path}`, { redirect: 'manual' });
  return { status: response.status, body: await response.text(), headers: response.headers };
}

async function fetchHead(path) {
  const response = await fetch(`${BASE_URL}${path}`, { redirect: 'manual' });
  const buffer = Buffer.from(await response.arrayBuffer());
  return { status: response.status, size: buffer.byteLength, headers: response.headers };
}

async function waitForServer() {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(BASE_URL, { redirect: 'manual' });
      if (response.status > 0) return true;
    } catch {
      // Server not listening yet.
    }
    await delay(400);
  }

  return false;
}

function portInUse(port) {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host: '127.0.0.1' });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
  });
}

async function main() {
  if (!existsSync(new URL('../.next/BUILD_ID', import.meta.url))) {
    console.error('No production build found. Run `npm run build` first.');
    process.exit(1);
  }

  if (await portInUse(PORT)) {
    console.error(`Port ${PORT} is already in use. Set SMOKE_PORT to a free port.`);
    process.exit(1);
  }

  console.log(`\nSmoke test against ${BASE_URL}\n`);

  const server = spawn(process.execPath, [nextBin, 'start', '-p', String(PORT)], {
    cwd: new URL('..', import.meta.url).pathname,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: 'production' },
  });

  let serverLog = '';
  server.stdout.on('data', (chunk) => {
    serverLog += String(chunk);
  });
  server.stderr.on('data', (chunk) => {
    serverLog += String(chunk);
  });

  try {
    const ready = await waitForServer();
    report(ready, 'production server starts', ready ? undefined : serverLog.slice(-400));

    if (!ready) return;

    const home = await fetchText('/');
    report(home.status === 200, 'GET / returns 200', `status ${home.status}`);
    report(
      home.body.includes('BUILD') && home.body.includes('YOUR BIKE'),
      'homepage renders the hero title',
    );
    report(
      home.body.includes('Cria a tua bicicleta. Escolhe cada componente. Constrói algo único.'),
      'homepage renders the requested subtitle',
    );
    report(home.body.includes('Começar a configurar'), 'homepage renders the primary CTA');
    report(home.body.includes('href="/configurator"'), 'homepage links to the configurator');
    report(home.body.includes('og:image'), 'homepage exposes Open Graph metadata');
    report(home.body.includes('lang="pt-PT"'), 'document declares the pt-PT language');
    report(home.body.includes('id="conteudo"'), 'skip link target exists');

    const configurator = await fetchText('/configurator');
    report(configurator.status === 200, 'GET /configurator returns 200', `status ${configurator.status}`);
    for (const category of ['Quadro', 'Rodas', 'Grupo', 'Pedaleiro', 'Guiador', 'Selim', 'Pneus', 'Extras']) {
      report(configurator.body.includes(category), `configurator lists the "${category}" category`);
    }
    report(configurator.body.includes('Resumo'), 'configurator shows the summary panel');
    report(configurator.body.includes('aria-expanded'), 'category accordion is keyboard accessible');

    const notFound = await fetchText('/pagina-inexistente');
    report(notFound.status === 404, 'unknown route returns 404', `status ${notFound.status}`);

    const robots = await fetchText('/robots.txt');
    report(robots.status === 200 && robots.body.includes('Sitemap:'), 'robots.txt advertises the sitemap');

    const sitemap = await fetchText('/sitemap.xml');
    report(
      sitemap.status === 200 && sitemap.body.includes('/configurator'),
      'sitemap.xml lists the configurator',
    );

    const og = await fetchHead('/images/og-cover.jpg');
    report(
      og.status === 200 && og.size > 10_000,
      'Open Graph image is served',
      `status ${og.status}, ${og.size} bytes`,
    );

    const hero = await fetchHead('/_next/image?url=%2Fimages%2Fbike-hero.webp&w=1920&q=75');
    report(
      hero.status === 200 && hero.size > 10_000,
      'next/image optimisation endpoint serves the hero asset',
      `status ${hero.status}, ${hero.size} bytes`,
    );
  } finally {
    server.kill('SIGTERM');
    await delay(500);
    if (!server.killed) server.kill('SIGKILL');
  }

  console.log(`\n${passed} passed, ${failures.length} failed\n`);
  if (failures.length > 0) {
    for (const failure of failures) console.error(` - ${failure}`);
    process.exit(1);
  }
}

await main();
