import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MissionReview } from '../features/missions/MissionReview';
import { formatMissionReport, getReviewedDecisions } from '../features/missions/missionReviewModel';
import { PARCEL_MISSION } from '../features/missions/data/parcelMission';
import { advance, choose, createSession, getCurrentScene, startMission } from '../features/missions/engine/missionEngine';

function finishedRecord() {
  let session = startMission(createSession(), PARCEL_MISSION, 100);
  const choices = [
    'inspect-sender', 'verify-official', 'refuse-details', 'verify-support', 'save-report',
  ];
  for (const choice of choices) {
    while (getCurrentScene(session, PARCEL_MISSION).kind !== 'decision') {
      session = advance(session, PARCEL_MISSION);
    }
    session = choose(session, PARCEL_MISSION, choice);
  }
  while (getCurrentScene(session, PARCEL_MISSION).kind !== 'debrief') {
    session = advance(session, PARCEL_MISSION);
  }
  return session.missionRecords.parcel;
}

describe('Batch 2D mission completion report', () => {
  it('summarizes all five locked decisions without modifying the score', () => {
    const record = finishedRecord();
    const summary = getReviewedDecisions(record, PARCEL_MISSION);
    expect(summary).toHaveLength(5);
    expect(summary.map(row => row.points)).toEqual([20, 20, 20, 20, 20]);
    expect(record.score).toBe(100);
    const plain = formatMissionReport(record, PARCEL_MISSION);
    expect(plain).toContain('Score: 100/100');
    expect(plain).toContain('Decisions: 5');
    expect(plain).toContain('Safer approach:');
    expect(record.score).toBe(100);
  });

  it('renders five expandable review rows and a separate report copy control', () => {
    render(<MissionReview record={finishedRecord()} definition={PARCEL_MISSION} />);
    expect(screen.getByRole('region', { name: /mission decision review/i })).toBeInTheDocument();
    expect(screen.getAllByText(/20\/20/)).toHaveLength(5);
    expect(screen.getByRole('button', { name: /copy case report/i })).toBeInTheDocument();
  });

  it('copies only when the player activates the report button', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<MissionReview record={finishedRecord()} definition={PARCEL_MISSION} />);
    expect(writeText).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /copy case report/i }));
    expect(await screen.findByText('Case report copied.')).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toContain('Score: 100/100');
  });
});
