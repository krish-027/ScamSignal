/** Fictional, offline-only refund investigation. Never collects real payment credentials. */
export type RefundOutcome = 'safe' | 'caution' | 'risk';
export interface RefundChoice { id: string; label: string; outcome: RefundOutcome; consequence: string; }
export interface RefundChoiceStep {
  kind: 'choice'; id: string; title: string; message: string;
  question: string; hint: string; choices: readonly RefundChoice[];
}
export interface RefundPuzzleStep {
  kind: 'puzzle'; id: string; title: string; message: string;
  question: string; hint: string; answer: string; placeholder: string;
}
export type RefundStep = RefundChoiceStep | RefundPuzzleStep;
export interface RefundResponse { stepId: string; answerId: string; points: 0 | 4 | 8 | 10; }
export interface RefundSession { version: 1; startedAt: number; seed: number; stepIndex: number; responses: RefundResponse[]; }
export const REFUND_STORAGE_KEY = 'scamsignal.refund.v1';

const safe = (id: string, label: string, consequence: string): RefundChoice => ({ id, label, consequence, outcome: 'safe' });
const caution = (id: string, label: string, consequence: string): RefundChoice => ({ id, label, consequence, outcome: 'caution' });
const risk = (id: string, label: string, consequence: string): RefundChoice => ({ id, label, consequence, outcome: 'risk' });
const decision = (id: string, title: string, message: string, question: string, hint: string, choices: RefundChoice[]): RefundChoiceStep =>
  ({ kind: 'choice', id, title, message, question, hint, choices });
const puzzle = (id: string, title: string, message: string, question: string, hint: string, answer: string, placeholder: string): RefundPuzzleStep =>
  ({ kind: 'puzzle', id, title, message, question, hint, answer, placeholder });

export const REFUND_STEPS: readonly RefundStep[] = [
  decision('alert', 'An unexpected refund',
    'MossCart Support claims order RF-7318 is eligible for an instant refund, although you did not request one.',
    'Which step gives you the most reliable starting point?', 'A message can mention an order number without proving who sent it.', [
      caution('ask-order', 'Ask the sender which purchase they mean', 'The sender may produce convincing details without verification.'),
      safe('check-orders', 'Open the store through your own saved app or site', 'You check the claim without using the message sender as evidence.'),
      risk('reply-yes', 'Confirm the refund offer to reserve your place', 'You engage an unverified sender who is pushing a new financial action.'),
    ]),
  decision('portal', 'A convincing refund portal',
    'A link labeled mosscart-refunds.example shows a familiar brand and a progress bar.',
    'How do you evaluate the page?', 'Brand visuals can be copied; independently reached channels matter more.', [
      risk('enter-phone', 'Enter a phone number to unlock the refund', 'The page could gather details and continue the impersonation.'),
      safe('independent-portal', 'Compare with the merchant site reached independently', 'You separate an unknown link from a trusted merchant channel.'),
      caution('search-review', 'Look for reviews of the provided link', 'Search results can be manipulated and are not definitive proof.'),
    ]),
  decision('qr', 'A QR code arrives',
    'The sender says the refund will be credited after scanning a QR image, then following the instructions on your payment app.',
    'What is the most useful response?', 'Receiving a refund normally does not require you to authorize an outgoing payment.', [
      safe('avoid-qr', 'Stop and check refund instructions in the original merchant app', 'You do not let an unsolicited QR drive a payment flow.'),
      caution('show-friend', 'Ask someone else what the QR probably does', 'A second opinion helps, but does not verify the code.'),
      risk('scan-qr', 'Scan it and follow the on-screen payment prompts', 'A QR can launch a payment request rather than credit money.'),
    ]),
  decision('collect', 'A payment request is pending',
    'A simulated UPI collect request asks for approval, allegedly to release the refund.',
    'What does this request mean for your decision?', 'Approving a collect request may authorize money to leave your account.', [
      caution('hold-request', 'Leave the request pending while you research', 'You avoid immediate payment, but the untrusted request remains active.'),
      risk('approve-collect', 'Approve because the request says REFUND', 'The label does not change the payment authorization you would be granting.'),
      safe('reject-collect', 'Reject it and independently contact the merchant', 'You refuse the outgoing-payment request and verify its origin.'),
    ]),
  puzzle('reference', 'Find the original order reference',
    'Your case file asks you to retrieve the reference shown in the first refund message.',
    'Enter the fictional order reference from the initial alert.',
    'Open Evidence and look for the message titled Original refund alert.', 'RF-7318', 'Example: XX-0000'),
  decision('support-chat', 'Support moves to private chat',
    'The alleged agent asks you to continue in a new chat account to process the claim faster.',
    'What would improve your confidence most?', 'Moving to another account does not verify the first one.', [
      risk('move-chat', 'Move channels and trust the account badge', 'A profile badge and new chat can be impersonated.'),
      safe('verified-help', 'Use the published help route in your merchant account', 'The contact route is independent of the suspicious message.'),
      caution('ask-proof', 'Request a screenshot of the agent’s company ID', 'Images can be fabricated and remain sender-controlled.'),
    ]),
  decision('micro-fee', 'A refundable verification charge',
    'The agent demands a tiny verification payment before crediting the larger refund.',
    'How should you treat the fee?', 'A small amount is still a transfer and can open the door to repeated requests.', [
      safe('decline-fee', 'Decline the fee and verify refund policy independently', 'You stop the advance-fee trap.'),
      risk('pay-small', 'Agree because the amount seems harmless', 'A small initial payment can lead to larger demands.'),
      caution('ask-refund-terms', 'Ask the agent to write down refund conditions', 'A scammer can provide polished conditions without legitimacy.'),
    ]),
  decision('support-marker', 'A new support identifier',
    'The sender introduces a fictional support marker called MANGO and says it proves the case is official.',
    'What is the strongest next action?', 'A marker created by the sender does not prove affiliation.', [
      caution('compare-marker', 'Ask if other recipients got the same marker', 'Similar messages do not verify the source.'),
      safe('verify-case', 'Check the claim through a published merchant contact', 'You verify the case outside the message chain.'),
      risk('trust-marker', 'Treat the new identifier as official proof', 'The sender can invent identifiers.'),
    ]),
  decision('screenshare', 'A remote support request',
    'The agent offers to guide you by screen sharing while you open your payment app.',
    'Which approach best protects the device?', 'A screen share may expose notifications, payment details, or authentication prompts.', [
      risk('start-share', 'Share the screen and follow the agent’s instructions', 'This can expose sensitive on-screen information.'),
      caution('only-share-app', 'Share only part of the screen', 'Reducing exposure does not establish that the agent is legitimate.'),
      safe('no-share', 'Decline and use an independently verified support route', 'You keep control of the device and payment context.'),
    ]),
  decision('deadline', 'The disappearing deadline',
    'The agent claims the refund expires in fifteen minutes unless you act now.',
    'What should guide your next step?', 'A deadline is a pressure tactic until independently substantiated.', [
      safe('ignore-deadline', 'Verify the claim through the actual merchant before acting', 'You remove the artificial time pressure from the decision.'),
      caution('wait-fifteen', 'Wait until the timer expires, then reassess', 'You avoid immediate action but still lack independent verification.'),
      risk('rush', 'Complete the steps before the countdown ends', 'Urgency bypasses careful verification.'),
    ]),
  puzzle('marker', 'Recall the claimed support marker',
    'The investigation notes ask for the keyword the agent supplied as its supposed proof of legitimacy.',
    'Enter the single-word fictional support marker.',
    'Open Evidence and read the Support identifier entry.', 'MANGO', 'Support keyword'),
  decision('close', 'Close the refund case',
    'You have enough evidence to decide how to handle this suspicious refund conversation.',
    'Which action makes the strongest final response?', 'Preserving evidence can help a report while you disengage safely.', [
      caution('block-only', 'Block the account and ignore everything else', 'Blocking helps, but evidence may be lost.'),
      safe('save-report', 'Preserve the messages and report using a trusted channel', 'You disengage and retain useful evidence for reporting.'),
      risk('last-link', 'Try the sender’s final verification link one more time', 'A new link is not independent verification.'),
    ]),
];

export const REFUND_EVIDENCE = [
  { id: 'original', at: 0, title: 'Original refund alert', detail: 'Merchant claim: MossCart Support. Fictional order reference: RF-7318. You did not request a refund.' },
  { id: 'domain', at: 1, title: 'Refund link', detail: 'mosscart-refunds.example is a fictional training address supplied by the sender.' },
  { id: 'qr', at: 2, title: 'QR instruction', detail: 'The sender wants you to scan a QR image to receive money. QR/payment prompts must be verified independently.' },
  { id: 'collect', at: 3, title: 'UPI request', detail: 'A simulated collect request sought outgoing approval, despite the message promising an incoming refund.' },
  { id: 'marker', at: 7, title: 'Support identifier', detail: 'The agent introduced the fictional identifier MANGO, which is not independent proof.' },
  { id: 'screen', at: 8, title: 'Remote access', detail: 'A supposed support agent requested screen sharing while a payment app was open.' },
] as const;

export function createRefundSession(now: number = Date.now()): RefundSession {
  return { version: 1, startedAt: now, seed: now >>> 0, stepIndex: 0, responses: [] };
}
export function normalizeEvidenceAnswer(value: string): string {
  return value.normalize('NFKC').trim().replace(/[\s-]+/g, '').toUpperCase();
}
export function matchesRefundPuzzle(value: string, expected: string): boolean {
  return normalizeEvidenceAnswer(value) === normalizeEvidenceAnswer(expected);
}
export function displayRefundChoices(step: RefundChoiceStep, seed: number): RefundChoice[] {
  const shuffled = [...step.choices];
  let hash = (seed ^ 0x9e3779b9) >>> 0;
  for (const character of step.id) hash = (Math.imul(hash, 31) + character.charCodeAt(0)) >>> 0;
  for (let index = shuffled.length - 1; index > 0; index--) {
    hash ^= hash << 13; hash ^= hash >>> 17; hash ^= hash << 5;
    const swap = (hash >>> 0) % (index + 1);
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  return shuffled;
}
export function recordRefundResponse(session: RefundSession, answerId: string): RefundSession {
  const step = REFUND_STEPS[session.stepIndex];
  if (!step) throw new Error('Mission is already complete');
  if (session.responses.length !== session.stepIndex) throw new Error('Invalid session position');
  let points: 0 | 4 | 8 | 10;
  if (step.kind === 'puzzle') {
    if (answerId !== 'solved') throw new Error('Solve the evidence puzzle first');
    points = 10;
  } else {
    const option = step.choices.find(choice => choice.id === answerId);
    if (!option) throw new Error('Invalid choice for the current checkpoint');
    points = option.outcome === 'safe' ? 8 : option.outcome === 'caution' ? 4 : 0;
  }
  return { ...session, stepIndex: session.stepIndex + 1,
    responses: [...session.responses, { stepId: step.id, answerId, points }] };
}
export function refundScore(session: RefundSession): number { return session.responses.reduce((sum, item) => sum + item.points, 0); }
export function validRefundSession(value: unknown): value is RefundSession {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const state = value as Partial<RefundSession>;
  if (state.version !== 1 || !Number.isSafeInteger(state.startedAt) || !Number.isSafeInteger(state.seed) ||
    !Number.isInteger(state.stepIndex) || state.stepIndex! < 0 || state.stepIndex! > REFUND_STEPS.length ||
    !Array.isArray(state.responses) || state.responses.length !== state.stepIndex) return false;
  return state.responses.every((saved, index) => {
    if (!saved || typeof saved !== 'object') return false;
    const step = REFUND_STEPS[index];
    if (saved.stepId !== step.id) return false;
    if (step.kind === 'puzzle') return saved.answerId === 'solved' && saved.points === 10;
    const option = step.choices.find(choice => choice.id === saved.answerId);
    return !!option && saved.points === (option.outcome === 'safe' ? 8 : option.outcome === 'caution' ? 4 : 0);
  });
}
export function loadRefundSession(): RefundSession | null {
  try { const value = localStorage.getItem(REFUND_STORAGE_KEY); const parsed: unknown = value ? JSON.parse(value) : null;
    return validRefundSession(parsed) ? parsed : null;
  } catch { return null; }
}
export function persistRefundSession(state: RefundSession): void {
  try { localStorage.setItem(REFUND_STORAGE_KEY, JSON.stringify(state)); } catch { /* private browsing / quota */ }
}
