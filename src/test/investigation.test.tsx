import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { App } from '../app/App';

beforeEach(() => {
  window.history.replaceState(null, '', '#/');
});

describe('Mission 1 interactive investigation', () => {
  function beginFromHome() {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start investigation/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Start Investigation' }));
  }

  it('opens a real evidence dialog and returns keyboard focus on close', async () => {
    beginFromHome();
    expect(window.location.hash).toBe('#/investigate');
    expect(screen.getByText('Incoming delivery alert')).toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: /inspect sender identity/i });
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: /sender identity/i });
    expect(dialog).toHaveTextContent(/display name does not establish authenticity/i);
    fireEvent.click(screen.getByRole('button', { name: /close evidence panel/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('can finish the safe path and replay without duplicate score', () => {
    beginFromHome();
    fireEvent.click(screen.getByRole('button', { name: /continue to first decision/i }));
    fireEvent.click(screen.getByRole('button', { name: /check the sender details/i }));
    fireEvent.click(screen.getByRole('button', { name: /continue investigation/i }));
    fireEvent.click(screen.getByRole('button', { name: /use the courier’s official app/i }));
    fireEvent.click(screen.getByRole('button', { name: /continue investigation/i }));
    fireEvent.click(screen.getByRole('button', { name: /decline and verify the parcel independently/i }));
    fireEvent.click(screen.getByRole('button', { name: /continue investigation/i }));
    fireEvent.click(screen.getByRole('button', { name: /view mission result/i }));
    expect(
  screen.getByText((_, element) =>
    element?.tagName === 'STRONG' &&
    element.textContent?.replace(/\s+/g, ' ').trim() === '100 / 100'
  )
).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
    fireEvent.click(screen.getByRole('button', { name: /replay mission/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('Incoming delivery alert')).toBeInTheDocument();
  });

  it('supports direct hash navigation without fabricating a played session', () => {
    window.history.replaceState(null, '', '#/investigate');
    render(<App />);
    expect(screen.getByText('The Missing Package')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start Investigation' }));
    expect(screen.getByText('Incoming delivery alert')).toBeInTheDocument();
  });
});
