import { ArrowUpRight, BriefcaseBusiness, PackageSearch, WalletCards } from 'lucide-react';
import './missionCards.css';

export type MissionKey = 'parcel' | 'internship' | 'refund';
interface MissionCardsProps { onSelect: (mission: MissionKey) => void; }

const MISSIONS = [
  { id: 'parcel', number: '01', title: 'The Missing Package', subtitle: 'Delivery phishing', description: 'A courier alert sets a suspicious deadline. Examine the sender, test the claims, and make five decisive moves.', meta: '5 decisions · 5 clues', Icon: PackageSearch },
  { id: 'internship', number: '02', title: 'The Dream Internship', subtitle: 'Recruitment impersonation', description: 'An unusually generous offer turns into a chain of requests. Navigate ten interactions and recall evidence you collected.', meta: '10 interactions · 2 puzzles', Icon: BriefcaseBusiness },
  { id: 'refund', number: '03', title: 'The Refund Trap', subtitle: 'UPI and refund fraud', description: 'A refund message becomes a payment request. Untangle QR instructions, collect requests and support tricks across twelve interactions.', meta: '12 interactions · 2 puzzles', Icon: WalletCards },
] as const;

export function MissionCards({ onSelect }: MissionCardsProps) {
  return <div className="mission-directory-cards">
    {MISSIONS.map(({ id, number, title, subtitle, description, meta, Icon }) => <article key={id} className="mission-directory-card">
      <div className="mission-directory-icon"><Icon size={23} aria-hidden="true" /></div>
      <div className="mission-directory-copy">
        <span className="mission-directory-index">CASE {number} · AVAILABLE</span>
        <h3>{title}</h3>
        <p className="mission-directory-subtitle">{subtitle}</p>
        <p className="mission-directory-description">{description}</p>
        <span className="mission-directory-meta">{meta}</span>
      </div>
      <button type="button" className="mission-directory-play" onClick={() => onSelect(id)} aria-label={`Play ${title}`}>
        Play mission <ArrowUpRight size={18} aria-hidden="true" />
      </button>
    </article>)}
  </div>;
}
