# ScamSignal — Batch 1 Product & Design Specification

**Document version:** 1.0  
**Date:** 22 November 2026  
**Status:** Proposed baseline; implementation requires explicit owner approval  
**Target platform:** Mobile-first responsive web application  
**Development tool:** Google Antigravity  
**Competition:** Embarko Student Challenge 2026  
**Deployment:** Intentionally deferred; never deploy during Batch 1

## 0. Non-negotiable process gate

The first Antigravity interaction is **PLAN ONLY**: inspect an existing workspace read-only if present, describe the proposed implementation, and stop. Do not create or modify files, install packages, run generators, initialize a repository, commit, access secrets, invoke a deployment service, or make external network requests. Wait for the owner's explicit response: **APPROVE BATCH 1 IMPLEMENTATION**. The approval applies only to Batch 1; it does not authorize future batches or deployment.

## 1. Product definition

**Name:** ScamSignal  
**Tagline:** *The internet is testing you.*  
**Supporting hook:** *Can you spot the threat before it's too late?*

ScamSignal is a short, narrative-driven cyber-safety game built around **realistic simulated phone interactions** and **cinematic investigative reveals**. Players inspect fictional suspicious messages, calls and payment requests, make consequential decisions, receive understandable feedback, and finish with a shareable Digital Detective Report.

**Primary audience:** students and general smartphone users in India, approximately 16+ (accessible language and no real financial data).  
**Value proposition:** learn how online scams work by investigating and making decisions, not by completing a generic multiple-choice test.  
**Target full-game session:** 3–5 minutes; three missions averaging 45–75 seconds with optional clue exploration.  
**MVP:** no account, no backend, no real payment integration, no LLM API, no user text input, no collection of phone numbers/OTPs/credentials.

### Success signals
1. New player understands the premise and can reach Mission 1 within 10 seconds without instructions.
2. Each scenario has at least two genuinely different decision outcomes and a clear educational takeaway.
3. The investigation feels plausible; cinematic effects reinforce the clue rather than obscure it.
4. Entire experience is usable on small phones, with no horizontal scrolling, trapped controls or inaccessible tap targets.
5. Final report is replayable and can be shared through a privacy-preserving image/download or native-share/fallback flow in a later batch.

### Experience principles
- **Recognizable first, futuristic second:** message content, notifications and call screens resemble generic phone patterns; game overlay reveals evidence and consequences.
- **Investigate, don't guess:** interactive evidence affordances reveal sender details, URLs, urgency, and suspicious demands.
- **Player agency:** decisions change dialogue, simulated consequences, and scores; branches reconverge cleanly to keep scope feasible.
- **Teach without shaming:** explain *why* a choice was risky, never insult the player.
- **Fast, purposeful animation:** no long intro, excessive typing animation, flashing or forced wait.
- **Explicit fiction:** every scenario states that it is a simulated educational exercise; never show actionable real phishing URLs or prompt for real sensitive information.

## 2. Precise screen inventory and flow

```text
Home
  └── Start Investigation
       └── Mission Briefing (Mission 1)
            └── Simulation
                 ├── Inspect sender / message / URL / payment context
                 ├── Decision checkpoint -> alternate scene/consequence
                 ├── Signal Reveal
                 └── Mission Debrief
                      ├── Continue -> Briefing (next mission)
                      └── Replay mission [later batch]
                           ... repeat until Mission 3 ...
                                └── Digital Detective Report
                                     ├── Replay All
                                     └── Share / Save Report
```

**Batch 1 must implement:** a functional Home, a Mission 1 Briefing, and a visibly labeled **Preview Mode** simulation shell with sample fictional content and a functional back control. The preview is *not* falsely presented as playable. Do not display active scores, unlocked achievements, or share controls until those work. Implement real mission mechanics in Batch 2 and the remaining missions/final report in Batch 3.

### Screen A — Home / introduction
- **Mobile layout:** full-viewport dark canvas; top brand row (left: shield mark + SCAMSIGNAL; right: small `INTERACTIVE SIMULATION` label); hero title and subtitle; mock phone notification card as focal point; one primary `Start Investigation` CTA; below-fold `How it works` in three short visual steps and `Educational simulation. No real payments or messages.` disclaimer.
- **Mobile spacing:** 20px side padding at 360–767px; 16px at 320–359px; top safe-area plus 20px; sections separated by 24–32px; maximum text measure ~35 characters for the primary headline on phone.
- **Desktop layout:** 2-column hero in an 1120px max-width container, copy on left, phone preview on right. Full game beyond the landing remains centered in a 420px stage with optional unobtrusive decorative context; never expand conversation bubbles across a desktop screen.
- **Required states:** initial, button focus/hover/press, transition to briefing, reduced-motion equivalent. No artificial loading screen.
- **CTA behavior:** `Start Investigation` navigates to a mission briefing—not a dead end or an unimplemented game.

### Screen B — Mission briefing
- Chapter identifier, concise mission title, a 1–2 sentence setup, one objective, approximate duration, `Begin Preview` (Batch 1) / `Begin Mission` (after Batch 2), and Back.
- Mobile content fits naturally without clipping at 320px; primary CTA anchored near bottom on short pages but scrolls normally when the viewport is short or keyboard zoomed.
- Progress label uses semantic text: `MISSION 01 / 03`. Do not display an earned point total before scoring is available.
- States: entry, focused CTA, exit/back, reduced motion.

### Screen C — Simulation shell / message thread
- Top 56–64px sticky header: back arrow, sender/mission name, progress/chapter indicator, accessible game context; clear preview badge in Batch 1.
- Primary message viewport: generic phone notification and message cards, time labels, sender metadata, a deliberately fictional suspicious link shown as inert text (`parcel-status.example`), and clearly marked clue hotspots.
- Bottom action zone: in later batches, 2–3 decision cards with distinct outcomes; in Batch 1 show a single non-deceptive `Return to Briefing` action rather than fake choices. Nothing should look tappable unless it works.
- Readability: width 100% within a stage max-width 420px; chat bubble max-width 85%; body text minimum 16px; long addresses must wrap safely.
- States planned for later batches: untouched, clue inspected, action chosen, transition, consequence, reveal, debrief, pause/resume, and final outcome.

### Screen D — Evidence inspection / clue details [designed in Batch 1; interactive in Batch 2]
- Tap or focus/activate a clue hotspot to open an evidence bottom sheet/dialog with a short title, highlighted source fragment, one-sentence explanation, and dismiss control.
- On desktop it may become a side drawer; on phone it is a bottom sheet no higher than ~75dvh with scrollable inner content.
- Escape closes the panel; focus is trapped inside a modal and returned to the triggering hotspot when dismissed. Background is inert while modal is open.
- Differentiate evidence by label/icon/pattern, never color alone.

### Screen E — Signal Reveal [design spec in Batch 1; implementation in Batch 2]
- Screen dim/brief pause (not longer than ~250ms), then evidence highlights are layered around the original message, with 1–3 succinct signals (`Sender mismatch`, `Urgent demand`, `Suspicious domain`).
- Headline states result in plain language; final panel says what a safer real-world action would be.
- `Continue` always available, and a reduced-motion variant presents the complete result instantly.
- Audio is optional, off by default; no startling sound, strobe, or flashing effects.

### Screen F — Mission Debrief [designed in Batch 1; implementation in Batch 2]
- Mission outcome (Safe / Caution / Risky) in plain language, 1–3 clues exposed, actionable lesson, mission score, `Next Mission`/`Retry`.
- Avoid negative personal labels; communicate simulated consequence, not real loss.

### Screen G — Digital Detective Report [designed in Batch 1; implementation in Batch 3]
- 0–100 overall score; meaningful non-stigmatizing title; breakdown by mission and strengths; one prioritized safety tip; Replay; Save/Share result. Use generic badge artwork; no personally identifying information.
- Keep screenshot/save output at fixed share-card dimensions in later implementation; do not require account creation.

## 3. Exact responsive layout rules

| Viewport | Behavior | Horizontal padding | Game stage |
|---|---|---:|---:|
| 320–359px | Small phone: compact title, single-column everything, shorter copy, no side-by-side CTAs | 16px | 100% available width |
| 360–767px | Standard mobile: immersive full-width experience | 20px | 100% up to 420px |
| 768–1023px | Tablet: centered game stage, restrained ambient side space | 24px outside stage | max 420px |
| >=1024px | Desktop: 2-column home; all gameplay remains in centered stage | 32px outside stage | max 420px |

- Global `box-sizing: border-box`; no horizontal scrolling at 320, 375, 390, 430, 768, 1024 and 1440px.
- Use `min-height: 100dvh` with compatible fallback and `env(safe-area-inset-*)` on mobile; do not place fixed controls behind browser chrome.
- Minimum interactive target size 44×44 CSS px; minimum 8px visual spacing between adjacent targets where possible.
- Sticky/anchored CTAs must not obscure content; main content gets bottom inset/padding.
- Use responsive text clamps; do not scale the entire app with transforms or set an inflexible phone viewport height.
- For touch, hover effects are decorative only; active, focus-visible and disabled states are distinct.
- Test portrait and landscape on short screens; prevent bottom sheet overlays from covering their own close button.

## 4. Design tokens

### Color palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#07111F` | Main canvas and dark text on bright accents |
| `--color-surface` | `#0E1B2C` | Cards, notification panels |
| `--color-surface-raised` | `#14273B` | Dialogs, highlighted panels |
| `--color-surface-inset` | `#091524` | Chat viewport, recessed areas |
| `--color-accent` | `#4DE4C0` | Primary CTA, active clue, positive scan signal |
| `--color-accent-hover` | `#22CFA5` | Hover/active feedback |
| `--color-primary-text` | `#F5FAFF` | Primary copy |
| `--color-secondary-text` | `#B7C5D6` | Secondary copy |
| `--color-muted-text` | `#8093AA` | Quiet labels (not for tiny text on raised panels without verification) |
| `--color-border` | `#294057` | Dividers, hairlines |
| `--color-warning` | `#FFCB6B` | Caution, ambiguous decision |
| `--color-danger` | `#FF6B7A` | Clearly simulated risk outcome |
| `--color-success` | `#64E0AC` | Safe outcome |
| `--color-focus` | `#A3F9DE` | High-visibility keyboard focus |

Dark text (`#07111F`) must appear on mint buttons. Do not use white body text on a mint button. Use no more than 1–2 subtle glows on a screen; never depend on glow for contrast. Design for WCAG AA 4.5:1 normal text and 3:1 for large text or meaningful UI boundaries; validate rendered combinations rather than assuming all token pairings pass.

### Typography

| Role | Face / fallbacks | Mobile size / line-height | Desktop size / line-height | Weight |
|---|---|---|---|---|
| Hero | Space Grotesk, system-ui, sans-serif | 40px / 1.08 | 56px / 1.05 | 700 |
| Screen title | Space Grotesk | 30px / 1.15 | 36px / 1.12 | 700 |
| Section heading | Space Grotesk | 22px / 1.25 | 24px / 1.25 | 600 |
| Body | Inter, system-ui, sans-serif | 16px / 1.55 | 16px / 1.55 | 400 |
| Button | Inter | 16px / 1.25 | 16px / 1.25 | 600 |
| Supporting | Inter | 14px / 1.5 | 14px / 1.5 | 400–600 |
| Data / chapter ID | JetBrains Mono, monospace | 12px / 1.4 | 12px / 1.4 | 500–600 |

Prefer locally bundled WOFF2 or well-behaved fallbacks; no text should shift dramatically if web fonts are unavailable. Never force uppercase on body passages. Apply letter spacing only to short metadata, not paragraphs.

### Spacing and shape
- Base space scale (px): `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.
- Button height: 52px primary, >=44px secondary; horizontal padding 20px.
- Card padding: 16–20px phone, 24px wider layouts.
- Card radius: 16px; large scene containers: 24px; chips: pill radius; modal: 20px top corners on phone.
- Borders: 1px subtle stroke; emphasis by structure and contrast, not heavy shadow.
- Avoid a desktop phone-shaped black border that consumes valuable mobile screen space.

### Motion tokens
- Microinteraction: ~140ms, ease-out.
- Panel/scene transition: ~240ms, ease-out.
- Special Signal Reveal: up to ~420ms total, not blocking reading or navigation.
- Prefer opacity + transform for performant transitions; no flashing, flickering, forced waits or repeating attention traps.
- Honor `prefers-reduced-motion: reduce` by removing nonessential movement without hiding any information.

## 5. Components and hierarchy

```text
App
├── AppProviders (future: game session + accessibility settings)
├── BackgroundAtmosphere (subtle, reduced-motion aware)
├── GlobalErrorBoundary
├── SiteShell
│   ├── BrandMark
│   ├── Header / GameHeader
│   ├── Main (landmark)
│   │   └── ViewRouter
│   │       ├── HomePage
│   │       │   ├── HeroCopy
│   │       │   ├── NotificationPreviewCard
│   │       │   └── HowItWorks
│   │       ├── MissionBriefingPage
│   │       │   ├── MissionMetadata
│   │       │   └── PrimaryAction
│   │       ├── SimulationPage (preview shell in Batch 1)
│   │       │   ├── PhoneStage
│   │       │   ├── FictionalMessageCard
│   │       │   ├── ClueHotspot (later enabled)
│   │       │   ├── DecisionOption (later enabled)
│   │       │   └── EvidenceSheet (Batch 2)
│   │       ├── SignalRevealView (Batch 2)
│   │       ├── MissionDebriefPage (Batch 2)
│   │       └── FinalReportPage (Batch 3)
│   └── Footer / SimulationDisclosure
└── ToastRegion (if notifications are implemented)
```

**Suggested file plan** (Antigravity should review and may propose an equally simple alternative):

```text
src/
  app/App.tsx
  app/navigation.ts
  components/ui/{Button,Card,BrandMark}.tsx
  components/game/{PhoneStage,FictionalMessageCard,GameHeader}.tsx
  features/home/HomePage.tsx
  features/missions/MissionBriefingPage.tsx
  features/missions/SimulationPreviewPage.tsx
  features/missions/missionTypes.ts            # contracts only in Batch 1
  features/missions/missionCatalog.ts          # safe metadata, no full engine yet
  styles/tokens.css
  styles/globals.css
  assets/
  tests/                                      # select lean test structure
```

Avoid introducing a state library or full routing package until the plan demonstrates a real need. Browser Back must be supported; for a 3-view Batch 1 journey, a minimal URL-aware router is acceptable. If using React Router, justify the dependency.

## 6. Detailed mission architecture (design contract for later batches)

### Engine design
Use a typed, declarative graph of scenes. Every scene has an ID, kind, content, optional clues, available choices, and deterministic next-state targets. The game engine must not render arbitrary external HTML. Store all story content locally as reviewed data.

Illustrative TypeScript contracts (not an instruction to create files before approval):

```ts
type MissionId = 'parcel' | 'internship' | 'refund';
type SceneKind = 'message' | 'inspection' | 'decision' | 'consequence' | 'reveal' | 'debrief';
type Outcome = 'safe' | 'caution' | 'risky';

type Clue = {
  id: string;
  sourceLabel: string;
  explanation: string;
  emphasis: 'sender' | 'url' | 'urgency' | 'payment' | 'claim';
};

type Choice = {
  id: string;
  label: string;
  nextSceneId: string;
  points: 0 | 15 | 20 | 30 | 40;
  consequenceText: string;
  safetyRationale: string;
};

type Scene = {
  id: string;
  kind: SceneKind;
  title?: string;
  body: string;
  clueIds?: string[];
  choices?: Choice[];
  nextSceneId?: string;
  outcome?: Outcome;
};

type Mission = {
  id: MissionId;
  order: 1 | 2 | 3;
  title: string;
  setup: string;
  learningObjective: string;
  startSceneId: string;
  clues: Record<string, Clue>;
  scenes: Record<string, Scene>;
};

type GameSession = {
  schemaVersion: 1;
  currentMissionId: MissionId;
  currentSceneId: string;
  inspectedClueIds: string[];
  decisions: { missionId: MissionId; sceneId: string; choiceId: string }[];
  missionScores: Partial<Record<MissionId, number>>;
  completedMissionIds: MissionId[];
};
```

Before implementation, the plan must resolve an exact scoring constraint: use **three scored decision checkpoints per mission worth 30 + 30 + 40 points**, allow `0`, half, or full weight on each checkpoint, and calculate the final report score as `Math.round((parcel + internship + refund) / 3)` (0–100). The illustrative `Choice.points` union above should be refined to represent half-credit for 30-point and 40-point checkpoints (15 and 20 respectively). Clue exploration must not itself add points; it provides context. The same decision must never be scored twice on replay, re-render or back navigation. Incomplete missions must not appear as zero on an overall final report.

### Mission 01 — The Missing Package (phishing)
**Learning objective:** verify a delivery claim using the service's official app/site rather than an unsolicited link.

| Beat | Scene | Player agency | Evidence / consequence |
|---|---|---|---|
| Intro | `parcel.brief` | Begin | A generic delivery notification arrives |
| Checkpoint 1 | `parcel.sender` | Inspect sender / trust immediately / dismiss | Sender address differs from claimed delivery service; safe action is verification |
| Checkpoint 2 | `parcel.link` | Use official channel / open simulated link / postpone | Suspicious `.example` URL and urgent delivery warning |
| Checkpoint 3 | `parcel.details` | Refuse sensitive data / continue simulated form / verify independently | Fictional request for address + sensitive information; no real form, no external link |
| Ending | `parcel.reveal` | Continue | Safe, caution, or risky simulated outcome with clear signals |

**Key clues:** mismatch between display name and sender; unusual URL; manufactured urgency; request for unnecessary information. **Branching rule:** risky choices expose a simulated credential request or warning, never real user data entry. All routes converge to the debrief. A harmless `dismiss` can be portrayed as cautious, while independent verification earns strongest educational feedback.

### Mission 02 — The Dream Internship (recruitment scam)
**Learning objective:** assess unsolicited offers, verify employers using independent contact channels, and reject pay-to-apply demands.

| Beat | Scene | Player agency | Evidence / consequence |
|---|---|---|---|
| Intro | `internship.brief` | Begin | Fictional recruiter offers unusually generous pay for little experience |
| Checkpoint 1 | `internship.offer` | Verify company independently / trust message / ask questions | Unverifiable generic recruiter profile |
| Checkpoint 2 | `internship.process` | Request official details / skip verification / abandon | No proper interview, extreme urgency |
| Checkpoint 3 | `internship.fee` | Decline fee / attempt simulated payment / report | A supposedly refundable registration fee of ₹499 |
| Ending | `internship.reveal` | Continue | Explains advance-fee recruitment fraud and independent verification |

**Key clues:** high-pay promise, pressure to act, off-platform chat, registration fee. No real employer branding, payment links or payment form.

### Mission 03 — The Refund Trap (UPI collect-request fraud)
**Learning objective:** understand that approving a UPI collect request authorizes payment; receiving a refund does not require entering a UPI PIN.

| Beat | Scene | Player agency | Evidence / consequence |
|---|---|---|---|
| Intro | `refund.brief` | Begin | Caller claims the player is owed a refund |
| Checkpoint 1 | `refund.call` | Independently verify / trust caller / postpone | Urgent refund claim and pressure |
| Checkpoint 2 | `refund.request` | Inspect request type / assume money is coming in / decline | The simulated request is explicitly marked `PAY ₹1,999`, not `RECEIVE` |
| Checkpoint 3 | `refund.pin` | Refuse authorization / choose fake approve action / seek official support | Educational preview of how approving would *send* money; never request a real PIN |
| Ending | `refund.reveal` | Continue | Clarifies collect-request behavior and official dispute channels |

**Key clues:** unexpected collect request; misleading refund pretext; payment authorization mislabeled as receiving; pressure. Never display realistic bank account numbers, live QR codes or actual payment actions.

### Engine rules and state handling
- Render one scene at a time and commit only valid transitions from data-defined choices; no dead ends.
- Each checkpoint has a safe, caution and risky option or another clearly documented equivalent, each with a next scene.
- Maintain inspected clues separately from decisions; preserve their state across scene revisits.
- Mission progress, score, and final report are derived from committed decisions, not displayed timers.
- Do not use real countdown pressure on the player; depict urgency as part of the scam narrative.
- Provide replay from mission start with an explicit reset. No double scoring.
- Persist only non-sensitive progress to a versioned localStorage key (later batch), with in-memory fallback if storage is blocked. No third-party analytics in initial MVP.
- Unit tests later must enumerate every choice path, confirm all reach an ending, and guarantee scores in 0–100.

## 7. Interactive states and interaction specification

| Component | States | Required behavior |
|---|---|---|
| Primary / secondary button | idle, hover, pressed, focus-visible, disabled, busy (only if real async) | Semantic button; clear focus ring; disabled is noninteractive; keyboard Space/Enter work |
| Notification preview | static / focused only if interactive | Batch 1 previews are static and not deceptively clickable |
| Mission card | idle, hover, focus, active, completed (future) | Only show completed when backed by actual progress |
| Message clue | uninspected, focused, inspected | Later: Enter/Space opens evidence sheet; inspected label visible without color alone |
| Decision option | available, focused, selected, committed | Later: commit once, then transition; no double scoring from repeated clicks |
| Evidence sheet | closed, opening, open, closing | Later: Esc/close control, focus management, readable scroll body |
| Signal Reveal | preparing, revealed, dismissed | Later: immediate reduced-motion presentation, always a Continue option |
| Session | new, in progress, completed, replaying | Later: progress maintained safely or explicitly reset |
| Error / empty | valid route, invalid route, unavailable storage | Friendly recovery path to home; never white-screen |

## 8. Accessibility, privacy and performance

- Semantic HTML landmarks, a single H1 per view, proper heading order, accessible button names, visible focus, no keyboard traps, and `aria-live` only for truly relevant status changes.
- Text WCAG AA contrast at 4.5:1 (3:1 large text), control visibility, minimum 44px tap targets, responsive 200% zoom, reduced motion and non-color-only feedback.
- Fonts and decorative UI must not delay meaningful interaction. Use CSS shapes/gradients and small optimized assets over large 3D canvases or video backgrounds.
- Avoid storing PII; no accounts, phone numbers, location, contacts, passwords, UPI PINs, OTPs, or real payment URLs.
- Keep educational safety text accessible; show `Fictional simulation — never enter real credentials.` in the simulation and debrief.
- Set page title and meta description; add favicon when assets are ready. Do not create fake SEO claims or fabricated user testimonials.
- Prefer no remote tracking or mandatory externally hosted media. If fonts must load remotely, ensure reliable fallbacks.

## 9. Batch 1 implementation scope, boundaries and milestones

**B1.0 Planning (current request):** read the specification, inspect workspace read-only, return proposed design choices, dependency/file plan, risks, task order and acceptance checklist. **Stop and wait for approval.**

**B1.1 Foundation (only after approval):** create Vite React TypeScript app in the designated project folder (or use existing app after read-only inspection), establish minimal styling/tokens/typefaces and predictable navigation.

**B1.2 UI system:** implement BrandMark, accessible Button, Card, GameHeader, PhoneStage and fictional message preview; ensure components have documented states.

**B1.3 User journey:** implement Home → Mission 1 Briefing → explicit Preview Mode Simulation Shell → return/Back, all usable via browser history and keyboard.

**B1.4 Quality:** add lean tests for navigation/components, lint/typecheck/build as applicable, responsive screenshots or equivalent manual evidence at required viewports, reduced-motion review, color contrast checks, and a concise handoff report.

**Explicitly excluded:** working mission choice engine, three playable missions, complete game scoring, result sharing, backend, authentication, external AI API, real or simulated live payment gateway, Embarko deployment, domain registration, public posting.

## 10. Acceptance criteria and evidence

| ID | Requirement | Pass condition | Evidence |
|---|---|---|---|
| B1-01 | Approval gate | No file changes before explicit owner approval | Agent plan and repo status before implementation |
| B1-02 | Correct scope | Only foundation, Home, Briefing, Preview Shell; no deployment | File diff and change summary |
| B1-03 | Navigation | Home → Briefing → Preview → Back works; browser Back does not break | Manual route test / automated navigation test |
| B1-04 | No deceptive UI | Unimplemented choices, scores and share buttons are absent or clearly labeled as future preview | Screenshots and UI inspection |
| B1-05 | Design fidelity | Palette, type hierarchy, 16px body text, spacing, CTA states and premium hybrid identity implemented | Design screenshots and token list |
| B1-06 | Small screens | No horizontal overflow at 320, 375, 390, 430, 768, 1024, 1440px | Viewport sweep screenshots/test |
| B1-07 | Touch targets | Actionable controls meet at least 44×44 CSS px | Layout inspection |
| B1-08 | Accessibility | Keyboard access, visible focus, proper semantics, contrast validation, reduced-motion fallback | Accessibility checklist / test notes |
| B1-09 | Content safety | Fictional sender/domain, inert suspicious link, explicit simulation disclosure, no credential collection | Source/content review |
| B1-10 | Error handling | Unknown route or unavailable storage does not blank-screen | Manual edge-case test |
| B1-11 | Engineering | TypeScript checks, lint, build and agreed tests pass | Command output / test log |
| B1-12 | Handoff | Files changed, design deviations, known issues, test evidence, next-batch dependencies documented | Batch report and Git diff |

## 11. Expected plan from Antigravity before coding

Antigravity should return, in this order:
1. Confirmation of the planned project location and any existing repository status (read-only).
2. Proposed product architecture and a screen-by-screen functional design, including an ASCII flow diagram.
3. Visual token and typography implementation plan, including mobile-first rules and reduced motion.
4. Component tree and exact proposed files with descriptions.
5. Routing/state approach and how future typed mission data will integrate without premature implementation.
6. Dependency choices, justified; highlight any conflict with Vite/Embarko source deployment.
7. Detailed B1.1–B1.4 steps and verification per step.
8. Risks, assumptions, open decisions and any necessary alternatives.
9. A pass/fail acceptance checklist tied to B1-01 through B1-12.
10. An explicit final line: **AWAITING OWNER APPROVAL — NO FILES CHANGED.**

No system install, package install, scaffolding, code modification, commit, network fetch or deployment is authorized by the planning request.

## 12. Later batches / deployment boundary

Batch 2: complete Mission 1 vertical slice and Signal Reveal, test branching/scoring.  
Batch 3: remaining missions, full 0–100 scoring and report/replay/share.  
Batch 4: accessibility, performance, responsive polish, testing and video capture.  
Batch 5: **only then**, after explicit approval, use the user's saved official Embarko prompt; deploy anonymously, test the actual live app, claim the app using an Embarko key requested at the correct stage, record deployment, then submit.

Do not install the optional Embarko deployment skill, provide an email, request keys, deploy or make public posts during Batch 1.

---

**Owner approval marker (not yet granted):** `APPROVE BATCH 1 IMPLEMENTATION`  
**Success definition:** a polished, accessible, functioning visual foundation and preview shell, with design contracts for the complete game, ready to extend into the first playable mission.
