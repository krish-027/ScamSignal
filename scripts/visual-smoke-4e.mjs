// Independent, zero-dependency source integrity check for the visual refresh.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const tokens = read('src/styles/tokens.css');
const css = read('src/styles/visualIdentity.css');
const app = read('src/app/App.tsx');
const page = read('src/features/home/HomePage.tsx');
const preview = read('src/features/home/HomeCasePreview.tsx');
const art = read('src/features/home/SignalField.tsx');
const directory = read('src/features/missions/directory/MissionCards.tsx');

for (const color of ['#101115', '#fa916d', '#eee7da', '#bdb6ef']) {
  assert.ok(tokens.toLowerCase().includes(color) || css.toLowerCase().includes(color), `Missing visual token: ${color}`);
}
assert.match(app, /visualIdentity\.css/, 'Visual system import must remain active');
assert.match(page, /home-protocol-section/, 'Homepage material contrast must remain active');
assert.match(preview, /<SignalField \/>/, 'Decorative signal field should be present');
assert.match(art, /aria-hidden="true"/, 'Signal field must be hidden from accessibility tree');
assert.match(art, /focusable="false"/, 'Signal SVG must not become a keyboard stop');
assert.match(directory, /Play mission/, 'Keep the existing mission selection action');
assert.match(css, /prefers-reduced-motion:\s*reduce/, 'Respect reduced-motion preferences');
assert.match(css, /max-width:\s*359px/, 'Keep narrow-screen support');
console.log('VISUAL 4E SOURCE CHECK: PASS');
