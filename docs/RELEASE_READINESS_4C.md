# ScamSignal — Batch 4C release-readiness checklist

This document prepares the existing React/Vite application for release without deploying it. Keep all three missions and progress/achievements functioning. Do **not** publish until every technical and visual acceptance gate passes.

## A. User experience

- Home now showcases three **fictional case previews** rather than a single dated parcel alert. Select the Delivery, Internship and Refund tabs using click or keyboard Left/Right/Home/End; Explore case opens the corresponding mission.
- Mission-selection **Back to Home** appears top-left; the brand is on the other side. Progress page adopts the same ordering.
- Every icon-only phone control exposes a readable tooltip when hovered or focused, plus an accessible button name. Touch devices rely on accessible names, not hover.
- Home, missions, progress, direct `#/...` links, refresh and browser Back/Forward continue working.

## B. Automated checks

From `D:\ScamSignal`:

```powershell
npm run typecheck
npm run lint
npm run test
npm run build
node scripts/release-audit.mjs
npm audit --omit=dev
```

If a check fails, stop and review the output. Do not run `npm audit fix --force` automatically.

## C. Browser / accessibility

- Inspect the homepage at desktop 1440×900 and 1920×1080, and at 320px, 375px, 768px, and 1024px.
- Review the hero preview tabs and actions using keyboard only. Confirm the selected tab always matches the visible message and never changes on its own.
- Check tab tooltip content, visible focus ring, skip-to-main, dialog Escape/focus restoration, 200% zoom and reduced-motion mode.
- Test phone at narrow width and 640×360 landscape: no horizontal overflow, bottom Back/Home/Recent available, gameplay content scrolls within fitted phone.
- Revisit all three missions. Inspect evidence, request hints, type intentionally wrong values, confirm correct values, lock choices, refresh and resume, and replay after explicit confirmation.
- Verify 100/100 on safest path and correct achievement unlocks, but do not reset a player test profile without intending to.

## D. Performance / content

- In Chrome DevTools Lighthouse, review Performance and Accessibility in desktop and mobile; fix meaningful regressions. Record measured results instead of claiming an unmeasured target.
- Check that JS/CSS/font files load without 404 errors in DevTools Network and that the console has no unexplained errors.
- Verify all .example domains are displayed only as **inert training evidence**, never as clickable links or real payment/credential collection.
- Ensure game copy and descriptions match three available cases, not a single-case prototype. No claims of certification or guaranteed scam detection.
- Set an actual social preview URL / canonical URL only **after** obtaining a verified live deployment address.

## E. Embarko publication gate — NOT part of Batch 4C

Once ready to deploy, follow the *current official* [Embarko quickstart](https://embarko.ai/docs/quickstart.md) from your working source project. Do not rely on an old copied prompt if the official procedure has changed. The established project plan is to deploy anonymously first, inspect the live HTTPS URL, and only then decide whether to make the deployment permanent. Do not put secrets into the deployment archive. The deployment must be approved and performed separately.

## F. Git review

Inspect staged file paths and the diff before committing. No `dist/`, `node_modules/`, `.env`, backup files or local ZIP files should be committed.
