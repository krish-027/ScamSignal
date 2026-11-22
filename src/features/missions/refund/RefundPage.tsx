import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, FileSearch, History, Home, Lightbulb, LockKeyhole, RefreshCcw } from 'lucide-react';
import { PhonePanel } from '../../../components/game/PhonePanel';
import {
  REFUND_EVIDENCE, REFUND_STEPS, createRefundSession, displayRefundChoices,
  loadRefundSession, matchesRefundPuzzle, persistRefundSession, recordRefundResponse,
  refundScore,
} from './refundModel';
import type { RefundSession } from './refundModel';
import '../internship/internship.css';
import './refund.css';

type Tool = 'evidence' | 'hint' | 'history' | 'confirm' | 'restart' | null;
interface RefundPageProps { onExit: () => void; }

export function RefundPage({ onExit }: RefundPageProps) {
  const [session, setSession] = useState<RefundSession | null>(loadRefundSession);
  const [tool, setTool] = useState<Tool>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const focusRef = useRef<HTMLButtonElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const step = session ? REFUND_STEPS[session.stepIndex] : undefined;
  const finished = !!session && session.stepIndex === REFUND_STEPS.length;
  const historyStep = reviewIndex !== null ? REFUND_STEPS[reviewIndex] : undefined;
  const historyAnswer = reviewIndex !== null ? session?.responses[reviewIndex] : undefined;
  const recordedLabel = historyStep?.kind === 'choice'
    ? historyStep.choices.find(option => option.id === historyAnswer?.answerId)?.label
    : historyAnswer ? 'Evidence correctly recalled' : null;
  const selectedChoice = step?.kind === 'choice' ? step.choices.find(item => item.id === pendingId) : undefined;
  const points = session ? refundScore(session) : 0;

  useEffect(() => { if (session) persistRefundSession(session); }, [session]);
  useEffect(() => {
    scrollRef.current?.scrollTo?.({ top: 0 });
    setAnswer(''); setError('');
  }, [session?.stepIndex]);
  const close = () => { setTool(null); setPendingId(null); setReviewIndex(null); };
  const open = (name: Exclude<Tool, null>, element: HTMLButtonElement) => {
    focusRef.current = element; setTool(name);
  };
  const begin = () => { setSession(createRefundSession()); close(); };
  const select = (id: string, element: HTMLButtonElement) => {
    if (!session || step?.kind !== 'choice') return;
    setPendingId(id); open('confirm', element);
  };
  const confirm = () => {
    if (!session || !pendingId || step?.kind !== 'choice') return;
    setSession(recordRefundResponse(session, pendingId)); close();
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session || step?.kind !== 'puzzle') return;
    if (!matchesRefundPuzzle(answer, step.answer)) {
      setError('That does not match the earlier evidence. Check Evidence and try again.'); return;
    }
    setSession(recordRefundResponse(session, 'solved')); setError('');
  };
  const back = (element: HTMLButtonElement) => {
    if (!session || session.responses.length === 0) { onExit(); return; }
    setReviewIndex(session.responses.length - 1); open('history', element);
  };

  return <div className="internship-screen refund-screen view-transition">
    <main id="main-content" className="internship-device refund-device">
      <div className="internship-status" aria-hidden="true"><span>09:41</span><span className="internship-speaker"/><span>● ▴ ▰</span></div>
      <header className="internship-header">
        <span className="internship-heading-icon"><CreditCard size={21} aria-hidden="true" /></span>
        <div><h1 tabIndex={-1}>The Refund Trap</h1><span>Mission 03 · Payment fraud investigation</span></div>
      </header>
      <div className="internship-scroll" ref={scrollRef}>
        {!session ? <section className="internship-card internship-intro">
          <p className="internship-eyebrow">CASE 03 / READY</p>
          <h2>A refund that costs you money?</h2>
          <p>A seller claims you are owed money, but every new instruction draws you toward a payment request. Investigate twelve steps, including two recall puzzles.</p>
          <p>10 consequential choices · 2 evidence puzzles · 100 possible points</p>
          <button type="button" className="internship-primary" onClick={begin}>Begin investigation <ArrowRight size={18} aria-hidden="true" /></button>
        </section> : finished ? <section className="internship-card internship-result">
          <p className="internship-eyebrow">CASE COMPLETED</p>
          <h2>Refund case closed</h2>
          <strong className="internship-score">{points}<small> / 100</small></strong>
          <p>All twelve interactions recorded. Your decisions are now available for review.</p>
          <div className="internship-summary" aria-label="Refund case results">
            {session.responses.map((response, index) => <div key={response.stepId}><span>{index + 1}. {REFUND_STEPS[index].title}</span><strong>+{response.points}</strong></div>)}
          </div>
          <button type="button" className="internship-secondary" onClick={event => open('restart', event.currentTarget)}><RefreshCcw size={18} aria-hidden="true" /> Replay mission</button>
          <button type="button" className="internship-primary" onClick={onExit}>Return to missions</button>
        </section> : step && session ? <>
          <div className="internship-progress"><span>CASE STEP {session.stepIndex + 1} OF {REFUND_STEPS.length}</span><span>{points} PTS</span></div>
          <div className="internship-progress-track" role="progressbar" aria-label="Completed refund steps" aria-valuemin={0} aria-valuemax={REFUND_STEPS.length} aria-valuenow={session.stepIndex}>
            <span style={{ width: `${session.stepIndex / REFUND_STEPS.length * 100}%` }} />
          </div>
          {session.responses.length > 0 && <p className="internship-feedback"><CheckCircle2 size={16} aria-hidden="true" /> Previous response locked · +{session.responses[session.responses.length - 1].points} points</p>}
          <section className="internship-message" aria-label="Simulated refund message">
            <div className="internship-sender"><span>MC</span><div><strong>MossCart Support</strong><small>refunds@mosscart-refunds.example</small></div><time>Just now</time></div>
            <p>{step.message}</p>
          </section>
          <section className="internship-card">
            <p className="internship-eyebrow">{step.kind === 'puzzle' ? 'EVIDENCE RECALL' : 'STRATEGIC DECISION'} · {session.stepIndex + 1}/{REFUND_STEPS.length}</p>
            <h2>{step.title}</h2>
            <p>{step.question}</p>
            {step.kind === 'choice' ? <div className="internship-options">
              {displayRefundChoices(step, session.seed).map((item, i) => <button type="button" key={item.id} className="internship-option" onClick={event => select(item.id, event.currentTarget)}>
                <span>{String.fromCharCode(65 + i)}</span>{item.label}
              </button>)}
            </div> : <form className="internship-puzzle" onSubmit={submit}>
              <label htmlFor="refund-evidence-answer">Answer from earlier evidence</label>
              <input id="refund-evidence-answer" aria-invalid={Boolean(error)} aria-describedby={error ? 'refund-evidence-error' : undefined} maxLength={24} autoComplete="off" spellCheck={false} value={answer} required placeholder={step.placeholder}
                onChange={event => { setAnswer(event.target.value); setError(''); }}/>
              {error && <p role="alert" id="refund-evidence-error" className="internship-error">{error}</p>}
              <button type="submit" className="internship-primary">Check evidence <ArrowRight size={17} aria-hidden="true" /></button>
            </form>}
          </section>
        </> : null}
      </div>
      <nav aria-label="Refund investigation tools" className="internship-tools">
        <button type="button" aria-label="Refund evidence archive" data-tooltip="Evidence — inspect the archive" onClick={event => open('evidence', event.currentTarget)}><FileSearch size={22} aria-hidden="true" /></button>
        <button type="button" aria-label="Refund investigator hint" data-tooltip="Hint — get a clue" disabled={!step} onClick={event => open('hint', event.currentTarget)}><Lightbulb size={22} aria-hidden="true" /></button>
        <button type="button" aria-label="Refund case log" data-tooltip="Case Log — review decisions" onClick={event => open('history', event.currentTarget)}><History size={22} aria-hidden="true" /></button>
      </nav>
      <nav aria-label="Refund phone navigation" className="internship-nav">
        <button type="button" aria-label="Refund phone Back: review earlier locked question" data-tooltip="Back — previous question" onClick={event => back(event.currentTarget)}><ArrowLeft size={22} aria-hidden="true" /></button>
        <button type="button" aria-label="Refund phone Home: return to mission selection" data-tooltip="Home — leave the case" onClick={onExit}><Home size={21} aria-hidden="true" /></button>
        <button type="button" aria-label="Refund phone Recent: view case history" data-tooltip="Recent — locked questions" onClick={event => open('history', event.currentTarget)}><History size={21} aria-hidden="true" /></button>
      </nav>
    </main>
    {tool && <PhonePanel title={tool === 'evidence' ? 'Refund Evidence' : tool === 'hint' ? 'Refund Investigator Hint' : tool === 'history' ? 'Refund Case Log' : tool === 'restart' ? 'Restart Refund Mission?' : 'Confirm refund decision'} onClose={close} returnFocusTo={focusRef.current}>
      {tool === 'evidence' && <div className="internship-dialog-content">
        <p>Previously observed clues remain available for reference.</p>
        {REFUND_EVIDENCE.filter(item => session && item.at <= session.stepIndex).map(item => <div key={item.id} className="internship-note"><strong>{item.title}</strong><p>{item.detail}</p></div>)}
        {!session && <p>Start the mission to view evidence.</p>}
      </div>}
      {tool === 'hint' && <div className="internship-dialog-content"><p>{step?.hint ?? 'Review the available evidence and previously recorded decisions.'}</p><small>Hints do not affect your score.</small></div>}
      {tool === 'history' && <div className="internship-dialog-content">
        {historyStep && historyAnswer && session ? <>
          <p className="internship-eyebrow">LOCKED QUESTION {reviewIndex! + 1} OF {session.responses.length}</p>
          <h3>{historyStep.title}</h3><p>{historyStep.question}</p>
          <div className="internship-note"><strong>Recorded answer</strong><p>{recordedLabel}</p><small>+{historyAnswer.points} points · read-only</small></div>
          <div className="internship-history-buttons">
            <button type="button" className="internship-secondary" disabled={reviewIndex === 0} onClick={() => setReviewIndex(i => i === null ? null : Math.max(0, i - 1))}>Older</button>
            <button type="button" className="internship-secondary" disabled={reviewIndex === session.responses.length - 1} onClick={() => setReviewIndex(i => i === null ? null : Math.min(session.responses.length - 1, i + 1))}>Newer</button>
          </div>
          <button type="button" className="internship-primary" onClick={close}>Return to current step</button>
        </> : <><p>Confirmed responses are locked and cannot be edited.</p>
          {session?.responses.length ? session.responses.map((item, i) => <button type="button" className="internship-history-row" key={item.stepId} onClick={() => setReviewIndex(i)}>{i + 1}. {REFUND_STEPS[i].title}<span>+{item.points}</span></button>) : <p>No completed responses yet.</p>}
          {session && <button type="button" className="internship-secondary" onClick={event => open('restart', event.currentTarget)}>Restart refund mission</button>}
        </>}
      </div>}
      {tool === 'confirm' && <div className="internship-dialog-content">
        <p>Once confirmed, this decision cannot be edited without restarting the case.</p>
        <div className="internship-note"><strong>{selectedChoice?.label}</strong></div>
        <button type="button" className="internship-primary" onClick={confirm}><LockKeyhole size={17} aria-hidden="true" /> Confirm and lock</button>
        <button type="button" className="internship-secondary" onClick={close}>Review answers again</button>
      </div>}
      {tool === 'restart' && <div className="internship-dialog-content"><p>This clears only the Refund Trap attempt. Your other missions are unchanged.</p>
        <button type="button" className="internship-danger" onClick={begin}>Confirm restart refund mission</button>
        <button type="button" className="internship-secondary" onClick={close}>Keep current progress</button>
      </div>}
    </PhonePanel>}
  </div>;
}
