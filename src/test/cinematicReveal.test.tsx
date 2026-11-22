import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DecisionImpact, SignalReveal } from '../features/missions/CinematicReveal';

describe('Batch 2C cinematic content', () => {
  it('reveals all five signals without altering game state', () => {
    render(<SignalReveal inspectedClueIds={['sender-identity', 'forced-urgency']} />);
    expect(screen.getByRole('list').children).toHaveLength(5);
    expect(screen.getByText('Sender impersonation')).toBeInTheDocument();
    expect(screen.getByText('Unverified support')).toBeInTheDocument();
    expect(screen.getAllByText('Reviewed')).toHaveLength(2);
    expect(screen.getAllByText('Revealed')).toHaveLength(3);
  });
  it.each(['safe', 'caution', 'risky'] as const)('provides a textual %s consequence, not animation alone', outcome => {
    render(<DecisionImpact outcome={outcome} />);
    expect(screen.getByRole('status', { name: 'Decision consequence' })).toHaveTextContent(outcome === 'safe' ? 'Risk contained' : outcome === 'caution' ? 'Verification incomplete' : 'Exposure increased');
  });
});
