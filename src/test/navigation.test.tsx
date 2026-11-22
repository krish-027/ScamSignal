import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../app/App';

describe('User Journey & Navigation', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('navigates from Home to Mission Briefing and to Simulation Preview and back', () => {
    render(<App />);

    // 1. Initially on Home
    expect(screen.getByRole('heading', { level: 1, name: /the internet is testing you/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start investigation/i })).toBeInTheDocument();

    // 2. Click Start Investigation -> goes to Briefing
    fireEvent.click(screen.getByRole('button', { name: /start investigation/i }));
    expect(screen.getByRole('heading', { level: 1, name: /the missing package/i })).toBeInTheDocument();
    expect(screen.getByText(/MISSION 01 \/ 03/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /begin preview/i })).toBeInTheDocument();

    // 3. Click Begin Preview -> goes to Simulation Preview
    fireEvent.click(screen.getByRole('button', { name: /begin preview/i }));
    expect(screen.getByText('SpeedPost Dispatch')).toBeInTheDocument();
    expect(screen.getByText(/DECISION ENGINE STATUS: STANDBY/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /return to mission 1 briefing/i })).toBeInTheDocument();

    // 4. Click Return to Briefing -> returns to Briefing
    fireEvent.click(screen.getByRole('button', { name: /return to mission 1 briefing/i }));
    expect(screen.getByRole('heading', { level: 1, name: /the missing package/i })).toBeInTheDocument();

    // 5. Click Back to Home -> returns to Home
    fireEvent.click(screen.getByRole('button', { name: /back to home/i }));
    expect(screen.getByRole('heading', { level: 1, name: /the internet is testing you/i })).toBeInTheDocument();
  });
});
