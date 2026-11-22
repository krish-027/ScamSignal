import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {
  AlertTriangle, CheckCircle2, ChevronLeft, Clock3, FileSearch,
  History, Home, Lightbulb, LockKeyhole,
} from 'lucide-react';
import { PhoneStage } from '../../components/game/PhoneStage';
import { PhonePanel } from '../../components/game/PhonePanel';
import { LockedQuestionHistory } from './LockedQuestionHistory';
import { Button } from '../../components/ui/Button';
import { MissionReview } from './MissionReview';
import { displayChoices } from './choiceOrder';
import { DecisionImpact, SignalReveal } from './CinematicReveal';
import './cinematic.css';
import { advance, choose, getCurrentScene, inspectClue } from './engine/missionEngine';
import { PARCEL_MISSION } from './data/parcelMission';
import type { CheckpointId, Clue, GameSessionState, Scene } from '../../types/mission';
import './investigation.css';
import './toolDock.css';
import './phoneNav3A.css';

interface InvestigationPageProps {
  session: GameSessionState;
  onUpdate: Dispatch<SetStateAction<GameSessionState>>;
  onStart: () => void;
  onReplay: () => void;
  onExit: () => void;
  onHome: () => void;
}

type PhoneTool = 'evidence' | 'hint' | 'case-log' | 'confirm' | 'restart' | null;
const MISSION = PARCEL_MISSION;
const CHECKPOINTS: readonly CheckpointId[] = [
  'checkpoint-1', 'checkpoint-2', 'checkpoint-3', 'checkpoint-4', 'checkpoint-5',
];
const MESSAGE_LINK = 'https://speedpost-parcel-status.example/verify';

const hints: Record<string, string> = {
  'incoming-alert': 'Which parts of this message are claims, and which can you verify without relying on it?',
  'decision-sender': 'A recognizable display name is not the same as a verified sender. How could you check?',
  'decision-domain': 'Imagine you never received this SMS. How would you find the courier?',
  'decision-details': 'A real package does not establish that the provided form is trustworthy.',
  'support-message': 'Who provided this support contact and ticket number?',
  'decision-support': 'Would a source controlled by the sender count as independent proof?',
  'resolution-message': 'You do not need to reply to every request. What can you do with the evidence?',
  'decision-resolution': 'Think about an action that protects your information and may protect others.',
};

const simulatedMessages: Record<string, string> = {
  'incoming-alert': 'URGENT: Package #IN-88942 cannot be delivered. Confirm your address within 2 hours to avoid return to depot.',
  'decision-sender': 'URGENT: Package #IN-88942 cannot be delivered. Confirm your address within 2 hours to avoid return to depot.',
  'decision-domain': 'Tracking update: verify your delivery status using the link supplied in this message.',
  'decision-details': 'To complete redelivery, confirm your address and review a small handling charge.',
  'support-message': 'Support update: ticket #DL-224 has been assigned. Chat with our agent using this conversation.',
  'decision-support': 'Support update: ticket #DL-224 has been assigned. Chat with our agent using this conversation.',
  'resolution-message': 'Final reminder: Your case may close soon. Reopen the ticket through the latest link.',
  'decision-resolution': 'Final reminder: Your case may close soon. Reopen the ticket through the latest link.',
};

export function InvestigationPage({ session, onUpdate, onStart, onReplay, onExit, onHome }: InvestigationPageProps) {
  const record = session.missionRecords.parcel;
  const scene: Scene | null = record.currentSceneId ? getCurrentScene(session, MISSION) : null;
  const [activeTool, setActiveTool] = useState<PhoneTool>(null);
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [pendingChoiceId, setPendingChoiceId] = useState<string | null>(null);
  const [showQuestionHistory, setShowQuestionHistory] = useState(false);
  const focusReturnRef = useRef<HTMLButtonElement | null>(null);
  const evidenceRowRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastEvidenceIdRef = useRef<string | null>(null);
  const answered = Object.keys(record.decisions).length;
  const selectedClue: Clue | null = selectedClueId ? MISSION.clues[selectedClueId] : null;
  const pendingChoice = scene?.choices?.find(choice => choice.id === pendingChoiceId);
  const currentEvidence = scene?.clueIds ?? [];
  const availableEvidence = Array.from(new Set([...record.inspectedClueIds, ...currentEvidence]));
  const isPlayable = record.status === 'in_progress';

  const closePanel = useCallback(() => {
    setActiveTool(null);
    setSelectedClueId(null);
    setPendingChoiceId(null);
  }, []);

  const closeOrBack = () => {
    if (activeTool === 'evidence' && selectedClueId) {
      setSelectedClueId(null);
      return;
    }
    closePanel();
  };

  useEffect(() => {
    if (activeTool === 'evidence' && selectedClueId === null && lastEvidenceIdRef.current) {
      evidenceRowRefs.current[lastEvidenceIdRef.current]?.focus();
      lastEvidenceIdRef.current = null;
    }
  }, [activeTool, selectedClueId]);

  const openTool = (tool: Exclude<PhoneTool, null>, trigger: HTMLButtonElement) => {
    focusReturnRef.current = trigger;
    setSelectedClueId(null);
    setActiveTool(tool);
  };

  const inspect = (clueId: string) => {
    if (!scene || !availableEvidence.includes(clueId)) return;
    if (!record.inspectedClueIds.includes(clueId) && isPlayable && currentEvidence.includes(clueId)) {
      onUpdate(current => current.missionRecords.parcel.currentSceneId === scene.id
        ? inspectClue(current, MISSION, clueId) : current);
    }
    lastEvidenceIdRef.current = clueId;
    setSelectedClueId(clueId);
  };

  const continueScene = () => {
    if (!scene?.nextSceneId || !isPlayable) return;
    onUpdate(current => current.missionRecords.parcel.currentSceneId === scene.id
      ? advance(current, MISSION) : current);
  };

  const requestChoice = (choiceId: string, trigger: HTMLButtonElement) => {
    if (scene?.kind !== 'decision' || !isPlayable) return;
    if (!scene.choices?.some(choice => choice.id === choiceId)) return;
    setPendingChoiceId(choiceId);
    openTool('confirm', trigger);
  };

  const confirmChoice = () => {
    if (!pendingChoiceId || scene?.kind !== 'decision') return;
    const chosen = pendingChoiceId;
    onUpdate(current => current.missionRecords.parcel.currentSceneId === scene.id
      ? choose(current, MISSION, chosen) : current);
    closePanel();
  };

  const requestRestart = (trigger: HTMLButtonElement) => {
    if (activeTool !== 'case-log') focusReturnRef.current = trigger;
    setActiveTool('restart');
  };

  const confirmRestart = () => {
    closePanel();
    lastEvidenceIdRef.current = null;
    onReplay();
  };

  return (
    <div className="investigation-root view-transition">
      <main id="main-content" className="investigation-main">
        <PhoneStage className="phone-stage--interactive">
          <div className="phone-appbar">
            <div className="phone-app-title">
              <h1 tabIndex={-1}>SpeedPost Courier</h1>
              <span>The Missing Package · Fictional case</span>
            </div>
            <span className="phone-decision-count">{answered} / {CHECKPOINTS.length} DECISIONS</span>
          </div>

          <div className="investigation-scroll" aria-label="Mission content">
            <div className="investigation-content">
              <div className="investigation-progress" role="progressbar" aria-label="Completed decisions"
                aria-valuemin={0} aria-valuemax={CHECKPOINTS.length} aria-valuenow={answered}>
                {CHECKPOINTS.map((checkpoint, position) => (
                  <span key={checkpoint} className={position < answered ? 'is-done' : ''} />
                ))}
              </div>

              {!scene ? (
                <section className="investigation-panel">
                  <span className="investigation-kicker">CASE 01 / READY</span>
                  <h2 className="text-heading">The Missing Package</h2>
                  <p className="text-body">Examine the fictional evidence and decide what to do.</p>
                  <Button fullWidth onClick={onStart}>Start Investigation</Button>
                </section>
              ) : (
                <>
                  {(scene.kind === 'message' || scene.kind === 'decision') && (
                    <section className="investigation-sms" aria-label="Fictional SMS conversation">
                      <div className="investigation-sender">
                        <span className="investigation-avatar" aria-hidden="true">SP</span>
                        <div className="investigation-sender-info">
                          <strong>SpeedPost Courier</strong>
                          <span>From: alert@speedpost-verify.example</span>
                        </div>
                        <span className="investigation-time">09:38</span>
                      </div>
                      <p>{simulatedMessages[scene.id] ?? simulatedMessages['incoming-alert']}</p>
                      {(scene.id === 'incoming-alert' || scene.id === 'decision-sender' || scene.id === 'decision-domain') && (
                        <code className="investigation-inert-link" title="Fictional non-clickable URL">{MESSAGE_LINK}</code>
                      )}
                    </section>
                  )}

                  <section className="investigation-panel" aria-label="Current investigation step">
                    <span className="investigation-kicker">
                      {scene.kind === 'decision' ? `DECISION ${answered + 1} / ${CHECKPOINTS.length}` :
                        scene.kind === 'message' ? 'INCOMING UPDATE' :
                          scene.kind === 'consequence' ? 'YOUR DECISION · LOCKED' :
                            scene.kind === 'reveal' ? 'EVIDENCE SUMMARY' : 'MISSION COMPLETE'}
                    </span>
                    <h2 className="text-heading">{scene.title ?? (scene.kind === 'consequence' ? 'What happened next?' : 'Case update')}</h2>
                    <p className="text-body">{scene.body}</p>
                    {scene.kind === 'consequence' && scene.outcome && (
                      <DecisionImpact outcome={scene.outcome} />
                    )}
                    {scene.kind === 'reveal' && (
                      <SignalReveal inspectedClueIds={record.inspectedClueIds} />
                    )}
                    {scene.kind === 'consequence' && scene.outcome && (
                      <span className={`investigation-outcome investigation-outcome--${scene.outcome}`}>
                        {scene.outcome === 'safe' ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
                        {scene.outcome === 'safe' ? 'Safer response' : scene.outcome === 'caution' ? 'Partly cautious response' : 'Risky response'}
                      </span>
                    )}
                    {scene.kind === 'debrief' && (
                      <div className="investigation-result">
                        <strong>{record.score}<small> / 100</small></strong>
                        <span>Mission score · {record.inspectedClueIds.length} of {Object.keys(MISSION.clues).length} unique clues inspected</span>
                      </div>
                    )}
                  </section>

                  <section className="investigation-actions" aria-label="Investigation actions">
                    {scene.kind === 'decision' ? (
                      <>
                        <h2>Choose your response</h2>
                        <p className="investigation-locked-note"><LockKeyhole size={14} aria-hidden="true" /> A confirmed decision is final for this attempt.</p>
                        {displayChoices(scene, record.startedAt).map((choice, index) => (
                          <button type="button" key={choice.id} className="investigation-choice"
                            onClick={event => requestChoice(choice.id, event.currentTarget)}>
                            <span className="investigation-choice-index" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                            <span>{choice.label}</span>
                          </button>
                        ))}
                      </>
                    ) : scene.kind === 'debrief' ? (
                      <>
                        <MissionReview record={record} definition={MISSION} />
                      <Button fullWidth onClick={event => requestRestart(event.currentTarget)}>Replay Mission</Button>
                        <Button fullWidth variant="secondary" onClick={onExit}>Return to Briefing</Button>
                      </>
                    ) : (
                      <Button fullWidth onClick={continueScene}>
                        {scene.kind === 'message' && answered === 0 ? 'Continue to first decision' :
                          scene.kind === 'reveal' ? 'View mission result' : 'Continue investigation'}
                      </Button>
                    )}
                  </section>
                </>
              )}
            </div>
          </div>

          <nav className="phone-tool-dock" aria-label="Phone investigation tools">
            <button type="button" disabled={!scene || availableEvidence.length === 0}
              onClick={event => openTool('evidence', event.currentTarget)}>
              <span className="phone-tool-icon" aria-hidden="true"><FileSearch size={21} /></span><span className="phone-tool-label">Evidence</span>
            </button>
            <button type="button" disabled={!scene || !isPlayable}
              onClick={event => openTool('hint', event.currentTarget)}>
              <span className="phone-tool-icon" aria-hidden="true"><Lightbulb size={21} /></span><span className="phone-tool-label">Hint</span>
            </button>
            <button type="button" onClick={event => openTool('case-log', event.currentTarget)}>
              <span className="phone-tool-icon" aria-hidden="true"><History size={21} /></span><span className="phone-tool-label">Case Log</span>
            </button>
          </nav>
          <nav className="phone-system-nav" aria-label="Simulated phone navigation">
            <button type="button" onClick={event => { if (answered > 0) { focusReturnRef.current = event.currentTarget; setShowQuestionHistory(true); } else onExit(); }} aria-label="Phone Back: review previous locked question or return to briefing">
              <ChevronLeft size={21} aria-hidden="true" /><span>Back</span>
            </button>
            <button type="button" onClick={onHome} aria-label="Phone Home: return to ScamSignal home">
              <Home size={20} aria-hidden="true" /><span>Home</span>
            </button>
            <button type="button" onClick={event => openTool('case-log', event.currentTarget)} aria-label="Phone Recent: show locked case history">
              <Clock3 size={21} aria-hidden="true" /><span>Recent</span>
            </button>
          </nav>
        </PhoneStage>
      </main>

      {showQuestionHistory && <LockedQuestionHistory record={record} definition={MISSION} onClose={() => setShowQuestionHistory(false)} returnFocusTo={focusReturnRef.current} />}
      {activeTool && (
        <PhonePanel
          title={activeTool === 'evidence' ? selectedClue ? `Evidence: ${selectedClue.sourceLabel}` : 'Evidence Locker'
            : activeTool === 'hint' ? 'Investigator Hint' : activeTool === 'case-log' ? 'Case Log'
              : activeTool === 'confirm' ? 'Confirm decision' : 'Restart mission?'}
          onClose={closeOrBack}
          returnFocusTo={focusReturnRef.current}
        >
          {activeTool === 'evidence' && (selectedClue ? (
            <div className="phone-tool-list">
              <span className="investigation-kicker">EVIDENCE REVIEWED</span>
              <p>{selectedClue.explanation}</p>
              <p className="phone-tool-subtle">Evidence inspection never changes your score.</p>
              <button type="button" className="phone-tool-secondary" onClick={() => setSelectedClueId(null)}>
                <ChevronLeft size={16} aria-hidden="true" /> Back to Evidence
              </button>
            </div>
          ) : (
            <div className="phone-tool-list">
              <p>Inspect the available evidence. Return here to review additional clues.</p>
              {availableEvidence.map(id => (
                <button type="button" key={id} className="phone-tool-row" ref={element => { evidenceRowRefs.current[id] = element; }}
                  onClick={() => inspect(id)}>
                  <FileSearch size={17} aria-hidden="true" />
                  <span>{MISSION.clues[id].sourceLabel}</span>
                  <span className="phone-tool-trailing">{record.inspectedClueIds.includes(id) ? 'Reviewed' : 'Inspect'}</span>
                </button>
              ))}
            </div>
          ))}
          {activeTool === 'hint' && (
            <div className="phone-tool-list">
              <p>{scene ? hints[scene.id] ?? 'Think about what you can independently verify, rather than what the message claims.' : 'Start the mission to receive a hint.'}</p>
              <p className="phone-tool-subtle">Hints are optional and do not change your score.</p>
            </div>
          )}
          {activeTool === 'case-log' && (
            <div className="phone-tool-list">
              <p>Read-only history. Confirmed decisions cannot be edited.</p>
              {answered === 0 && <p className="phone-tool-subtle">No decisions recorded yet.</p>}
              {CHECKPOINTS.map((checkpoint, index) => {
                const decision = record.decisions[checkpoint];
                if (!decision) return null;
                const choice = Object.values(MISSION.scenes).flatMap(item => item.choices ?? [])
                  .find(item => item.id === decision.choiceId);
                return <div key={checkpoint} className="phone-case-entry">
                  <span className="investigation-kicker">DECISION {index + 1} · LOCKED</span>
                  <strong>{choice?.label ?? 'Recorded decision'}</strong>
                </div>;
              })}
              <p className="phone-tool-subtle">Evidence reviewed: {record.inspectedClueIds.length} of {Object.keys(MISSION.clues).length}</p>
              {record.status !== 'not_started' && (
                <button type="button" className="phone-tool-danger" onClick={event => requestRestart(event.currentTarget)}>
                  Restart Mission
                </button>
              )}
            </div>
          )}
          {activeTool === 'confirm' && (
            <div className="phone-tool-list">
              <p>Lock in this response?</p>
              <div className="phone-case-entry"><strong>{pendingChoice?.label}</strong></div>
              <p className="phone-tool-subtle">Once confirmed, your choice cannot be changed without restarting the entire mission.</p>
              <button type="button" className="phone-tool-accept" onClick={confirmChoice}>Confirm and lock decision</button>
              <button type="button" className="phone-tool-secondary" onClick={closePanel}>Review options again</button>
            </div>
          )}
          {activeTool === 'restart' && (
            <div className="phone-tool-list">
              <p>Restart The Missing Package from the beginning?</p>
              <p className="phone-tool-subtle">This clears the five decisions, score, and inspected evidence for this mission.</p>
              <button type="button" className="phone-tool-danger" onClick={confirmRestart}>Confirm restart mission</button>
              <button type="button" className="phone-tool-secondary" onClick={closePanel}>Keep current progress</button>
            </div>
          )}
        </PhonePanel>
      )}
    </div>
  );
}
