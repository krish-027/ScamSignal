import React from 'react';
import { ArrowRight, ShieldCheck, Eye, Search, AlertOctagon } from 'lucide-react';
import { BrandMark } from '../../components/ui/BrandMark';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import './homePage.css';
import './homeWide.css';
import './home3A.css';
import './home3B.css';
import { MissionCards } from '../missions/directory/MissionCards';
import type { MissionKey } from '../missions/directory/MissionCards';

interface HomePageProps {
  onStart: () => void;
  onSelectMission?: (id: MissionKey) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart, onSelectMission }) => {
  return (
    <div
      className="home-page-container view-transition"
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
      <header
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
        className="hero-section"
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
              className="text-mono"
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

        {/* Right Column: Realistic Notification Preview Card with Restrained Glow */}
        <div
          className="hero-preview-column animate-hero-card"
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Subtle teal radial glow behind card */}
          <div
            style={{
              position: 'absolute',
              width: '360px',
              height: '360px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(77, 228, 192, 0.12) 0%, transparent 68%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
            aria-hidden="true"
          />

          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                left: '16px',
                zIndex: 2,
                backgroundColor: 'rgba(7, 17, 31, 0.95)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-pill)',
                padding: '3px 10px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-accent)',
                letterSpacing: '0.04em',
              }}
            >
              SIMULATED NOTIFICATION PREVIEW
            </div>

            <Card
              variant="surface"
              padding="standard"
              className="card-interactive"
              style={{
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55)',
                borderTop: '2px solid var(--color-accent)',
                backgroundColor: 'rgba(14, 27, 44, 0.92)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-danger)',
                      boxShadow: '0 0 8px var(--color-danger)',
                    }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary-text)' }}>
                    SpeedPost Courier
                  </span>
                </div>
                <span className="text-mono" style={{ fontSize: '11px', color: 'var(--color-muted-text)' }}>
                  Just Now
                </span>
              </div>

              <p
                style={{
                  fontSize: '14px',
                  lineHeight: 1.45,
                  color: 'var(--color-secondary-text)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                Delivery Exception: Package #IN-88942 street address is incomplete. Update details immediately to prevent return to sorting facility.
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: 'var(--color-surface-inset)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-muted-text)',
                  border: '1px solid rgba(41, 64, 87, 0.5)',
                }}
              >
                <span style={{ wordBreak: 'break-all' }}>speedpost-parcel-status.example</span>
                <span style={{ color: 'var(--color-warning)', fontWeight: 600, flexShrink: 0, marginLeft: '8px' }}>
                  [Suspect]
                </span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section
        aria-labelledby="how-it-works-title"
        style={{
          padding: 'var(--space-8) 0 var(--space-12)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
          <span className="text-mono" style={{ color: 'var(--color-accent)' }}>
            Investigation Protocol
          </span>
          <h2 id="how-it-works-title" className="text-heading" style={{ marginTop: 'var(--space-1)' }}>
            How ScamSignal Works
          </h2>
        </div>

        <div
          className="steps-grid"
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
                backgroundColor: 'rgba(77, 228, 192, 0.12)',
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
                backgroundColor: 'rgba(255, 203, 107, 0.12)',
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
                backgroundColor: 'rgba(100, 224, 172, 0.12)',
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

      <section className="mission-catalog-section" id="available-missions" aria-labelledby="available-missions-title">
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
