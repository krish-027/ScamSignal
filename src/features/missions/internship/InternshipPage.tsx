import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CheckCircle2, FileSearch, History, Home, Lightbulb, LockKeyhole, RefreshCcw } from 'lucide-react';
import { PhonePanel } from '../../../components/game/PhonePanel';
import {
  RECRUITMENT_CLUES, RECRUITMENT_STEPS, answerRecruitment, displayedRecruitmentChoices,
  loadRecruitment, newRecruitment, puzzleMatches, recruitmentScore, saveRecruitment,
} from './internshipModel';
import type { RecruitmentState } from './internshipModel';
import './internship.css';

type Tool = 'evidence' | 'hint' | 'history' | 'confirm' | 'restart' | null;

interface InternshipPageProps { onExit: () => void; }

export function InternshipPage({ onExit }: InternshipPageProps) {
  const [state, setState] = useState<RecruitmentState | null>(loadRecruitment);
  const [tool, setTool] = useState<Tool>(null);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [puzzleError, setPuzzleError] = useState('');
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const focusReturn = useRef<HTMLButtonElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const step = state ? RECRUITMENT_STEPS[state.stepIndex] : undefined;
  const completed = !!state && state.stepIndex === RECRUITMENT_STEPS.length;
  const total = RECRUITMENT_STEPS.length;

  useEffect(() => { if (state) saveRecruitment(state); }, [state]);
  useEffect(() => { scrollRef.current?.scrollTo?.({ top: 0 }); setTyped(''); setPuzzleError(''); }, [state?.stepIndex]);

  const closeTool = useCallback(() => { setTool(null); setChoiceId(null); setReviewIndex(null); }, []);
  const open = (name: Exclude<Tool, null>, element: HTMLButtonElement) => {
    focusReturn.current = element;
    setTool(name);
  };
  const start = () => { setState(newRecruitment()); closeTool(); };
  const select = (id: string, element: HTMLButtonElement) => {
    if (!step || step.kind !== 'choice') return;
    setChoiceId(id);
    open('confirm', element);
  };
  const lock = () => {
    if (!state || !choiceId || step?.kind !== 'choice') return;
    const next = answerRecruitment(state, choiceId);
    setState(next);
    closeTool();
  };
  const submitPuzzle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!state || step?.kind !== 'puzzle') return;
    if (!puzzleMatches(typed, step.expected)) {
      setPuzzleError('That does not match the earlier evidence. Review the Evidence tool and try again.');
      return;
    }
    setState(answerRecruitment(state, 'solved'));
    setPuzzleError('');
  };
  const goBack = (element: HTMLButtonElement) => {
    if (!state || state.answers.length === 0) { onExit(); return; }
    setReviewIndex(state.answers.length - 1);
    open('history', element);
  };
  const review = reviewIndex !== null && state ? RECRUITMENT_STEPS[reviewIndex] : null;
  const reviewAnswer = reviewIndex !== null && state ? state.answers[reviewIndex] : null;
  const reviewLabel = review?.kind === 'choice'
    ? review.choices.find(item => item.id === reviewAnswer?.answerId)?.label
    : reviewAnswer ? 'Correct evidence recalled' : null;
  const previousAnswer = state && state.answers.length > 0 ? state.answers[state.answers.length - 1] : null;
  const previousStep = state && previousAnswer ? RECRUITMENT_STEPS[state.answers.length - 1] : null;
  const selected = step?.kind === 'choice' ? step.choices.find(item => item.id === choiceId) : null;

  return (
    <div className="internship-screen view-transition">
      <main id="main-content" className="internship-device">
        <div className="internship-status" aria-hidden="true"><span>09:41</span><span className="internship-speaker"/><span>● ▴ ▰</span></div>
        <header className="internship-header">
          <span className="internship-heading-icon"><BriefcaseBusiness size={21} aria-hidden="true" /></span>
          <div><h1 tabIndex={-1}>The Dream Internship</h1><span>Mission 02 · Recruitment investigation</span></div>
        </header>
        <div className="internship-scroll" ref={scrollRef}>
          {!state ? (
            <section className="internship-card internship-intro">
              <p className="internship-eyebrow">NEW CASE / MISSION 02</p>
              <h2>One offer. Ten decisions.</h2>
              <p>You receive an unexpectedly generous remote internship offer. Trace the evidence, assess the requests and recover two details from earlier messages.</p>
              <p>8 strategic choices · 2 evidence-recall puzzles · 100 possible points</p>
              <button type="button" className="internship-primary" onClick={start}>Begin investigation <ArrowRight size={18} aria-hidden="true" /></button>
            </section>
          ) : completed ? (
            <section className="internship-card internship-result">
              <p className="internship-eyebrow">CASE COMPLETED</p>
              <h2>Recruitment case closed</h2>
              <strong className="internship-score">{recruitmentScore(state)}<small> / 100</small></strong>
              <p>{state.answers.length} locked interactions completed, including two evidence-recall puzzles.</p>
              <div className="internship-summary" aria-label="Locked decision summary">
                {state.answers.map((answer, index) => (
                  <div key={answer.stepId}><span>{index + 1}. {RECRUITMENT_STEPS[index].title}</span><strong>+{answer.points}</strong></div>
                ))}
              </div>
              <button type="button" className="internship-secondary" onClick={event => open('restart', event.currentTarget)}><RefreshCcw size={18} aria-hidden="true"/> Replay mission</button>
              <button type="button" className="internship-primary" onClick={onExit}>Return to homepage</button>
            </section>
          ) : step ? (
            <>
              <div className="internship-progress"><span>CASE STEP {state.stepIndex + 1} OF {total}</span><span>{recruitmentScore(state)} PTS</span></div>
              <div role="progressbar" className="internship-progress-track" aria-label="Completed investigation steps" aria-valuemin={0} aria-valuemax={total} aria-valuenow={state.stepIndex}><span style={{ width: `${state.stepIndex / total * 100}%` }}/></div>
              {previousStep?.kind === 'choice' && previousAnswer && (
                <p className="internship-feedback"><CheckCircle2 size={16} aria-hidden="true" /> Previous response locked · +{previousAnswer.points} points</p>
              )}
              <section className="internship-message" aria-label="Simulated recruitment message">
                <div className="internship-sender"><span>TB</span><div><strong>TalentBridge Recruiting</strong><small>careers@talentbridge-onboarding.example</small></div><time>Just now</time></div>
                <p>{step.message}</p>
              </section>
              <section className="internship-card">
                <p className="internship-eyebrow">{step.kind === 'puzzle' ? 'EVIDENCE RECALL' : 'STRATEGIC DECISION'} · {state.stepIndex + 1}/{total}</p>
                <h2>{step.title}</h2>
                <p>{step.question}</p>
                {step.kind === 'choice' ? (
                  <div className="internship-options">
                    {displayedRecruitmentChoices(step, state.seed).map((option, i) => (
                      <button type="button" key={option.id} className="internship-option" onClick={event => select(option.id, event.currentTarget)}>
                        <span>{String.fromCharCode(65 + i)}</span>{option.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <form className="internship-puzzle" onSubmit={submitPuzzle}>
                    <label htmlFor="recruitment-answer">Answer from earlier evidence</label>
                    <input id="recruitment-answer" maxLength={24} autoComplete="off" spellCheck={false} value={typed} onChange={event => {setTyped(event.target.value);setPuzzleError('');}} placeholder={step.placeholder} required />
                    {puzzleError && <p role="alert" className="internship-error">{puzzleError}</p>}
                    <button type="submit" className="internship-primary">Check evidence <ArrowRight size={17} aria-hidden="true" /></button>
                  </form>
                )}
              </section>
            </>
          ) : null}
        </div>
        <nav aria-label="Investigation tools" className="internship-tools">
          <button type="button" aria-label="Evidence archive" title="Evidence" onClick={event => open('evidence', event.currentTarget)}><FileSearch size={22} aria-hidden="true" /></button>
          <button type="button" aria-label="Investigator hint" title="Hint" disabled={!step} onClick={event => open('hint', event.currentTarget)}><Lightbulb size={22} aria-hidden="true" /></button>
          <button type="button" aria-label="Case log" title="Case Log" onClick={event => open('history', event.currentTarget)}><History size={22} aria-hidden="true" /></button>
        </nav>
        <nav aria-label="Phone navigation" className="internship-nav">
          <button type="button" aria-label="Phone Back: review the previous locked question" title="Back" onClick={event => goBack(event.currentTarget)}><ArrowLeft size={22} aria-hidden="true" /></button>
          <button type="button" aria-label="Phone Home: return to homepage" title="Home" onClick={onExit}><Home size={21} aria-hidden="true" /></button>
          <button type="button" aria-label="Phone Recent: open locked question history" title="Recent" onClick={event => open('history', event.currentTarget)}><History size={21} aria-hidden="true" /></button>
        </nav>
      </main>
      {tool && (
        <PhonePanel title={tool === 'evidence' ? 'Evidence Archive' : tool === 'hint' ? 'Investigator Hint' : tool === 'confirm' ? 'Lock in decision?' : tool === 'restart' ? 'Restart Mission?' : 'Case Log'} onClose={closeTool} returnFocusTo={focusReturn.current}>
          {tool === 'evidence' && <div className="internship-dialog-content">
            <p>Case evidence available so far. Earlier details remain available for the puzzles.</p>
            {RECRUITMENT_CLUES.filter(clue => state && clue.unlockedAt <= state.stepIndex).map(clue => (
              <div className="internship-note" key={clue.id}><strong>{clue.title}</strong><p>{clue.detail}</p></div>
            ))}
            {!state && <p>Start the investigation to collect evidence.</p>}
          </div>}
          {tool === 'hint' && <div className="internship-dialog-content"><p>{step?.hint ?? 'Review the previous decision and the evidence archive.'}</p><small>Hints do not change scoring.</small></div>}
          {tool === 'history' && <div className="internship-dialog-content">
            {review && reviewAnswer ? (
              <>
                <p className="internship-eyebrow">LOCKED QUESTION {reviewIndex! + 1} / {state!.answers.length}</p>
                <h3>{review.title}</h3><p>{review.question}</p>
                <div className="internship-note"><strong>Recorded answer</strong><p>{reviewLabel}</p><small>+{reviewAnswer.points} points · read-only</small></div>
                <div className="internship-history-buttons">
                  <button type="button" className="internship-secondary" disabled={reviewIndex === 0} onClick={() => setReviewIndex(i => i === null ? null : Math.max(0, i - 1))}>Older</button>
                  <button type="button" className="internship-secondary" disabled={reviewIndex === state!.answers.length - 1} onClick={() => setReviewIndex(i => i === null ? null : Math.min(state!.answers.length - 1, i + 1))}>Newer</button>
                </div>
                <button type="button" className="internship-primary" onClick={closeTool}>Return to current question</button>
              </>
            ) : (
              <>
                <p>Previously recorded answers cannot be changed.</p>
                {state?.answers.length ? state.answers.map((answer, index) => <button key={answer.stepId} type="button" className="internship-history-row" onClick={() => setReviewIndex(index)}>{index + 1}. {RECRUITMENT_STEPS[index].title} <span>+{answer.points}</span></button>) : <p>No locked decisions yet.</p>}
                {state && <button type="button" className="internship-secondary" onClick={event => open('restart', event.currentTarget)}>Restart mission</button>}
              </>
            )}
          </div>}
          {tool === 'confirm' && <div className="internship-dialog-content"><p>Once confirmed, this response is final for this attempt.</p><div className="internship-note"><strong>{selected?.label}</strong></div><button type="button" className="internship-primary" onClick={lock}><LockKeyhole size={17} aria-hidden="true"/> Confirm and lock</button><button type="button" className="internship-secondary" onClick={closeTool}>Review choices again</button></div>}
          {tool === 'restart' && <div className="internship-dialog-content"><p>This will clear all recorded internship responses, puzzles and score. Your parcel mission will not be affected.</p><button type="button" className="internship-danger" onClick={start}>Confirm restart</button><button type="button" className="internship-secondary" onClick={closeTool}>Keep progress</button></div>}
        </PhonePanel>
      )}
    </div>
  );
}
