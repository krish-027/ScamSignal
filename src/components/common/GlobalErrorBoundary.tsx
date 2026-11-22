import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ScamSignal Diagnostic Error:', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.hash = '#/';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = import.meta.env.DEV;

      return (
        <div
          role="alert"
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-5)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-primary-text)',
          }}
        >
          <Card
            variant="raised"
            padding="spacious"
            style={{
              maxWidth: '460px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              border: '1px solid var(--color-danger)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <AlertOctagon size={28} color="var(--color-danger)" />
              <h1 style={{ fontSize: '20px', fontFamily: 'var(--font-heading)' }}>
                System Notice
              </h1>
            </div>

            <p className="text-body" style={{ fontSize: '15px' }}>
              An unexpected issue occurred while rendering this view. You can safely return to the home screen.
            </p>

            {/* Diagnostic trace only visible in development mode */}
            {isDev && this.state.error && (
              <pre
                style={{
                  padding: '10px',
                  backgroundColor: 'var(--color-surface-inset)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-secondary-text)',
                  overflowX: 'auto',
                  border: '1px solid rgba(255, 107, 122, 0.3)',
                }}
              >
                {this.state.error.message}
              </pre>
            )}

            <Button
              variant="primary"
              onClick={this.handleReset}
              icon={<RotateCcw size={18} />}
            >
              Return to Home
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
