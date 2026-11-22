# ScamSignal / SIGNAL — NOISE

## Visual release 4E (source-only)

Art direction: a premium **investigative editorial** interface, inspired by analog instrument panels, printed case files, the tactile quality of warm stock, and the precision of signal analysis.

### Palette

| Semantic role | Color | Usage |
| --- | --- | --- |
| Graphite background | `#101115` | Backgrounds, device environment |
| Elevated graphite | `#27282e` | Phone panels and darker cards |
| Paper ivory | `#eee7da` | Protocol feature section, selected tabs and contrast anchors |
| Signal ember | `#fa916d` | Primary action, evidence and route accents |
| Evidence blue | `#aac6e8` | Evidence tool differentiation |
| Case violet | `#c2b6ee` | Internship case hierarchy |
| Refund gold | `#f1c581` | Refund and caution semantics |
| Verified sage | `#a6d3b4` | Safe and completed signals |

### Design conventions

- Oversized tight-set Space Grotesk headlines contrast with italic Georgia display highlights, instead of adding network-dependent fonts.
- Lowercase descriptive text uses Inter with comfortable reading contrast; engineering annotations use a monospace stack.
- Dossier strips, rules, square-ish corners, case numbers and custom signal visualization replace repeated generic neon cards.
- The **How ScamSignal Works** section uses warm ivory paper and inverted text as an intentional visual punctuation mark.
- Three cases have separate accents but all controls and interface hierarchies remain consistent.
- The homepage signal field is a decorative, original animated SVG, not a WebGL runtime, image download or tracking script.
- Animation is transform-based and reduced-motion aware; no autoplaying videos or external requests.
- Mission layout, action placement, storage keys, scoring and challenge content remain unchanged.
- Tooltips and visible focus remain enabled, and original accessible names are preserved.

### Release verification on the actual Windows checkout

1. `npm run typecheck`
2. `npm run lint`
3. `npm run test`
4. `npm run build`
5. `node scripts/release-gate-4d.mjs`
6. Check all routes at 320, 375, 768, 1366, and 1920 pixels, zoom 200%, keyboard and reduced-motion.
7. Inspect panel contrast and hover/focus/touch states in Chrome; evaluate Lighthouse and test production preview before pushing `main`.

The installer makes an out-of-repository backup before writing and requires the verified `8c71620` baseline on a clean `main`. In a future design revision, inspect and reconcile any source drift before applying another patch.
