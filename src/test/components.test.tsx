import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui/Button';
import { BrandMark } from '../components/ui/BrandMark';
import { Card } from '../components/ui/Card';
import { GameHeader } from '../components/game/GameHeader';
import { FictionalMessageCard } from '../components/game/FictionalMessageCard';

describe('Shared UI Components', () => {
  it('renders BrandMark with logo and simulation badge', () => {
    render(<BrandMark showBadge={true} />);
    expect(screen.getByText(/SCAMSIGNAL/i)).toBeInTheDocument();
    expect(screen.getByText(/Interactive Simulation/i)).toBeInTheDocument();
  });

  it('renders Button with primary styling and handles click', () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" onClick={handleClick}>
        Start Investigation
      </Button>
    );

    const button = screen.getByRole('button', { name: /start investigation/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('prevents click events when Button is disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" disabled onClick={handleClick}>
        Disabled Action
      </Button>
    );

    const button = screen.getByRole('button', { name: /disabled action/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders Card with content and proper variant', () => {
    render(
      <Card variant="raised" data-testid="test-card">
        <div>Card Content</div>
      </Card>
    );
    expect(screen.getByTestId('test-card')).toHaveClass('card-raised');
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders GameHeader with back button and progress indicator', () => {
    const handleBack = vi.fn();
    render(
      <GameHeader
        title="Test Mission"
        subtitle="Mission Subtitle"
        progressText="MISSION 01 / 03"
        onBack={handleBack}
        showPreviewBadge={true}
      />
    );

    expect(screen.getByText('Test Mission')).toBeInTheDocument();
    expect(screen.getByText('MISSION 01 / 03')).toBeInTheDocument();
    expect(screen.getByText('PREVIEW')).toBeInTheDocument();

    const backButton = screen.getByRole('button', { name: /navigate back/i });
    fireEvent.click(backButton);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('renders FictionalMessageCard with safety disclaimers and inert link', () => {
    render(
      <FictionalMessageCard
        senderName="SpeedPost Courier"
        senderAddress="alert@speedpost-verify.example"
        messageText="Urgent delivery issue"
        suspiciousUrl="https://speedpost-parcel-status.example/verify"
      />
    );

    expect(screen.getByText(/Educational Simulation/i)).toBeInTheDocument();
    expect(screen.getByText('SpeedPost Courier')).toBeInTheDocument();
    expect(screen.getByText(/alert@speedpost-verify\.example/i)).toBeInTheDocument();
    expect(screen.getByText(/Simulated Link \(Inert\)/i)).toBeInTheDocument();
    expect(screen.getByText(/speedpost-parcel-status\.example/i)).toBeInTheDocument();
  });
});
