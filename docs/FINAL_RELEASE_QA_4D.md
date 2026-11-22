# ScamSignal — Final Manual Release QA (Batch 4D)

Date: ________   Branch/commit: ________   Reviewer: ________

**Scope:** verify the existing three-mission application, not add another gameplay batch. Automated checks are necessary but insufficient. Capture screenshots and document any issue before publishing.

## A. Homepage and navigation

- [ ] Chrome desktop 1440×900 and ~1920×1080: title and hero read well; three selectable case previews are accurate and show the expected fictional content
- [ ] Start Investigation opens mission selection (`#/missions`); all three cases appear in correct order
- [ ] Homepage direct case links open their intended mission; Progress opens `#/progress`
- [ ] Home, Mission Selection, Progress and direct hash routes work after refresh and Browser Back/Forward
- [ ] Preview case tabs are operable via keyboard arrows, Home/End; selected label matches rendered preview
- [ ] No horizontal overflow at widths 320, 375, 390, 430, 768, 1024, 1440 and 1920px

## B. All three missions — two fresh runs each

- [ ] Mission 1: five locked decisions; safe route 100/100; Evidence list/detail Back and X behave correctly
- [ ] Mission 2: eight choices and reference/keyword puzzles; answers `4826` and `LANTERN`; correct safe route 100/100
- [ ] Mission 3: ten choices and two evidence puzzles; answers `RF-7318` and `MANGO`; correct safe route 100/100
- [ ] Risky and cautious choices produce appropriate consequences; answers do not reveal a repeated position pattern
- [ ] Phone Back shows the last locked answer read-only; Older/Newer/Return navigate correctly; no undo or duplicate scoring
- [ ] Refresh mid-attempt: current question, score and locked answers persist
- [ ] Replay requires explicit confirmation and resets only the selected mission
- [ ] Evidence, Hint, Case Log, Back, Home and Recent all show hover/focus descriptions without blocking controls
- [ ] Progress screen shows correct completion and achievements. Replay does not incorrectly preserve a previous perfect score as the current attempt
- [ ] Errors and unavailable storage are handled gracefully (private/incognito tab if practical)

## C. Accessibility and cross-device

- [ ] Navigate all major screens using keyboard only. Skip link works; visible focus ring, logical focus order and Escape dialog closure
- [ ] Screen-reader labels are meaningful on icon-only controls; error message is associated with the relevant puzzle input
- [ ] 200% zoom: no clipped critical controls, horizontal trapping or unreadable text
- [ ] Short landscape 640×360: phone fits, and internal scrolling reaches all buttons
- [ ] Touch simulation 320/375px: button targets remain comfortable and tooltips are not required to know their purpose
- [ ] Reduced motion: content remains visible and transitions aren't required to understand outcomes

## D. Production, privacy and security

- [ ] `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` all pass
- [ ] `node scripts/release-audit.mjs` and `node scripts/production-smoke-4d.mjs` pass
- [ ] `npm audit --omit=dev` has no unresolved production vulnerability; any failure must be investigated
- [ ] Chrome DevTools Console shows no uncaught errors and Network has no broken production assets
- [ ] No real `.env`/keys/tokens, private documents, student information, or third-party copyrighted material in `dist/`
- [ ] DevTools Lighthouse (mobile + desktop): inspect Performance, Accessibility and Best Practices; record measured values rather than invent targets
- [ ] Test built site via local Vite preview (`node scripts/production-smoke-4d.mjs`); browser smoke should use `npm run preview` if the project provides that script, or `npx --no-install vite preview`

## E. Release evidence (save outside Git repository)

Save in `D:\ScamSignal-ReleaseEvidence` (or your preferred local folder):

1. Desktop homepage and mission-select screenshots
2. All three investigation screenshots (decision or puzzle)
3. Progress and Achievements screenshots
4. One 320px mobile view and one 200% zoom view
5. Lighthouse reports (if collected) and the generated `scamsignal-batch4d-release-report.json`
6. A short issue log (issue, severity, fixed/tested, screenshot)

**GO criteria:** no unresolved blockers, complete mission paths working, all automated gates passed, deployment checklist understood, and final owner approval. This does **not** certify absolute security/accessibility or automatically deploy anything.
