/** Read-only helpers for release checks. Node.js built-ins only. */
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

export function localAssetPaths(html) {
  const refs = [...html.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)]
    .map(match => match[1].trim());
  const result = new Set();
  for (const ref of refs) {
    if (/^(?:https?:)?\/\//i.test(ref) || /^(?:data:|#|mailto:)/i.test(ref)) continue;
    const noQuery = ref.split(/[?#]/, 1)[0];
    if (!/\.(?:js|css)$/i.test(noQuery)) continue;
    const clean = noQuery.replace(/^\/+/, '').replace(/^\.\//, '');
    if (!clean || clean.includes('\\') || clean.split('/').some(segment => segment === '..' || segment === '.')) {
      throw new Error(`Unsafe asset path in HTML: ${ref}`);
    }
    result.add(clean);
  }
  return [...result];
}

export function scanDist(distPath) {
  if (!fs.existsSync(path.join(distPath, 'index.html'))) throw new Error('Missing dist/index.html: run npm run build first');
  const html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
  const assets = localAssetPaths(html);
  if (!assets.some(f => f.endsWith('.js'))) throw new Error('No compiled JS asset referenced in dist/index.html');
  for (const relative of assets) {
    if (!fs.existsSync(path.join(distPath, relative))) throw new Error(`Missing production asset: ${relative}`);
  }
  const files = fs.readdirSync(distPath, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile()).map(entry => {
      // Dirent parentPath is present in Node 20.12+/22+. We only use the listing for totals.
      const full = path.join(entry.parentPath ?? entry.path, entry.name);
      const rel = path.relative(distPath, full).replace(/\\/g, '/');
      const content = fs.readFileSync(full);
      return { path: rel, bytes: content.length,
        gzipBytes: /\.(js|css|html)$/i.test(rel) ? gzipSync(content).length : null };
    });
  const totals = (re) => files.filter(file => re.test(file.path))
    .reduce((sum, file) => ({ bytes: sum.bytes + file.bytes, gzipBytes: sum.gzipBytes + (file.gzipBytes ?? 0), count: sum.count + 1 }),
      { bytes: 0, gzipBytes: 0, count: 0 });
  const prohibited = files.filter(file => /(^|\/)\.env(?:\.|$)|\.(?:pem|key|p12|pfx)$/i.test(file.path));
  if (prohibited.length) throw new Error(`Potential secret files included in dist: ${prohibited.map(f => f.path).join(', ')}`);
  return { htmlAssets: assets, fileCount: files.length,
    totalBytes: files.reduce((a,b) => a + b.bytes, 0),
    javascript: totals(/\.js$/i), css: totals(/\.css$/i),
    images: totals(/\.(?:png|jpe?g|webp|avif|svg|gif)$/i),
    fonts: totals(/\.(?:woff2?|ttf|otf)$/i) };
}
