import { useMemo, useState } from 'react';
import type { MissionDefinition, MissionRecord } from '../../types/mission';
import { PhonePanel } from '../../components/game/PhonePanel';
import './questionHistory.css';

interface Props {
  record: MissionRecord;
  definition: MissionDefinition;
  onClose: () => void;
  returnFocusTo: HTMLElement | null;
}

/** Revisit previous questions without changing the engine's locked decisions or score. */
export function LockedQuestionHistory({ record, definition, onClose, returnFocusTo }: Props) {
  const reviewed = useMemo(() => Object.values(definition.scenes)
    .filter(scene => scene.kind === 'decision' && scene.checkpointId && record.decisions[scene.checkpointId])
    .map(scene => {
      const answer = record.decisions[scene.checkpointId!]!;
      const choice = scene.choices?.find(item => item.id === answer.choiceId);
      return { scene, answer, choice };
    }), [definition, record]);
  const [index, setIndex] = useState(Math.max(0, reviewed.length - 1));
  const chosen = reviewed[index];

  return <PhonePanel title="Previous question" onClose={onClose} returnFocusTo={returnFocusTo}>
    {chosen ? <div className="question-history">
      <p className="question-history-kicker">QUESTION {index + 1} OF {reviewed.length} · LOCKED</p>
      <h3>{chosen.scene.title ?? `Question ${index + 1}`}</h3>
      <p>{chosen.scene.body}</p>
      <div className="question-history-answer">
        <span>Your recorded answer</span>
        <strong>{chosen.choice?.label ?? 'Recorded response'}</strong>
        <small>+{chosen.answer.pointsEarned} points · read-only</small>
      </div>
      <div className="question-history-actions">
        <button type="button" disabled={index === 0} onClick={() => setIndex(i => Math.max(0, i - 1))}>Older question</button>
        <button type="button" disabled={index === reviewed.length - 1} onClick={() => setIndex(i => Math.min(reviewed.length - 1, i + 1))}>Newer question</button>
      </div>
      <button type="button" className="question-history-return" onClick={onClose}>Return to current question</button>
    </div> : <p>No locked decisions yet. Go back to the mission briefing to exit.</p>}
  </PhonePanel>;
}
