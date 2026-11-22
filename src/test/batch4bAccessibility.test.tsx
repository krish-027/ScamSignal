import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../app/App';
import { getRouteFromHash } from '../app/navigation';

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '#/');
});

describe('Batch 4B cross-page accessibility and navigation regression', () => {
  it('provides a keyboard-accessible main-content bypass on homepage', () => {
    render(<App />);
    const skip = screen.getByRole('button', { name: 'Skip to main content' });
    skip.focus();
    expect(skip).toHaveFocus();
    fireEvent.click(skip);
    expect(within(screen.getByRole('main')).getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByRole('main'));
  });

  it('keeps bypass functional on progress and direct mission directory links', () => {
    for (const hash of ['#/progress', '#/missions']) {
      window.history.replaceState(null, '', hash);
      const view = render(<App />);
      fireEvent.click(screen.getByRole('button', { name: 'Skip to main content' }));
      expect(document.activeElement).toBe(screen.getByRole('main'));
      expect(screen.getByRole('main').querySelectorAll('h1')).toHaveLength(1);
      view.unmount();
    }
  });

  it('retains all mission routes and in-page progress navigation', () => {
    expect(getRouteFromHash('#/investigate')).toBe('investigate');
    expect(getRouteFromHash('#/internship')).toBe('internship');
    expect(getRouteFromHash('#/refund')).toBe('refund');
    expect(getRouteFromHash('#/progress')).toBe('progress');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /view my progress/i }));
    expect(window.location.hash).toBe('#/progress');
    expect(screen.getByRole('main')).toHaveTextContent('Achievement cabinet');
  });
});
