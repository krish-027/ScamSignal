import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { BrandMark } from '../../../components/ui/BrandMark';
import { MissionCards } from './MissionCards';
import type { MissionKey } from './MissionCards';

export function MissionSelectPage({ onSelect, onBack }: { onSelect: (id: MissionKey) => void; onBack: () => void }) {
  return <div className="mission-select-screen view-transition">
    <header className="mission-select-header"><BrandMark /><button type="button" onClick={onBack}><ArrowLeft size={17} aria-hidden="true" /> Back to home</button></header>
    <main id="main-content" className="mission-select-main">
      <div className="mission-select-intro">
        <span><ShieldCheck size={16} aria-hidden="true" /> CHOOSE YOUR INVESTIGATION</span>
        <h1 tabIndex={-1}>Pick a case. Follow the signals.</h1>
        <p>Each case puts you inside a different digital scam. Inspect the evidence, make consequential choices and discover why the warning signs matter.</p>
      </div>
      <MissionCards onSelect={onSelect} />
      <p className="mission-select-note">All cases are fictional simulations. Your progress is saved locally in this browser.</p>
    </main>
  </div>;
}
