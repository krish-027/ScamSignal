export type RecruitmentOutcome = 'safe' | 'caution' | 'risk';

export interface RecruitmentChoice {
  id: string;
  label: string;
  outcome: RecruitmentOutcome;
  detail: string;
}
export interface ChoiceStep {
  kind: 'choice';
  id: string;
  title: string;
  message: string;
  question: string;
  hint: string;
  choices: readonly RecruitmentChoice[];
}
export interface PuzzleStep {
  kind: 'puzzle';
  id: string;
  title: string;
  message: string;
  question: string;
  hint: string;
  expected: string;
  placeholder: string;
}
export type RecruitmentStep = ChoiceStep | PuzzleStep;

const choice = (
  id: string, title: string, message: string, question: string, hint: string,
  answers: readonly [RecruitmentChoice, RecruitmentChoice, RecruitmentChoice],
): ChoiceStep => ({ kind: 'choice', id, title, message, question, hint, choices: answers });
const safe = (id: string, label: string, detail: string): RecruitmentChoice => ({ id, label, outcome: 'safe', detail });
const caution = (id: string, label: string, detail: string): RecruitmentChoice => ({ id, label, outcome: 'caution', detail });
const risk = (id: string, label: string, detail: string): RecruitmentChoice => ({ id, label, outcome: 'risk', detail });

/** A purely fictional recruitment case. All email addresses are inert .example domains. */
export const RECRUITMENT_STEPS: readonly RecruitmentStep[] = [
  choice('invite', 'An unexpected invitation',
    'TalentBridge Labs says it selected you for a remote internship. Its message includes candidate reference 4826, although you never applied.',
    'What should you investigate first?', 'Consider what the sender can claim without proving it.', [
      risk('reply-now', 'Reply to the sender asking them to reserve your slot', 'This confirms that the unsolicited account is active.'),
      safe('check-employer', 'Look for the employer through an independent source', 'You separate the organization from the sender claiming to represent it.'),
      caution('ask-classmate', 'Ask classmates whether they have seen this message', 'A second opinion may help, but shared messages are not proof.'),
    ]),
  choice('domain', 'The matching-looking website',
    'The recruiter cites careers@talentbridge-onboarding.example and links to talentbridge-onboarding.example. An official company site is not yet established.',
    'How do you evaluate the site?', 'Similar spelling does not mean the same owner.', [
      caution('search-site', 'Search for reviews of the supplied address', 'Reviews can help, but search results can be manipulated.'),
      risk('trust-branding', 'Accept it because the colors match the company logo', 'Branding is easy to imitate.'),
      safe('compare-domain', 'Find the real employer site independently and compare domains', 'You verify the actual recruiting channel before trusting a link.'),
    ]),
  choice('salary', 'An unusually generous salary',
    'The message promises unusually high weekly pay for minimal work and requests a quick acceptance.',
    'Which response is most defensible?', 'Consider why the offer pressures you to skip normal hiring checks.', [
      safe('verify-role', 'Verify whether the role and salary exist on an official careers page', 'You test the claim against an independent source.'),
      caution('negotiate', 'Negotiate the payment details before deciding', 'You have not verified whether the job itself exists.'),
      risk('accept-fast', 'Accept before the deadline expires', 'The artificial deadline influences the decision before verification.'),
    ]),
  choice('identity', 'A recruiter moves the conversation',
    'The recruiter suggests switching to a private chat and says the hiring team uses that channel exclusively.',
    'What would you do?', 'A private chat is not inherently fraudulent, but it does not verify affiliation.', [
      risk('private-chat', 'Move to private chat and treat the agent as verified', 'The new chat does not establish identity.'),
      safe('confirm-recruiter', 'Check the recruiter through published company contact details', 'You verify a person through a separate route.'),
      caution('request-badge', 'Ask the recruiter to send an employee badge photo', 'Images of badges can be fabricated.'),
    ]),
  { kind: 'puzzle', id: 'reference', title: 'Recover the candidate reference',
    message: 'The case log asks for the four-digit reference shown in the initial recruitment invitation.',
    question: 'Enter the four-digit candidate reference from the first message.',
    hint: 'Open Evidence and review the invitation received at the start of the case.',
    expected: '4826', placeholder: '4-digit reference' },
  choice('documents', 'Personal documents requested',
    'A message labeled “Screening desk” gives the fictional keyword LANTERN, then requests identity documents before a verified interview.',
    'How should you respond to this request?', 'Ask whether the person and process have been independently verified.', [
      caution('ask-policy', 'Ask about the company retention policy before sending anything', 'A policy statement alone does not verify the recipient.'),
      safe('withhold-docs', 'Hold documents until the employer and process are verified', 'You avoid giving sensitive information to an unverified recipient.'),
      risk('upload-docs', 'Upload documents to the recruiter-provided portal', 'You risk handing identity documents to an imitation site.'),
    ]),
  choice('software', 'A special screening application',
    'The recruiter provides an installer file and claims it is required for the interview.',
    'What is the better next step?', 'Unknown software from an unsolicited contact is a meaningful risk.', [
      risk('install-direct', 'Install the file to show enthusiasm', 'Unknown executables may compromise a device.'),
      caution('scan-file', 'Run a virus scan and then decide whether to install', 'Scanning helps but does not establish that the software is legitimate.'),
      safe('confirm-software', 'Verify interview software through official company instructions', 'You establish whether the tool is legitimate before installing anything.'),
    ]),
  choice('fee', 'The refundable training deposit',
    'The recruiter requests a small “refundable training deposit” before issuing a letter. No payment is processed in this simulation.',
    'Which action is safest?', 'A hiring offer requiring a payment deserves strong skepticism.', [
      caution('ask-refund', 'Ask for the deposit terms and refund policy', 'The scammer may supply plausible terms without legitimacy.'),
      safe('decline-fee', 'Decline the payment and verify the opportunity separately', 'You avoid an advance-fee trap.'),
      risk('pay-deposit', 'Agree to the requested deposit', 'An upfront payment can lead to further demands.'),
    ]),
  { kind: 'puzzle', id: 'keyword', title: 'Verify your earlier evidence',
    message: 'Your case notes contain a single-word screening keyword used by the supposed hiring desk.',
    question: 'Enter the screening keyword from the document-request step.',
    hint: 'Open Evidence and find the screening-desk message. It used an uppercase word.',
    expected: 'LANTERN', placeholder: 'Screening keyword' },
  choice('report', 'Close the recruitment case',
    'You have enough evidence to decide how to handle this unsolicited offer.',
    'How will you close the case?', 'Think about safely disengaging and helping prevent repeat attempts.', [
      safe('report-message', 'Keep the evidence and report the suspicious contact through a trusted channel', 'You disengage and preserve useful information for reporting.'),
      risk('follow-link', 'Follow the recruiter’s final verification link', 'You return to an unverified source.'),
      caution('just-block', 'Block the sender without preserving the message', 'Blocking ends contact, but useful evidence may be lost.'),
    ]),
];

export const RECRUITMENT_CLUES = [
  { id: 'invite', unlockedAt: 0, title: 'Initial invitation', detail: 'Candidate reference: 4826. The recruiter says you were selected without applying.' },
  { id: 'domain', unlockedAt: 1, title: 'Recruitment website', detail: 'talentbridge-onboarding.example is a fictional domain supplied by the sender, not independent verification.' },
  { id: 'salary', unlockedAt: 2, title: 'Salary promise', detail: 'Unusually high pay is combined with a rushed decision.' },
  { id: 'desk', unlockedAt: 5, title: 'Screening desk', detail: 'Screening keyword: LANTERN. The same sender requests sensitive documents before a verified interview.' },
  { id: 'fee', unlockedAt: 7, title: 'Training deposit', detail: 'The purported refundable deposit is requested before an official offer letter.' },
] as const;

export interface RecruitmentAnswer { stepId: string; answerId: string; points: 0 | 5 | 10; }
export interface RecruitmentState {
  version: 1;
  startedAt: number;
  seed: number;
  stepIndex: number;
  answers: RecruitmentAnswer[];
}
export const RECRUITMENT_STORAGE_KEY = 'scamsignal.internship.v1';

export function newRecruitment(now: number = Date.now()): RecruitmentState {
  return { version: 1, startedAt: now, seed: now >>> 0, stepIndex: 0, answers: [] };
}

/** Independent per-attempt and per-question order, stable across refresh and review. */
export function displayedRecruitmentChoices(step: ChoiceStep, seed: number): RecruitmentChoice[] {
  const shuffled = [...step.choices];
  let hash = (seed ^ 0x9e3779b9) >>> 0;
  for (const char of step.id) hash = (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0;
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    hash ^= hash << 13; hash ^= hash >>> 17; hash ^= hash << 5;
    const j = (hash >>> 0) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function puzzleMatches(typed: string, expected: string): boolean {
  const norm = (value: string) => value.trim().replace(/\s+/g, '').toUpperCase();
  return norm(typed) === norm(expected);
}

export function answerRecruitment(state: RecruitmentState, answerId: string): RecruitmentState {
  const step = RECRUITMENT_STEPS[state.stepIndex];
  if (!step) throw new Error('The mission is complete');
  let points: 0 | 5 | 10;
  if (step.kind === 'choice') {
    const selected = step.choices.find(item => item.id === answerId);
    if (!selected) throw new Error('Invalid answer for the current question');
    points = selected.outcome === 'safe' ? 10 : selected.outcome === 'caution' ? 5 : 0;
  } else {
    if (answerId !== 'solved') throw new Error('A puzzle must be solved to advance');
    points = 10;
  }
  if (state.answers.length !== state.stepIndex) throw new Error('Invalid progress state');
  return { ...state, stepIndex: state.stepIndex + 1,
    answers: [...state.answers, { stepId: step.id, answerId, points }] };
}

export function recruitmentScore(state: RecruitmentState): number {
  return state.answers.reduce((total, answer) => total + answer.points, 0);
}

/** Reject modified/invalid saved states. Never touch Mission 1 storage. */
export function isValidRecruitmentState(value: unknown): value is RecruitmentState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const s = value as Partial<RecruitmentState>;
  if (s.version !== 1 || !Number.isSafeInteger(s.startedAt) || !Number.isSafeInteger(s.seed)
    || !Number.isInteger(s.stepIndex) || s.stepIndex! < 0 || s.stepIndex! > RECRUITMENT_STEPS.length
    || !Array.isArray(s.answers) || s.answers.length !== s.stepIndex) return false;
  return s.answers.every((saved, index) => {
    if (!saved || typeof saved !== 'object') return false;
    const step = RECRUITMENT_STEPS[index];
    if (saved.stepId !== step.id) return false;
    if (step.kind === 'puzzle') return saved.answerId === 'solved' && saved.points === 10;
    const selected = step.choices.find(option => option.id === saved.answerId);
    return !!selected && saved.points === (selected.outcome === 'safe' ? 10 : selected.outcome === 'caution' ? 5 : 0);
  });
}

export function loadRecruitment(): RecruitmentState | null {
  try {
    const raw = localStorage.getItem(RECRUITMENT_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return isValidRecruitmentState(parsed) ? parsed : null;
  } catch { return null; }
}
export function saveRecruitment(state: RecruitmentState): void {
  try { localStorage.setItem(RECRUITMENT_STORAGE_KEY, JSON.stringify(state)); } catch { /* private mode/quota */ }
}
