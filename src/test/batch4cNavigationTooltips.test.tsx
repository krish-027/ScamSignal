import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MissionSelectPage } from '../features/missions/directory/MissionSelectPage';
import { ProgressPage } from '../features/progress/ProgressPage';
import { App } from '../app/App';
import { InternshipPage } from '../features/missions/internship/InternshipPage';
import { RefundPage } from '../features/missions/refund/RefundPage';

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '#/');
});

describe('Batch 4C navigation and icon-only labels', () => {
  it('places Back to Home first on mission selection, matching the Progress header', () => {
    const mission = render(<MissionSelectPage onSelect={vi.fn()} onBack={vi.fn()} />);
    const missionHeader = document.querySelector('.mission-select-header');
    expect(missionHeader?.firstElementChild?.textContent).toMatch(/back to home/i);
    mission.unmount();
    render(<ProgressPage onHome={vi.fn()} onMissions={vi.fn()} onSelectMission={vi.fn()} />);
    const progressHeader = document.querySelector('.progress-header');
    expect(progressHeader?.firstElementChild?.textContent).toMatch(/home/i);
  });

  it('retains Parcel tool accessible names and descriptive tooltip attributes', () => {
    window.history.replaceState(null, '', '#/investigate');
    render(<App />);
    const tools = document.querySelectorAll('.phone-tool-dock button[data-tooltip]');
    const navigation = document.querySelectorAll('.phone-system-nav button[data-tooltip]');
    expect(tools).toHaveLength(3);
    expect(navigation).toHaveLength(3);
    expect(screen.getByRole('button', { name: /phone home/i })).toHaveAttribute('data-tooltip', expect.stringMatching(/home/i));
    expect(screen.getByRole('button', { name: /phone recent/i })).toHaveAttribute('data-tooltip', expect.stringMatching(/recent/i));
  });

  it.each([
    ['internship', InternshipPage],
    ['refund', RefundPage],
  ] as const)('labels all six %s icon controls without depending on hover', (_name, Component) => {
    render(<Component onExit={vi.fn()} />);
    expect(document.querySelectorAll('.internship-tools button[data-tooltip]')).toHaveLength(3);
    expect(document.querySelectorAll('.internship-nav button[data-tooltip]')).toHaveLength(3);
    const controls = [...document.querySelectorAll<HTMLButtonElement>('.internship-tools button, .internship-nav button')];
    expect(controls.every(control => Boolean(control.getAttribute('aria-label')))).toBe(true);
  });
});
