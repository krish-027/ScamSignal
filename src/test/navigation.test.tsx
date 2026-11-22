import { beforeEach, describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { App } from '../app/App';
import { getRouteFromHash } from '../app/navigation';

function setHash(hash: string) {
  window.history.replaceState(null, '', hash);
}

describe('ScamSignal routing and accessibility', () => {
  beforeEach(() => {
    setHash('#/');
  });

  it('parses canonical and unexpected hashes', () => {
    expect(getRouteFromHash('')).toBe('home');
    expect(getRouteFromHash('#/')).toBe('home');
    expect(getRouteFromHash('#/briefing')).toBe('briefing');
    expect(getRouteFromHash('#/preview')).toBe('preview');
    expect(getRouteFromHash('#/nonexistent')).toBe('not-found');
  });

  it('navigates Home to Briefing to Preview and back', async () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /the internet is testing you/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /start investigation/i }));
    expect(window.location.hash).toBe('#/briefing');
    expect(screen.getByRole('heading', { level: 1, name: /the missing package/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /begin preview/i }));
    expect(window.location.hash).toBe('#/preview');
    expect(screen.getByRole('heading', { level: 1, name: /speedpost courier/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /return to mission 1 briefing/i }));
    expect(screen.getByRole('heading', { level: 1, name: /the missing package/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /back to home/i }));
    expect(screen.getByRole('heading', { level: 1, name: /the internet is testing you/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
    });
  });

  it('supports direct navigation into the briefing', () => {
    setHash('#/briefing');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /the missing package/i })).toBeInTheDocument();
  });

  it('shows recovery for unknown hashes', () => {
    setHash('#/unknown');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /return to scamsignal home/i }));
    expect(screen.getByRole('heading', { level: 1, name: /the internet is testing you/i })).toBeInTheDocument();
  });

  it('responds to hashchange and moves focus to the destination heading', async () => {
    render(<App />);
    act(() => {
      setHash('#/preview');
      fireEvent(window, new Event('hashchange'));
    });
    const title = screen.getByRole('heading', { level: 1, name: /speedpost courier/i });
    await waitFor(() => expect(title).toHaveFocus());
    expect(screen.getByRole('status')).toHaveTextContent(/simulation preview/i);
  });
});
