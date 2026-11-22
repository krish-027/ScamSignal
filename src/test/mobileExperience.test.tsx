import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { App } from '../app/App';
import { loadSession, persistSession, SESSION_KEY } from '../features/missions/sessionStorage';
import { advance, choose, createSession, startMission } from '../features/missions/engine/missionEngine';
import { PARCEL_MISSION } from '../features/missions/data/parcelMission';

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '#/');
});

function begin() {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /start investigation/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Play The Missing Package' }));
  fireEvent.click(screen.getByRole('button', { name: 'Start Investigation' }));
  fireEvent.click(screen.getByRole('button', { name: /continue to first decision/i }));
}

function lockFirst() {
  fireEvent.click(screen.getByRole('button', { name: /check the sender details/i }));
  fireEvent.click(screen.getByRole('button', { name: /confirm and lock decision/i }));
}

describe('Batch 2B.2 mobile phone controls', () => {
  it('requires confirmation and prevents editing a locked decision', () => {
    begin();
    expect(screen.getByRole('button', { name: /phone home/i })).toBeInTheDocument();
    expect(document.querySelector('.phone-status-bar .phone-hardware-pill')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /check the sender details/i }));
    expect(screen.getByRole('dialog', { name: /confirm decision/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    fireEvent.click(screen.getByRole('button', { name: /review options again/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    lockFirst();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    fireEvent.click(screen.getByRole('button', { name: /phone recent/i }));
    expect(screen.getByRole('dialog', { name: /case log/i })).toHaveTextContent('Check the sender details');
    expect(screen.getByRole('dialog', { name: /case log/i })).toHaveTextContent('LOCKED');
  });

  it('supports Evidence list/detail, returns from X to list, and keeps score unchanged', () => {
    begin();
    fireEvent.click(screen.getByRole('button', { name: /^hint$/i }));
    expect(screen.getByRole('dialog', { name: /investigator hint/i })).toHaveTextContent(/recognizable display name/i);
    fireEvent.click(screen.getByRole('button', { name: /close investigator hint/i }));
    const evidence = screen.getByRole('button', { name: /^evidence$/i });
    fireEvent.click(evidence);
    fireEvent.click(screen.getByRole('button', { name: /sender identity/i }));
    expect(screen.getByRole('dialog', { name: /sender identity/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close evidence: sender identity/i }));
    expect(screen.getByRole('dialog', { name: /evidence locker/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /urgency claim/i }));
    expect(screen.getByRole('dialog', { name: /urgency claim/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('restores a locked choice across Home and reload without shrinking the phone', async () => {
    const view = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start investigation/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Play The Missing Package' }));
    fireEvent.click(screen.getByRole('button', { name: 'Start Investigation' }));
    fireEvent.click(screen.getByRole('button', { name: /continue to first decision/i }));
    const phone = document.querySelector('.phone-stage--interactive');
    lockFirst();
    expect(document.querySelector('.phone-stage--interactive')).toBe(phone);
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? '{}').missionRecords.parcel.score).toBe(20));
    fireEvent.click(screen.getByRole('button', { name: /phone home/i }));
    view.unmount();
    window.history.replaceState(null, '', '#/investigate');
    render(<App />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    expect(screen.getByText(/you inspect the sender/i)).toBeInTheDocument();
    expect(document.querySelector('.phone-stage--interactive .investigation-scroll')).toBeInTheDocument();
  });

  it('requires confirmation before restarting, clearing only selected mission', () => {
    begin();
    lockFirst();
    fireEvent.click(screen.getByRole('button', { name: /phone recent/i }));
    fireEvent.click(screen.getByRole('button', { name: /^restart mission$/i }));
    expect(screen.getByRole('dialog', { name: /restart mission/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /keep current progress/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    fireEvent.click(screen.getByRole('button', { name: /phone recent/i }));
    fireEvent.click(screen.getByRole('button', { name: /^restart mission$/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm restart mission/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('Incoming delivery alert')).toBeInTheDocument();
  });
});

describe('Versioned saved-session integrity', () => {
  it('loads a genuine decision but rejects tampered scores', () => {
    let session = startMission(createSession(), PARCEL_MISSION, 1);
    session = advance(session, PARCEL_MISSION, 2);
    session = choose(session, PARCEL_MISSION, 'inspect-sender', 3);
    persistSession(session);
    expect(loadSession().missionRecords.parcel.score).toBe(20);
    const tampered = JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? '{}');
    tampered.missionRecords.parcel.score = 100;
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(tampered));
    expect(loadSession().missionRecords.parcel.status).toBe('not_started');
  });

  it('does not rewrite or delete earlier three-decision sessions', () => {
    window.localStorage.setItem('scamsignal.session.v1', 'previous progress');
    expect(loadSession().missionRecords.parcel.status).toBe('not_started');
    expect(window.localStorage.getItem('scamsignal.session.v1')).toBe('previous progress');
  });
});
