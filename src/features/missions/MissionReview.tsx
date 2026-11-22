import { useMemo, useState } from 'react';
import { Check, ClipboardCopy, ShieldCheck } from 'lucide-react';
import type { MissionDefinition, MissionRecord } from '../../types/mission';
import { formatMissionReport, getReviewedDecisions } from './missionReviewModel';
import './missionReview.css';

interface MissionReviewProps {
  record: MissionRecord;
  definition: MissionDefinition;
}

/** Post-mission educational debrief: never alters engine state or stored decisions. */
export function MissionReview({ record, definition }: MissionReviewProps) {
  const [copyStatus, setCopyStatus] = useState('');
  const reviewed = useMemo(() => getReviewedDecisions(record, definition), [record, definition]);

  const copyReport = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(formatMissionReport(record, definition));
      setCopyStatus('Case report copied.');
    } catch {
      setCopyStatus('Copy unavailable in this browser. You can review your decisions here.');
    }
  };

  return (
    <section className="mission-review" aria-label="Mission decision review">
      <div className="mission-review-heading">
        <span className="mission-review-icon" aria-hidden="true"><ShieldCheck size={20} /></span>
        <div>
          <h3>Decision review</h3>
          <p>{reviewed.length} locked responses · {record.inspectedClueIds.length} evidence clues reviewed</p>
        </div>
      </div>
      <p className="mission-review-intro">Open a decision to see what your choice meant and compare it with a safer response.</p>
      <div className="mission-review-entries">
        {reviewed.map(item => (
          <details key={item.checkpointId} className={`mission-review-entry mission-review-entry--${item.outcome}`}>
            <summary>
              <span className="mission-review-entry-number">{String(item.ordinal).padStart(2, '0')}</span>
              <span className="mission-review-entry-title">{item.title}</span>
              <span className="mission-review-entry-score">{item.points}/20</span>
            </summary>
            <div className="mission-review-detail">
              <p><strong>Your response:</strong> {item.selectedLabel}</p>
              <p><strong>What matters:</strong> {item.rationale}</p>
              <p><strong>Safer approach:</strong> {item.saferAlternative}</p>
            </div>
          </details>
        ))}
      </div>
      <button className="mission-review-copy" type="button" onClick={copyReport}>
        {copyStatus === 'Case report copied.' ? <Check size={17} aria-hidden="true" /> : <ClipboardCopy size={17} aria-hidden="true" />}
        Copy case report
      </button>
      <p className="mission-review-copy-status" role="status" aria-live="polite">{copyStatus}</p>
    </section>
  );
}
