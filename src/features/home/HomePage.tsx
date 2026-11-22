import React from 'react';
import { ArrowRight, ShieldCheck, Eye, Search, AlertOctagon } from 'lucide-react';
import { BrandMark } from '../../components/ui/BrandMark';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import './homePage.css';

interface HomePageProps {
  onStart: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
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
              The internet is testing you.
            </h1>
          </div>

          <p
            className="text-body animate-hero-2"
            style={{
              fontSize: '18px',
              maxWidth: '520px',
              color: 'var(--color-secondary-text)',
            }}
          >
            Can you spot the threat before it&apos;s too late? Investigate realistic phone scams,
            uncover subtle red flags, and master cyber defense through consequential decisions.
          </p>

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
              aria-label="Start Investigation and view Mission 1 Briefing"
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
              <AlertOctagon size={13} color="var(--color-accent)" /> 3-5 min session · No sign-up required
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

      </main>

      
    </div>
  );
};
