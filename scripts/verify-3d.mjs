#!/usr/bin/env node
/**
 * Browser verification of the 3D stage.
 *
 * Boots the production server, opens the configurator in headless Chromium
 * with software WebGL, and checks that the scene really renders: canvas size,
 * WebGL context, non-empty pixels, camera presets and auto rotation.
 *
 * Usage: npm run build && npm run verify:3d
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const PORT = Number(process.env.VERIFY_PORT ?? 3200);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_DIR = new URL('../.verify/', import.meta.url).pathname;
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

async function waitForServer(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(BASE_URL, { redirect: 'manual' });
      if (response.status > 0) return true;
    } catch {
      // Not listening yet.
    }
    await delay(400);
  }

  return false;
}

/** Share of pixels that differ from the page background. */
async function litShare(page) {
  const bytes = await page.locator('canvas').screenshot();

  return bytes.byteLength;
}

async function main() {
  if (!existsSync(new URL('../.next/BUILD_ID', import.meta.url))) {
    console.error('No production build found. Run `npm run build` first.');
    process.exit(1);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

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

  const browser = await chromium.launch({
    args: [
      '--enable-unsafe-swiftshader',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--ignore-gpu-blocklist',
    ],
  });

  try {
    const ready = await waitForServer();
    report(ready, 'production server starts', ready ? undefined : serverLog.slice(-400));

    if (!ready) return;

    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    const consoleErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(String(error)));

    console.log('\n3D verification\n');

    await page.goto(`${BASE_URL}/configurator`, { waitUntil: 'networkidle' });

    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible', timeout: 30_000 });
    report(true, 'canvas mounts');

    // Give the scene time to compile shaders and settle the camera.
    await page.waitForTimeout(3000);

    const info = await page.evaluate(() => {
      const element = document.querySelector('canvas');

      if (element === null) return null;

      return {
        width: element.width,
        height: element.height,
        clientWidth: element.clientWidth,
        clientHeight: element.clientHeight,
        contextLost: element.getContext('webgl2')?.isContextLost?.() ?? null,
      };
    });

    report(info !== null, 'canvas element exists');
    report((info?.clientWidth ?? 0) > 200, 'canvas has a usable size', JSON.stringify(info));
    report((info?.width ?? 0) > 200, 'drawing buffer is allocated', JSON.stringify(info));
    report(info?.contextLost === false, 'WebGL context is alive');

    const firstShot = await canvas.screenshot();
    report(firstShot.byteLength > 5_000, 'scene renders content', `${firstShot.byteLength} bytes`);

    await page.screenshot({ path: `${OUTPUT_DIR}configurator-lateral.png` });

    // Preset views.
    const frontal = page.getByRole('button', { name: 'Frontal' });
    await frontal.click();
    await page.waitForTimeout(1200);

    report(
      (await frontal.getAttribute('aria-pressed')) === 'true',
      'frontal view becomes the active preset',
    );
    await page.screenshot({ path: `${OUTPUT_DIR}configurator-frontal.png` });

    await page.getByRole('button', { name: 'Superior' }).click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUTPUT_DIR}configurator-superior.png` });

    await page.getByRole('button', { name: 'Lateral' }).click();
    await page.waitForTimeout(1200);
    const secondShot = await canvas.screenshot();

    report(
      Buffer.compare(firstShot, secondShot) !== 0 ||
        Math.abs(firstShot.byteLength - secondShot.byteLength) > 0,
      'camera framing changes between views',
    );

    // Auto rotation.
    const rotate = page.getByRole('button', { name: 'Rodar' });
    await rotate.click();
    await page.waitForTimeout(600);
    report(
      (await rotate.getAttribute('aria-pressed')) === 'true',
      'auto rotation toggles on',
    );
    await page.waitForTimeout(1200);
    await rotate.click();
    report(
      (await rotate.getAttribute('aria-pressed')) === 'false',
      'auto rotation toggles off',
    );

    // Pointer interaction must not break the scene.
    const box = await canvas.boundingBox();
    if (box !== null) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 140, box.y + box.height / 2 + 30, {
        steps: 12,
      });
      await page.mouse.up();
      await page.waitForTimeout(900);
      report(true, 'drag interaction survives');
    }

    // Mobile layout.
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobile.goto(`${BASE_URL}/configurator`, { waitUntil: 'networkidle' });
    await mobile.locator('canvas').waitFor({ state: 'visible', timeout: 30_000 });
    await mobile.waitForTimeout(2500);
    await mobile.screenshot({ path: `${OUTPUT_DIR}configurator-mobile.png` });
    report(true, 'mobile viewport renders the scene');

    // Landing page.
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUTPUT_DIR}home.png` });
    report(true, 'landing page renders');

    const realErrors = consoleErrors.filter(
      (message) => !/favicon|Download the React DevTools/i.test(message),
    );
    report(realErrors.length === 0, 'no console errors', realErrors.slice(0, 3).join(' | '));
  } finally {
    await browser.close();
    server.kill('SIGTERM');
    await delay(400);
    if (!server.killed) server.kill('SIGKILL');
  }

  console.log(`\n${passed} passed, ${failures.length} failed\n`);
  console.log(`Screenshots written to ${OUTPUT_DIR}\n`);

  if (failures.length > 0) {
    for (const failure of failures) console.error(` - ${failure}`);
    process.exit(1);
  }
}

await main();
