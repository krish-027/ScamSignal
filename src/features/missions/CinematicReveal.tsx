import { CheckCircle2, CircleAlert, ScanLine, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { Outcome } from '../../types/mission';

const signals = [
  { id: 'sender-identity', title: 'Sender impersonation', detail: 'A familiar display name can be copied.' },
  { id: 'forced-urgency', title: 'Artificial deadline', detail: 'Urgency pressures you to skip verification.' },
  { id: 'unfamiliar-domain', title: 'Lookalike destination', detail: 'A convincing URL is not proof of authenticity.' },
  { id: 'support-impersonation', title: 'Unverified support', detail: 'A sender-supplied contact is not independent evidence.' },
  { id: 'redelivery-request', title: 'Sensitive-data request', detail: 'An unsolicited form can harvest private details.' },
] as const;

const impacts: Record<Outcome, { title: string; detail: string }> = {
  safe: { title: 'Risk contained', detail: 'Your decision reduced exposure to this threat.' },
  caution: { title: 'Verification incomplete', detail: 'You slowed the process, but uncertainty remains.' },
  risky: { title: 'Exposure increased', detail: 'The sender gained another opportunity to influence you.' },
};

export function DecisionImpact({ outcome }: { outcome: Outcome }) {
  const impact = impacts[outcome];
  return (
    <div className={`decision-impact decision-impact--${outcome}`} role="status" aria-label="Decision consequence">
      <div className="decision-impact-icon" aria-hidden="true">
        {outcome === 'safe' ? <ShieldCheck size={25} /> : outcome === 'caution' ? <CircleAlert size={25} /> : <ShieldAlert size={25} />}
      </div>
      <div>
        <strong>{impact.title}</strong>
        <p>{impact.detail}</p>
      </div>
      <span className="decision-impact-beam" aria-hidden="true" />
    </div>
  );
}

export function SignalReveal({ inspectedClueIds }: { inspectedClueIds: readonly string[] }) {
  const inspected = new Set(inspectedClueIds);
  return (
    <section className="signal-reveal" aria-label="Threat signal analysis">
      <div className="signal-reveal-heading">
        <div className="signal-reveal-orb" aria-hidden="true"><ScanLine size={29} /></div>
        <div>
          <span className="signal-reveal-label">FORENSIC SCAN COMPLETE</span>
          <strong>Five signals identified</strong>
        </div>
      </div>
      <div className="signal-reveal-scanbar" aria-hidden="true"><span /></div>
      <ol className="signal-reveal-list">
        {signals.map((signal, index) => (
          <li key={signal.id} className="signal-reveal-item" style={{ animationDelay: `${index * 80}ms` }}>
            <span className="signal-reveal-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong>{signal.title}</strong>
              <p>{signal.detail}</p>
            </div>
            <span className="signal-reveal-state" title={inspected.has(signal.id) ? 'You opened this evidence' : 'Discovered in the reveal'}>
              {inspected.has(signal.id) ? <CheckCircle2 size={16} aria-hidden="true" /> : <CircleAlert size={16} aria-hidden="true" />}
              <span>{inspected.has(signal.id) ? 'Reviewed' : 'Revealed'}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="signal-reveal-footer">Signal analysis finished. Your final score reflects the decisions you locked in, not the number of clues you opened.</p>
    </section>
  );
}
