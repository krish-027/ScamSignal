import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ArrowUpRight, BriefcaseBusiness, PackageSearch, WalletCards } from 'lucide-react';
import type { MissionKey } from '../missions/directory/MissionCards';
import './homeCasePreview.css';

interface HomeCasePreviewProps {
  onSelectMission?: (id: MissionKey) => void;
  onBrowseMissions: () => void;
}

// These are short, fictional examples grounded in the existing three missions.
// They are previews, not live inbox messages, working URLs or playable checkpoints.
const cases = [
  {
    id: 'parcel', number: '01', short: 'Delivery', title: 'The Missing Package',
    category: 'DELIVERY PHISHING', sender: 'SpeedPost Courier',
    address: 'alert@speedpost-verify.example',
    message: 'Package #IN-88942 cannot be delivered. Confirm your address within two hours to avoid a return to depot.',
    signal: 'Time pressure + sender identity', Icon: PackageSearch,
  },
  {
    id: 'internship', number: '02', short: 'Internship', title: 'The Dream Internship',
    category: 'RECRUITMENT IMPERSONATION', sender: 'TalentBridge Recruiting',
    address: 'careers@talentbridge-onboarding.example',
    message: 'You have been shortlisted for a remote internship you did not apply for. Confirm your candidate reference to continue.',
    signal: 'Unsolicited opportunity + website', Icon: BriefcaseBusiness,
  },
  {
    id: 'refund', number: '03', short: 'Refund', title: 'The Refund Trap',
    category: 'PAYMENT & REFUND FRAUD', sender: 'MossCart Support',
    address: 'refunds@mosscart-refunds.example',
    message: 'Your order is eligible for a refund. An agent will guide you through an additional verification step.',
    signal: 'Refund claim + payment redirection', Icon: WalletCards,
  },
] as const;

export function HomeCasePreview({ onSelectMission, onBrowseMissions }: HomeCasePreviewProps) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const current = cases[selected];
  const changeWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % cases.length;
    else if (event.key === 'ArrowLeft') next = (index + cases.length - 1) % cases.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = cases.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  };
  return (
    <aside className="home-case-preview hero-preview-column animate-hero-card" aria-label="Explore sample scam messages">
      <div className="home-case-preview-shell">
        <div className="home-case-preview-heading">
          <span>CASE FILE PREVIEW</span>
          <strong>Three ways a message can mislead you.</strong>
        </div>
        <div className="home-case-preview-tabs" role="tablist" aria-label="Preview one of three fictional cases">
          {cases.map((item, index) => (
            <button key={item.id} type="button" role="tab" id={`${uid}-tab-${index}`}
              aria-controls={`${uid}-panel`} aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1} ref={el => { tabs.current[index] = el; }}
              className={selected === index ? 'is-selected' : ''}
              onClick={() => setSelected(index)} onKeyDown={event => changeWithKeyboard(event, index)}>
              <item.Icon size={16} aria-hidden="true" /><span>{item.short}</span>
            </button>
          ))}
        </div>
        <section id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${selected}`}
          tabIndex={0} className="home-case-preview-card">
          <div className="home-case-preview-meta"><span>CASE {current.number} / {current.category}</span><span>MESSAGE PREVIEW</span></div>
          <div className="home-case-preview-sender">
            <span className="home-case-preview-avatar" aria-hidden="true"><current.Icon size={20} /></span>
            <div><strong>{current.sender}</strong><small>{current.address}</small></div>
          </div>
          <p>{current.message}</p>
          <div className="home-case-preview-signal"><span>INVESTIGATION SIGNAL</span><strong>{current.signal}</strong></div>
          <div className="home-case-preview-actions">
            <span>{current.title}</span>
            <button type="button" onClick={() => onSelectMission ? onSelectMission(current.id) : onBrowseMissions()}
              aria-label={`Explore ${current.title}`}>
              Explore case <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </div>
        </section>
        <p className="home-case-preview-hint">Select a case to inspect its opening signal.</p>
      </div>
    </aside>
  );
}
