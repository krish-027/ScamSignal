import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { localAssetPaths, scanDist } from './release-utils-4d.mjs';

test('extracts only local script/style bundles, ignoring external links', () => {
  const html = `<script src="/assets/site.js"></script><link href="./assets/site.css" rel="stylesheet">
    <a href="https://example.org/style.css">external</a><script src="/assets/site.js"></script>`;
  assert.deepEqual(localAssetPaths(html), ['assets/site.js', 'assets/site.css']);
});

test('rejects paths escaping the built output', () => {
  assert.throws(() => localAssetPaths('<script src="../secret.js"></script>'), /Unsafe asset path/);
});

test('reports compiled assets without reading outside the output directory', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scamsignal-release-'));
  try {
    fs.mkdirSync(path.join(dir, 'assets'));
    fs.writeFileSync(path.join(dir, 'index.html'), '<div id="root"></div><script type="module" src="/assets/app.js"></script><link rel="stylesheet" href="/assets/app.css">');
    fs.writeFileSync(path.join(dir, 'assets/app.js'), 'console.log("hello")');
    fs.writeFileSync(path.join(dir, 'assets/app.css'), 'body{background:black}');
    const stats = scanDist(dir);
    assert.equal(stats.javascript.count, 1);
    assert.equal(stats.css.count, 1);
    assert.equal(stats.htmlAssets.length, 2);
    assert.ok(stats.totalBytes > 0);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('detects missing built files and accidental credential artifacts', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scamsignal-release-'));
  try {
    fs.mkdirSync(path.join(dir, 'assets'));
    fs.writeFileSync(path.join(dir, 'index.html'), '<script src="/assets/app.js"></script>');
    assert.throws(() => scanDist(dir), /Missing production asset/);
    fs.writeFileSync(path.join(dir, 'assets/app.js'), 'console.log(1)');
    fs.writeFileSync(path.join(dir, '.env.production'), 'DO_NOT_SHIP=1');
    assert.throws(() => scanDist(dir), /Potential secret files/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
