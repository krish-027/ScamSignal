# ScamSignal — Embarko Challenge Submission Plan

Check the official rules again before submission: https://embarko.ai/challenge/rules

**As verified 22 Nov 2026:** Official rules state the entry deadline is **30 Nov 2026 at 11:59 p.m. India Standard Time**. Register on the challenge page. The app must be hosted on Embarko at a `*.embarko.app` address, remain live, and be claimed/kept as prompted; the initial anonymous deployment alone is not permanent. A public demonstration video **40 seconds–3 minutes**, on Instagram/X/YouTube, must include `#DeployWithEmbarko` and the app link; submit the app link and all post links through the challenge form before deadline. The app and post(s) must remain live/public until winners are announced. One entry per individual, not a team entry. See official rules for full eligibility and rights conditions.

## Recommended order (no deployment in Batch 4D)

1. **Final local QA:** run release gate, visual checklist, check source code license and images; keep source on a clean Git branch.
2. **Anonymous Embarko deploy (separate authorized step):** follow the **current** https://embarko.ai/docs/quickstart.md, no Dockerfile unless the current docs explicitly require it. Capture the HTTPS `*.embarko.app` link.
3. **Verify the live deployment:** desktop + mobile, all three missions, deep-link hashes, persistence after refresh, assets, 404s, and console. The local production check does not verify Embarko hosting.
4. **Make the app permanent:** when Embarko's workflow offers to keep/claim it, follow its actual instructions and provide the user's intended email/key through the official flow; do not publish keys.
5. **Record a short demo:** show the problem, homepage and mission selection, one dilemma from each case, one typed evidence puzzle, and progress/achievements. Demonstrate use of Embarko and show your real app URL.
6. **Post and submit:** upload publicly to one supported social network with `#DeployWithEmbarko` and the app link; submit through the challenge form; save the confirmation and link(s).
7. **Monitoring:** keep the app deployed and posts public until the result is announced.

## Suggested video storyboard (~90 seconds)

- 0:00–0:12 — Hook: 'Would you recognize a realistic scam before it costs you?'
- 0:12–0:27 — Show ScamSignal homepage and select from three cases.
- 0:27–0:45 — Show the parcel decision/evidence clues and locked-choice consequence.
- 0:45–1:03 — Show internship typed-evidence puzzle, then refund UPI-fraud scenario.
- 1:03–1:15 — Show scores, progress and achievements.
- 1:15–1:30 — Show the **real** Embarko-hosted URL and explain the launch. End with #DeployWithEmbarko.

Use original screen recordings and original or licensed assets. Do not imply real scam links or payment operations are functional. Do not display credentials, email keys, private files or personal contact details.

## Submission checklist

- [ ] Registration completed on required platforms (verify any additional current challenge requirements)
- [ ] Working, claimed `https://...embarko.app` link copied
- [ ] Public 40–180 second video created with app demo, Embarko hosting, hashtag and actual app link
- [ ] Public post link(s) copied
- [ ] Entry form submitted by Nov 30, 2026, 11:59 p.m. IST
- [ ] App and post remain online and public until results
