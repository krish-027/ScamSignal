import { describe, expect, it } from 'vitest';
import { assembleProgress } from '../features/progress/progressModel';
import { newRecruitment, answerRecruitment, RECRUITMENT_STEPS } from '../features/missions/internship/internshipModel';
import { createRefundSession, recordRefundResponse, REFUND_STEPS } from '../features/missions/refund/refundModel';
import type { MissionRecord } from '../types/mission';

function completedInternship() {
  let state = newRecruitment(100);
  for (const step of RECRUITMENT_STEPS) state = answerRecruitment(state,
    step.kind === 'puzzle' ? 'solved' : step.choices.find(answer => answer.outcome === 'safe')!.id);
  return state;
}
function completedRefund() {
  let state = createRefundSession(100);
  for (const step of REFUND_STEPS) state = recordRefundResponse(state,
    step.kind === 'puzzle' ? 'solved' : step.choices.find(answer => answer.outcome === 'safe')!.id);
  return state;
}
function parcel(status: 'in_progress' | 'completed', score: number, answered: number): MissionRecord {
  const decisions = Object.fromEntries(Array.from({ length: answered }, (_, index) =>
    [`checkpoint-${index + 1}`, { choiceId: `safe-${index + 1}`, pointsEarned: 20 }]));
  return { status, score, decisions } as unknown as MissionRecord;
}

describe('Batch 4A cross-mission progress and achievements', () => {
  it('starts at zero and does not fabricate accomplishments', () => {
    const result = assembleProgress(null, null, null);
    expect(result.completed).toBe(0);
    expect(result.actionsDone).toBe(0);
    expect(result.totalActions).toBe(27);
    expect(result.achievements.every(item => !item.unlocked)).toBe(true);
  });
  it('shows partial attempt points without counting the case completed', () => {
    const result = assembleProgress(parcel('in_progress', 40, 2), null, null);
    expect(result.completed).toBe(0);
    expect(result.missions[0]).toMatchObject({ answered: 2, status: 'in-progress', points: 40, total: 5 });
    expect(result.achievements[0].unlocked).toBe(false);
  });
  it('unlocks only achievements supported by recorded completion', () => {
    const result = assembleProgress(parcel('completed', 100, 5), completedInternship(), completedRefund());
    expect(result.completed).toBe(3);
    expect(result.actionsDone).toBe(27);
    expect(result.missions.map(mission => mission.points)).toEqual([100, 100, 100]);
    expect(result.achievements.every(item => item.unlocked)).toBe(true);
  });
  it('does not describe a non-perfect completion as a perfect record', () => {
    const result = assembleProgress(parcel('completed', 80, 5), completedInternship(), completedRefund());
    expect(result.achievements.find(item => item.id === 'perfect-record')?.unlocked).toBe(false);
    expect(result.achievements.find(item => item.id === 'three-cases')?.unlocked).toBe(true);
  });
  it('does not mutate the source sessions', () => {
    const recruitment = completedInternship();
    const refund = completedRefund();
    const before = JSON.stringify({ recruitment, refund });
    assembleProgress(null, recruitment, refund);
    expect(JSON.stringify({ recruitment, refund })).toBe(before);
  });
});
