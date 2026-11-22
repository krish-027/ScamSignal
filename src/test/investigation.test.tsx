import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { App } from '../app/App';

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '#/');
});

function beginFromHome() {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /start investigation/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Start Investigation' }));
}

function lock(label: RegExp) {
  fireEvent.click(screen.getByRole('button', { name: label }));
  fireEvent.click(screen.getByRole('button', { name: /confirm and lock decision/i }));
}

function cont() {
  fireEvent.click(screen.getByRole('button', { name: /continue investigation/i }));
}

describe('Mission 1 investigation with stable phone shell', () => {
  it('returns to the Evidence list before closing, with keyboard focus restored', async () => {
    beginFromHome();
    const trigger = screen.getByRole('button', { name: /^evidence$/i });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: /sender identity/i }));
    expect(screen.getByRole('dialog', { name: /sender identity/i })).toHaveTextContent(/display name does not prove/i);
    fireEvent.click(screen.getByRole('button', { name: /back to evidence/i }));
    expect(screen.getByRole('dialog', { name: /evidence locker/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /urgency claim/i }));
    expect(screen.getByRole('dialog', { name: /urgency claim/i })).toBeInTheDocument();
    // The X in detail returns to the list, instead of abandoning the Evidence tool.
    fireEvent.click(screen.getByRole('button', { name: /close evidence: urgency claim/i }));
    expect(screen.getByRole('dialog', { name: /evidence locker/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close evidence locker/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('completes the five-decision safe route for 100 points, and can replay', () => {
    beginFromHome();
    const phone = document.querySelector('.phone-stage--interactive');
    expect(phone).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /continue to first decision/i }));
    lock(/check the sender details/i);
    cont();
    lock(/use the courier.s official app/i);
    cont();
    lock(/decline and verify the parcel independently/i);
    cont(); // enters support-message
    cont(); // enters decision-support
    lock(/find a published support number independently/i);
    cont(); // enters resolution-message
    cont(); // enters decision-resolution
    lock(/save the evidence and report through the official channel/i);
    cont(); // reveal
    fireEvent.click(screen.getByRole('button', { name: /view mission result/i }));
    expect(screen.getByText((_, element) => element?.tagName === 'STRONG'
      && element.textContent?.replace(/\s+/g, ' ').trim() === '100 / 100')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '5');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '5');
    expect(document.querySelector('.phone-stage--interactive')).toBe(phone);
    fireEvent.click(screen.getByRole('button', { name: /replay mission/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm restart mission/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('Incoming delivery alert')).toBeInTheDocument();
  });

  it('supports direct navigation without inventing progress', () => {
    window.history.replaceState(null, '', '#/investigate');
    render(<App />);
    expect(screen.getByText('The Missing Package')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start Investigation' }));
    expect(screen.getByText('Incoming delivery alert')).toBeInTheDocument();
  });
});
