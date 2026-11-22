import { useCallback, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { AlertTriangle, CheckCircle2, ChevronLeft, Clock3, FileSearch, History, Home, Lightbulb, LockKeyhole, Shield } from 'lucide-react';
import { GameHeader } from '../../components/game/GameHeader';
import { PhoneStage } from '../../components/game/PhoneStage';
import { EvidenceDialog } from '../../components/game/EvidenceDialog';
import { PhonePanel } from '../../components/game/PhonePanel';
import { Button } from '../../components/ui/Button';
import { advance, choose, getCurrentScene, inspectClue } from './engine/missionEngine';
import { PARCEL_MISSION } from './data/parcelMission';
import type { Clue, GameSessionState, Scene } from '../../types/mission';
import './investigation.css';

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
const messageUrl = 'https://speedpost-parcel-status.example/verify';

const hints: Record<string, string> = {
  'incoming-alert': 'Before deciding, what details can you verify without trusting the message itself?',
  'decision-sender': 'A recognizable name is not the same as verified identity. What could you check?',
  'decision-domain': 'Think about how you would reach the courier if the message had never arrived.',
  'decision-details': 'The request has moved from delivery information to sensitive details. Is the source independently verified?',
};

export function InvestigationPage({ session, onUpdate, onStart, onReplay, onExit, onHome }: InvestigationPageProps) {
  const record = session.missionRecords.parcel;
  const scene: Scene | null = record.currentSceneId ? getCurrentScene(session, MISSION) : null;
  const [activeTool, setActiveTool] = useState<PhoneTool>(null);
  const [openClueId, setOpenClueId] = useState<string | null>(null);
  const [pendingChoiceId, setPendingChoiceId] = useState<string | null>(null);
  const focusReturnRef = useRef<HTMLButtonElement | null>(null);
  const closePanel = useCallback(() => { setActiveTool(null); setPendingChoiceId(null); }, []);
  const closeEvidence = useCallback(() => setOpenClueId(null), []);
  const answered = Object.keys(record.decisions).length;
  const activeClue: Clue | null = openClueId ? MISSION.clues[openClueId] : null;
  const pendingChoice = scene?.choices?.find(choice => choice.id === pendingChoiceId);
  const availableEvidence = scene?.clueIds ?? [];

  const openTool = (tool: Exclude<PhoneTool, null>, trigger: HTMLButtonElement) => {
    focusReturnRef.current = trigger;
    setActiveTool(tool);
  };

  const inspect = (clueId: string) => {
    if (!scene || !scene.clueIds?.includes(clueId) || record.status !== 'in_progress') return;
    onUpdate(current => current.missionRecords.parcel.currentSceneId === scene.id
      ? inspectClue(current, MISSION, clueId) : current);
    setActiveTool(null);
    setOpenClueId(clueId);
  };

  const continueScene = () => {
    if (!scene?.nextSceneId) return;
    onUpdate(current => current.missionRecords.parcel.currentSceneId === scene.id
      ? advance(current, MISSION) : current);
  };

  const requestChoice = (choiceId: string, trigger: HTMLButtonElement) => {
    if (scene?.kind !== 'decision' || record.status !== 'in_progress') return;
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
    // Keep a mounted dock button as the focus return target when switching dialogs.
    if (activeTool !== 'case-log') focusReturnRef.current = trigger;
    setActiveTool('restart');
  };
  const confirmRestart = () => {
    closePanel();
    setOpenClueId(null);
    onReplay();
  };

  return (
    <div className="investigation-root view-transition">
      <GameHeader title="SpeedPost Courier" subtitle="The Missing Package · Fictional case"
        progressText={`${answered} / 3 DECISIONS`} showPreviewBadge={false} onBack={onExit} />
      <main id="main-content" className="investigation-main">
        <PhoneStage className="phone-stage--interactive">
          <div className="phone-notch" aria-hidden="true" />
          <div className="investigation-content">
            <p className="investigation-disclaimer"><Shield size={15} aria-hidden="true" /> Fictional educational simulation. Never enter real personal or payment details.</p>
            <div className="investigation-progress" role="progressbar" aria-label="Completed decisions"
              aria-valuemin={0} aria-valuemax={3} aria-valuenow={answered}>
              {[0, 1, 2].map(position => <span key={position} className={position < answered ? 'is-done' : ''} />)}
            </div>

            {!scene ? (
              <section className="investigation-panel">
                <span className="investigation-kicker">CASE 01 / READY</span>
                <h2 className="text-heading">The Missing Package</h2>
                <p className="text-body">An urgent delivery message just arrived. Examine the fictional evidence and decide what to do.</p>
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
                    <p>URGENT: Package #IN-88942 cannot be delivered. Confirm your address within 2 hours to avoid return to depot.</p>
                    <code className="investigation-inert-link" title="Fictional non-clickable URL">{messageUrl}</code>
                  </section>
                )}

                <section className="investigation-panel" aria-label="Current investigation step">
                  <span className="investigation-kicker">{scene.kind === 'decision' ? `DECISION ${answered + 1} / 3` : scene.kind === 'message' ? 'INCOMING ALERT' : scene.kind === 'consequence' ? 'YOUR DECISION · LOCKED' : scene.kind === 'reveal' ? 'EVIDENCE SUMMARY' : 'MISSION COMPLETE'}</span>
                  <h2 className="text-heading">{scene.title ?? (scene.kind === 'consequence' ? 'What happened next?' : 'Case update')}</h2>
                  <p className="text-body">{scene.body}</p>
                  {scene.kind === 'consequence' && scene.outcome && (
                    <span className={`investigation-outcome investigation-outcome--${scene.outcome}`}>
                      {scene.outcome === 'safe' ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
                      {scene.outcome === 'safe' ? 'Safer response' : scene.outcome === 'caution' ? 'Partly cautious response' : 'Risky response'}
                    </span>
                  )}
                  {scene.kind === 'debrief' && (
                    <div className="investigation-result">
                      <strong>{record.score}<small> / 100</small></strong>
                      <span>Mission score · {record.inspectedClueIds.length} of 3 unique clues inspected</span>
                    </div>
                  )}
                </section>

                <section className="investigation-actions" aria-label="Investigation actions">
                  {scene.kind === 'decision' ? (
                    <>
                      <h2>Choose your response</h2>
                      <p className="investigation-locked-note"><LockKeyhole size={14} aria-hidden="true" /> A confirmed decision is final for this attempt.</p>
                      {scene.choices?.map((choice, index) => (
                        <button type="button" key={choice.id} className="investigation-choice"
                          onClick={event => requestChoice(choice.id, event.currentTarget)}>
                          <span className="investigation-choice-index" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                          <span>{choice.label}</span>
                        </button>
                      ))}
                    </>
                  ) : scene.kind === 'debrief' ? (
                    <>
                      <Button fullWidth onClick={event => requestRestart(event.currentTarget)}>Replay Mission</Button>
                      <Button fullWidth variant="secondary" onClick={onExit}>Return to Briefing</Button>
                    </>
                  ) : (
                    <Button fullWidth onClick={continueScene}>
                      {scene.kind === 'message' ? 'Continue to first decision' : scene.kind === 'reveal' ? 'View mission result' : 'Continue investigation'}
                    </Button>
                  )}
                </section>
              </>
            )}
          </div>

          <nav className="phone-tool-dock" aria-label="Phone investigation tools">
            <button type="button" disabled={!scene || availableEvidence.length === 0 || record.status !== 'in_progress'}
              onClick={event => openTool('evidence', event.currentTarget)}>
              <FileSearch size={21} aria-hidden="true"/><span>Evidence</span>
            </button>
            <button type="button" disabled={!scene || record.status !== 'in_progress'}
              onClick={event => openTool('hint', event.currentTarget)}>
              <Lightbulb size={21} aria-hidden="true"/><span>Hint</span>
            </button>
            <button type="button" onClick={event => openTool('case-log', event.currentTarget)}>
              <History size={21} aria-hidden="true"/><span>Case Log</span>
            </button>
          </nav>
          <nav className="phone-system-nav" aria-label="Simulated phone navigation">
            <button type="button" onClick={onExit} aria-label="Phone Back: return to briefing without undoing decisions">
              <ChevronLeft size={21} aria-hidden="true"/><span>Back</span>
            </button>
            <button type="button" onClick={onHome} aria-label="Phone Home: return to ScamSignal home">
              <Home size={20} aria-hidden="true"/><span>Home</span>
            </button>
            <button type="button" onClick={event => openTool('case-log', event.currentTarget)} aria-label="Phone Recent: show locked case history">
              <Clock3 size={21} aria-hidden="true"/><span>Recent</span>
            </button>
          </nav>
        </PhoneStage>
      </main>

      {activeClue && (
        <EvidenceDialog clue={activeClue} onClose={closeEvidence} returnFocusTo={focusReturnRef.current} />
      )}
      {activeTool && (
        <PhonePanel
          title={activeTool === 'evidence' ? 'Evidence Locker' : activeTool === 'hint' ? 'Investigator Hint' : activeTool === 'case-log' ? 'Case Log' : activeTool === 'confirm' ? 'Confirm decision' : 'Restart mission?'}
          onClose={closePanel}
          returnFocusTo={focusReturnRef.current}
        >
          {activeTool === 'evidence' && (
            <div className="phone-tool-list">
              <p>Inspect the available evidence. This will not affect your score.</p>
              {availableEvidence.map(id => (
                <button type="button" key={id} className="phone-tool-row" onClick={() => inspect(id)}>
                  <FileSearch size={17} aria-hidden="true" />
                  <span>{MISSION.clues[id].sourceLabel}</span>
                  <span className="phone-tool-trailing">{record.inspectedClueIds.includes(id) ? 'Reviewed' : 'Inspect'}</span>
                </button>
              ))}
            </div>
          )}
          {activeTool === 'hint' && (
            <div className="phone-tool-list">
              <p>{scene ? hints[scene.id] ?? 'Think about what you know for certain and what is only being claimed.' : 'Start the mission to receive a hint.'}</p>
              <p className="phone-tool-subtle">Hints are optional and do not change your score.</p>
            </div>
          )}
          {activeTool === 'case-log' && (
            <div className="phone-tool-list">
              <p>Read-only history. Locked decisions cannot be edited.</p>
              {answered === 0 && <p className="phone-tool-subtle">No decisions recorded yet.</p>}
              {(['checkpoint-1','checkpoint-2','checkpoint-3'] as const).map((checkpoint, index) => {
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
              <p className="phone-tool-subtle">Once confirmed, your decision cannot be changed without restarting the entire mission.</p>
              <button type="button" className="phone-tool-accept" onClick={confirmChoice}>Confirm and lock decision</button>
              <button type="button" className="phone-tool-secondary" onClick={closePanel}>Review options again</button>
            </div>
          )}
          {activeTool === 'restart' && (
            <div className="phone-tool-list">
              <p>Restart The Missing Package from the beginning?</p>
              <p className="phone-tool-subtle">This will erase all decisions, score, and inspected evidence for this mission. This cannot be undone.</p>
              <button type="button" className="phone-tool-danger" onClick={confirmRestart}>Confirm restart mission</button>
              <button type="button" className="phone-tool-secondary" onClick={closePanel}>Keep current progress</button>
            </div>
          )}
        </PhonePanel>
      )}
    </div>
  );
}
