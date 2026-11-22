/** Serve the built Vite app locally and verify the real HTTP responses. No external calls. */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { localAssetPaths } from './release-utils-4d.mjs';

const root = process.cwd();
const dist = path.join(root, 'dist');
const vite = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const port = Number(process.env.SCAM_SIGNAL_SMOKE_PORT || 4177);
const url = `http://127.0.0.1:${port}/`;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function productionSmoke() {
  if (!fs.existsSync(path.join(dist, 'index.html'))) throw new Error('Missing dist/index.html. Run npm run build.');
  if (!fs.existsSync(vite)) throw new Error('Vite is not locally installed. Run npm ci or npm install first.');
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid smoke test port.');

  const child = spawn(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
    { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  let output = '';
  for (const stream of [child.stdout, child.stderr]) stream.on('data', part => { output = (output + part.toString()).slice(-6000); });
  try {
    let response;
    for (let attempt = 0; attempt < 45; attempt++) {
      if (child.exitCode !== null) throw new Error(`Vite preview exited unexpectedly. ${output}`);
      try {
        response = await fetch(url, { signal: AbortSignal.timeout(1000) });
        if (response.status === 200) break;
      } catch { /* Start-up pending. */ }
      await sleep(250);
    }
    if (!response || response.status !== 200) throw new Error(`Preview not reachable at ${url}. ${output}`);
    const html = await response.text();
    if (!/id=["']root["']/i.test(html)) throw new Error('HTTP homepage response lacks the React root.');
    const assetPaths = localAssetPaths(html);
    if (!assetPaths.some(file => file.endsWith('.js'))) throw new Error('No JS asset referenced by the HTTP homepage.');
    let checked = 0;
    for (const asset of assetPaths) {
      const assetResponse = await fetch(new URL(asset, url), { signal: AbortSignal.timeout(4000) });
      if (assetResponse.status !== 200) throw new Error(`Missing HTTP asset: ${asset} (HTTP ${assetResponse.status})`);
      const contentType = assetResponse.headers.get('content-type') ?? '';
      if (asset.endsWith('.js') && !/(?:javascript|ecmascript)/i.test(contentType)) {
        throw new Error(`Unexpected JavaScript content-type for ${asset}: ${contentType}`);
      }
      checked++;
    }
    // In a hash router, fragment identifiers are handled by the browser and never reach the server.
    console.log(`PASS  Production index served from ${url}`);
    console.log(`PASS  ${checked} local JS/CSS assets returned HTTP 200`);
    console.log('NOTE  Hash routes, gameplay and responsive layout require manual browser QA.');
  } finally {
    child.kill();
    // Windows: child may exit asynchronously; this short wait reduces orphan processes.
    await sleep(150);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  productionSmoke().catch(error => { console.error(`FAIL  Production smoke: ${error.message}`); process.exitCode = 1; });
}
