/**
 * ScamSignal static build readiness audit (not a security penetration test).
 * Run after npm run build; no network calls or deployments.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.resolve(root, process.argv[2] ?? 'dist');
const errors = [];
const ok = (condition, message) => {
  if (condition) console.log(`PASS  ${message}`);
  else { console.error(`FAIL  ${message}`); errors.push(message); }
};

if (!fs.existsSync(distDir)) {
  console.error(`FAIL  Build folder missing: ${distDir}. Run npm run build first.`);
  process.exit(1);
}
const indexPath = path.join(distDir, 'index.html');
ok(fs.existsSync(indexPath), 'Production index.html exists');
if (!fs.existsSync(indexPath)) process.exit(1);
const html = fs.readFileSync(indexPath, 'utf8');
ok(/<title[^>]*>\s*ScamSignal/i.test(html), 'Page title identifies ScamSignal');
ok(/<meta\s+name=["']description["']\s+content=["'][^"']{35,}["']/i.test(html), 'Useful SEO description is present');
ok(/<meta[^>]+name=["']viewport["']/i.test(html), 'Mobile viewport meta tag is present');
ok(/<meta\s+name=["']theme-color["']/i.test(html), 'Theme color is set');
ok(/id=["']root["']/i.test(html), 'React root exists in production document');
ok(!/localhost:5173|127\.0\.0\.1:5173/i.test(html), 'Production HTML contains no local dev URL');

// Validate Vite references to local scripts/stylesheets. Do not dereference external URLs.
const assetRefs = [...html.matchAll(/(?:src|href)=["']([^"']*\.(?:js|css))["']/gi)].map(item => item[1]);
ok(assetRefs.length >= 1, 'Production HTML references compiled JavaScript/CSS');
for (const asset of assetRefs) {
  if (/^https?:\/\//i.test(asset)) continue;
  const rel = asset.startsWith('/') ? asset.slice(1) : asset.replace(/^\.\//, '');
  ok(fs.existsSync(path.join(distDir, rel)), `Bundled asset exists: ${rel}`);
}
const files = fs.readdirSync(distDir, { recursive: true }).map(value => String(value).replace(/\\/g, '/'));
ok(!files.some(file => /(^|\/)\.env(?:\.|$)/.test(file)), 'No .env file was copied into the build');
console.log('\nThis checks build packaging and basic page metadata only, not live accessibility, security or performance.');
if (errors.length) {
  console.error(`\n${errors.length} readiness check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('\nScamSignal static build preflight: PASS. Do browser QA before deployment.');
}
