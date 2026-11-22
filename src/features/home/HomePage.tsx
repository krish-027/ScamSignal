import React from 'react';
import { ArrowRight, ShieldCheck, Eye, Search, AlertOctagon } from 'lucide-react';
import { BrandMark } from '../../components/ui/BrandMark';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import './homePage.css';
import './homeWide.css';
import './home3A.css';
import './home3B.css';
import '../progress/progressEntry.css';
import { MissionCards } from '../missions/directory/MissionCards';
import { HomeCasePreview } from './HomeCasePreview';
import type { MissionKey } from '../missions/directory/MissionCards';

interface HomePageProps {
  onStart: () => void;
  onSelectMission?: (id: MissionKey) => void;
  onProgress?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart, onSelectMission, onProgress }) => {
  return (
    <div
      className="home-page-container view-transition visual-home"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 'var(--desktop-max-width)',
        margin: '0 auto',
        padding: '0 var(--space-5)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Brand Header */}
      <header className="home-masthead"
        style={{
          padding: 'var(--space-5) 0',
          width: '100%',
        }}
      >
        <BrandMark />
      </header>

      <main id="main-content">
      {/* Hero Section */}
      <section
        className="hero-section visual-hero"
        aria-labelledby="hero-title"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-8)',
          alignItems: 'center',
          padding: 'var(--space-6) 0 var(--space-8)',
        }}
      >
        {/* Left Column: Copy & Primary CTA */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
          }}
        >
          <div className="animate-hero-1" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span
              className="text-mono hero-serial"
              style={{
                color: 'var(--color-accent)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={14} /> Cyber Defense Simulation
            </span>
            <h1 id="hero-title" className="text-hero" tabIndex={-1}>
              The internet is testing you.<span className="hero-second-line">Can you spot the scam?</span>
            </h1>
          </div>

          <p
            className="text-body animate-hero-2 hero-description"
            style={{
              fontSize: '18px',
              maxWidth: '520px',
              color: 'var(--color-secondary-text)',
            }}
          >
            Step into realistic delivery, recruitment, and refund scenarios. Examine suspicious messages, connect clues across conversations, and make choices that change how each investigation unfolds.
          </p>


          <ul className="hero-benefits" aria-label="Investigation features">
            <li>Follow the evidence</li>
            <li>Decode the deception</li>
            <li>Make your own call</li>
          </ul>

          <div
            className="animate-hero-3"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              maxWidth: '360px',
            }}
          >
            <Button
              variant="primary"
              onClick={onStart}
              icon={<ArrowRight size={20} />}
              style={{ width: '100%' }}
              aria-label="Start Investigation and choose a mission"
            >
              Start Investigation
            </Button>
            {onProgress && <button type="button" className="hero-progress-link" onClick={onProgress}>View My Progress</button>}
            <span
              className="text-supporting"
              style={{
                textAlign: 'center',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <AlertOctagon size={13} color="var(--color-accent)" /> Three interactive cases · No sign-up required
            </span>
          </div>
        </div>

        {/* Three selectable fictional case previews, grounded in available missions */}
        <HomeCasePreview onBrowseMissions={onStart} onSelectMission={onSelectMission} />
      </section>

      {/* How it works Section */}
      <section className="home-protocol-section"
        aria-labelledby="how-it-works-title"
        style={{
          padding: 'var(--space-8) 0 var(--space-12)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div className="home-protocol-heading" style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
          <span className="text-mono" style={{ color: 'var(--color-accent)' }}>
            Investigation Protocol
          </span>
          <h2 id="how-it-works-title" className="text-heading" style={{ marginTop: 'var(--space-1)' }}>
            How ScamSignal Works
          </h2>
        </div>

        <div
          className="steps-grid visual-steps"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--space-5)',
          }}
        >
          <Card variant="surface" padding="standard" className="card-interactive">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(250, 145, 109, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <Search size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              1. Inspect &amp; Analyze
            </h3>
            <p className="text-body" style={{ fontSize: '14px' }}>
              Examine realistic SMS, messaging, and payment requests. Probe sender metadata, domains, and psychological urgency tricks.
            </p>
          </Card>

          <Card variant="surface" padding="standard" className="card-interactive">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(238, 193, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-warning)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <Eye size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              2. Make Strategic Choices
            </h3>
            <p className="text-body" style={{ fontSize: '14px' }}>
              Decide whether to trust, verify independently, or block. Experience simulated consequences with zero personal risk.
            </p>
          </Card>

          <Card variant="surface" padding="standard" className="card-interactive">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(166, 211, 180, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-success)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              3. Uncover Threat Signals
            </h3>
            <p className="text-body" style={{ fontSize: '14px' }}>
              Inspect breakdown reveals highlighting exactly what scammers hid and receive actionable defense principles.
            </p>
          </Card>
        </div>
      </section>

      <section className="mission-catalog-section visual-catalog" id="available-missions" aria-labelledby="available-missions-title">
        <div className="mission-catalog-heading"><div>
          <span>THREE CASES / YOUR CALL</span>
          <h2 id="available-missions-title">Choose your next investigation</h2>
          <p>Start with a suspicious delivery, follow a questionable job offer, or unravel a refund request designed to trick you.</p>
        </div></div>
        <MissionCards onSelect={onSelectMission ?? (() => onStart())} />
      </section>
</main>

      
    </div>
  );
};
