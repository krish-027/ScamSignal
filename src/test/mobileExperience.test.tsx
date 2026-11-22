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
  fireEvent.click(screen.getByRole('button', { name: 'Start Investigation' }));
  fireEvent.click(screen.getByRole('button', { name: /continue to first decision/i }));
}

describe('Batch 2B.1 realistic phone controls', () => {
  it('requires confirmation before scoring and locks history after confirmation', () => {
    begin();
    expect(screen.getByRole('button', { name: /phone home/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /check the sender details/i }));
    expect(screen.getByRole('dialog', { name: /confirm decision/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    fireEvent.click(screen.getByRole('button', { name: /review options again/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    fireEvent.click(screen.getByRole('button', { name: /check the sender details/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm and lock decision/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    fireEvent.click(screen.getByRole('button', { name: /phone recent/i }));
    expect(screen.getByRole('dialog', { name: /case log/i })).toHaveTextContent('Check the sender details');
    expect(screen.getByRole('dialog', { name: /case log/i })).toHaveTextContent('LOCKED');
  });

  it('opens Evidence and Hint phone apps without awarding points', () => {
    begin();
    fireEvent.click(screen.getByRole('button', { name: /^hint$/i }));
    expect(screen.getByRole('dialog', { name: /investigator hint/i })).toHaveTextContent(/recognizable name/i);
    fireEvent.click(screen.getByRole('button', { name: /close investigator hint/i }));
    fireEvent.click(screen.getByRole('button', { name: /^evidence$/i }));
    fireEvent.click(screen.getByRole('button', { name: /sender identity/i }));
    expect(screen.getByRole('dialog', { name: /sender identity/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close evidence panel/i }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('resumes a locked decision after leaving and reopening the app', async () => {
    const view = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start investigation/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Start Investigation' }));
    fireEvent.click(screen.getByRole('button', { name: /continue to first decision/i }));
    fireEvent.click(screen.getByRole('button', { name: /check the sender details/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm and lock decision/i }));
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? '{}').missionRecords.parcel.score).toBe(30));
    fireEvent.click(screen.getByRole('button', { name: /phone home/i }));
    view.unmount();
    window.history.replaceState(null, '', '#/investigate');
    render(<App />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    expect(screen.getByText(/you inspect the sender/i)).toBeInTheDocument();
  });

  it('requires confirmation before restarting and clears only the selected mission', () => {
    begin();
    fireEvent.click(screen.getByRole('button', { name: /check the sender details/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm and lock decision/i }));
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

describe('Saved-session integrity', () => {
  it('loads an existing valid scene, and rejects changed score data', () => {
    let session = startMission(createSession(), PARCEL_MISSION, 1);
    session = advance(session, PARCEL_MISSION, 2);
    session = choose(session, PARCEL_MISSION, 'inspect-sender', 3);
    persistSession(session);
    expect(loadSession().missionRecords.parcel.score).toBe(30);
    const tampered = JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? '{}');
    tampered.missionRecords.parcel.score = 100;
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(tampered));
    expect(loadSession().missionRecords.parcel.status).toBe('not_started');
  });
});
