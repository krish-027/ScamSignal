import { useCallback, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { AlertTriangle, CheckCircle2, Fingerprint, Link2, Search, Shield, Timer } from 'lucide-react';
import { GameHeader } from '../../components/game/GameHeader';
import { PhoneStage } from '../../components/game/PhoneStage';
import { EvidenceDialog } from '../../components/game/EvidenceDialog';
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
}

const evidenceIcons = {
  sender: Fingerprint,
  url: Link2,
  urgency: Timer,
  payment: AlertTriangle,
  claim: Search,
} as const;

const MISSION = PARCEL_MISSION;
const messageUrl = 'https://speedpost-parcel-status.example/verify';

/** Batch 2B: playable choices and inspection; cinematic reveal polish comes in 2C. */
export function InvestigationPage({ session, onUpdate, onStart, onReplay, onExit }: InvestigationPageProps) {
  const record = session.missionRecords.parcel;
  const scene: Scene | null = record.currentSceneId ? getCurrentScene(session, MISSION) : null;
  const [openClueId, setOpenClueId] = useState<string | null>(null);
  const focusReturnRef = useRef<HTMLButtonElement | null>(null);
  const closeEvidence = useCallback(() => setOpenClueId(null), []);
  const answered = Object.keys(record.decisions).length;
  const activeClue: Clue | null = openClueId ? MISSION.clues[openClueId] : null;

  const inspect = (clueId: string, trigger: HTMLButtonElement) => {
    if (!scene || !scene.clueIds?.includes(clueId) || record.status !== 'in_progress') return;
    onUpdate(current => {
      if (current.missionRecords.parcel.currentSceneId !== scene.id) return current;
      return inspectClue(current, MISSION, clueId);
    });
    focusReturnRef.current = trigger;
    setOpenClueId(clueId);
  };

  const continueScene = () => {
    if (!scene || !scene.nextSceneId) return;
    onUpdate(current => {
      if (current.missionRecords.parcel.currentSceneId !== scene.id) return current;
      return advance(current, MISSION);
    });
  };

  const makeChoice = (choiceId: string) => {
    if (!scene || scene.kind !== 'decision') return;
    onUpdate(current => {
      if (current.missionRecords.parcel.currentSceneId !== scene.id) return current;
      return choose(current, MISSION, choiceId);
    });
  };

  return (
    <div className="investigation-root view-transition">
      <GameHeader
        title="SpeedPost Courier"
        subtitle="The Missing Package · Fictional case"
        progressText={`${answered} / 3 DECISIONS`}
        showPreviewBadge={false}
        onBack={onExit}
      />
      <main id="main-content" className="investigation-main">
        <PhoneStage>
          <div className="investigation-content">
            <p className="investigation-disclaimer"><Shield size={15} aria-hidden="true" /> Fictional educational simulation. Never enter real personal or payment details.</p>
            <div className="investigation-progress" aria-label={`${answered} of 3 decisions completed`} role="progressbar" aria-valuemin={0} aria-valuemax={3} aria-valuenow={answered}>
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
                  <span className="investigation-kicker">{scene.kind === 'decision' ? `DECISION ${answered + 1} / 3` : scene.kind === 'message' ? 'INCOMING ALERT' : scene.kind === 'consequence' ? 'YOUR DECISION' : scene.kind === 'reveal' ? 'EVIDENCE SUMMARY' : 'MISSION COMPLETE'}</span>
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

                {!!scene.clueIds?.length && record.status === 'in_progress' && (
                  <section className="investigation-evidence" aria-label="Inspectable evidence">
                    <h2>Investigate the evidence</h2>
                    <p>Inspect any available indicator before making your decision. Evidence checks are free.</p>
                    <div className="investigation-evidence-list">
                      {scene.clueIds.map(id => {
                        const clue = MISSION.clues[id];
                        const Icon = evidenceIcons[clue.emphasis];
                        const inspected = record.inspectedClueIds.includes(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            className="investigation-clue"
                            onClick={event => inspect(id, event.currentTarget)}
                            aria-label={`Inspect ${clue.sourceLabel}`}
                          >
                            <Icon size={17} aria-hidden="true" />
                            <span>{clue.sourceLabel}</span>
                            <span className="investigation-clue-status">{inspected ? 'Reviewed' : 'Inspect'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                <section className="investigation-actions" aria-label="Investigation actions">
                  {scene.kind === 'decision' ? (
                    <>
                      <h2>Choose your response</h2>
                      {scene.choices?.map((choice, index) => (
                        <button
                          type="button"
                          key={choice.id}
                          className="investigation-choice"
                          onClick={() => makeChoice(choice.id)}
                        >
                          <span className="investigation-choice-index" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                          <span>{choice.label}</span>
                        </button>
                      ))}
                    </>
                  ) : scene.kind === 'debrief' ? (
                    <>
                      <Button fullWidth onClick={onReplay}>Replay Mission</Button>
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
        </PhoneStage>
      </main>
      {activeClue && (
        <EvidenceDialog
          clue={activeClue}
          onClose={closeEvidence}
          returnFocusTo={focusReturnRef.current}
        />
      )}
    </div>
  );
}
