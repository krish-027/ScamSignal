import React from 'react';
import { ArrowRight, ShieldCheck, Eye, Search, AlertOctagon } from 'lucide-react';
import { BrandMark } from '../../components/ui/BrandMark';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface HomePageProps {
  onStart: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div
      className="home-page-container"
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
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
            <h1 id="hero-title" className="text-hero">
              The internet is testing you.
            </h1>
          </div>

          <p
            className="text-body"
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

        {/* Right Column: Realistic Notification Preview Card */}
        <div
          className="hero-preview-column"
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                left: '16px',
                zIndex: 2,
                backgroundColor: 'rgba(7, 17, 31, 0.9)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-pill)',
                padding: '2px 10px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-muted-text)',
              }}
            >
              SIMULATED NOTIFICATION PREVIEW
            </div>

            <Card
              variant="surface"
              padding="standard"
              style={{
                border: '1px solid var(--color-border)',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
                borderTop: '2px solid var(--color-accent)',
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
                    SpeedPost Express
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
                Delivery Exception: Package #IN-88942 address is unconfirmed. Click to update within 2 hours or shipment will be forfeited.
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
                }}
              >
                <span>speedpost-parcel-status.example</span>
                <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>[Red Flag]</span>
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
          <Card variant="surface" padding="standard">
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

          <Card variant="surface" padding="standard">
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

          <Card variant="surface" padding="standard">
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

      {/* Educational Disclaimer Footer */}
      <footer
        style={{
          padding: 'var(--space-6) 0 var(--space-8)',
          borderTop: '1px solid var(--color-border)',
          textAlign: 'center',
        }}
      >
        <p className="text-supporting" style={{ fontSize: '13px' }}>
          Educational simulation. No real payments, logins, or messages. Never enter real passwords or PINs.
        </p>
      </footer>
    </div>
  );
};
