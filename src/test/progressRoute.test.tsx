import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { App } from '../app/App';
import { getRouteFromHash } from '../app/navigation';

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '#/');
});

describe('Batch 4A route regression', () => {
  it('parses progress without disturbing mission routing', () => {
    expect(getRouteFromHash('#/progress')).toBe('progress');
    expect(getRouteFromHash('#/missions')).toBe('missions');
    expect(getRouteFromHash('#/refund')).toBe('refund');
    expect(getRouteFromHash('#/internship')).toBe('internship');
    expect(getRouteFromHash('#/investigate')).toBe('investigate');
  });
  it('opens the dashboard from Home and returns to mission selection', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /view my progress/i }));
    expect(window.location.hash).toBe('#/progress');
    expect(screen.getByRole('heading', { name: /instincts have taken you/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /browse all missions/i }));
    expect(window.location.hash).toBe('#/missions');
    expect(screen.getByRole('heading', { name: /pick a case/i })).toBeInTheDocument();
  });
  it('handles a direct progress deep link', () => {
    window.history.replaceState(null, '', '#/progress');
    render(<App />);
    expect(screen.getByRole('heading', { name: /instincts have taken you/i })).toBeInTheDocument();
  });
});
